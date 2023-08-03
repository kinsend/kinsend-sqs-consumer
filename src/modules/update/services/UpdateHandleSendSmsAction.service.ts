/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FormSubmission,
  FormSubmissionDocument,
} from 'src/modules/form.submission/form.submission.schema';

import { REGION_DOMESTIC, TYPE_MESSAGE } from '../../../domain/const';
import { SmsService } from '../../../shared/services/sms.service';
import { RequestContext } from '../../../utils/RequestContext';
import { MessageCreateAction } from '../../messages/services/MessageCreateAction.service';
import {
  UpdateSchedule,
  UpdateScheduleDocument,
} from '../update.schedule.schema';
import { UpdateChargeMessageTriggerAction } from './UpdateTriggerAction/UpdateChargeMessageTriggerAction';
import { UpdateUpdateProgressAction } from './UpdateUpdateProgressAction.service';
import { LinkRediectCreateByMessageAction } from './link.redirect/LinkRediectCreateByMessageAction.service';

import { AWSCloudWatchLoggerService } from 'src/modules/aws/services/aws-cloudwatch-logger.service';
import { FormSubmissionFindByIdAction } from 'src/modules/form.submission/services/FormSubmissionFindByIdAction.service';
import { MailSendGridService } from 'src/modules/mail/mail-send-grid.service';
import { getHostname } from 'src/utils/getHostname';
import { getLinksInMessage } from 'src/utils/getLinksInMessage';
import { getLogStream } from 'src/utils/getLogStream';
import { putLogEvent } from 'src/utils/putLogEvent';
import { regionPhoneNumber } from 'src/utils/utilsPhoneNumber';
import { ConfigService } from '../../../configs/config.service';
import { fillMergeFieldsToMessage } from '../../../utils/fillMergeFieldsToMessage';
import { FormSubmissionUpdateLastContactedAction } from '../../form.submission/services/FormSubmissionUpdateLastContactedAction.service';
import { INTERVAL_TRIGGER_TYPE, UPDATE_PROGRESS } from '../interfaces/const';
import { UpdateDocument } from '../update.schema';
import * as util from "util";

@Injectable()
export class UpdateHandleSendSmsAction {
  constructor(
    private formSubmissionUpdateLastContactedAction: FormSubmissionUpdateLastContactedAction,
    private mailService: MailSendGridService,
    private readonly configService: ConfigService,
    @Inject(LinkRediectCreateByMessageAction)
    private linkRediectCreateByMessageAction: LinkRediectCreateByMessageAction,
    @Inject(AWSCloudWatchLoggerService)
    private awsCloudWatchLoggerService: AWSCloudWatchLoggerService,
  ) {}

  @Inject(MessageCreateAction) private messageCreateAction: MessageCreateAction;
  @Inject(UpdateChargeMessageTriggerAction)
  private updateChargeMessageTriggerAction: UpdateChargeMessageTriggerAction;

  @InjectModel(UpdateSchedule.name)
  private updateScheduleModel: Model<UpdateScheduleDocument>;

  @Inject(FormSubmissionFindByIdAction)
  private formSubmissionFindByIdAction: FormSubmissionFindByIdAction;

  async handleSendSms(
    context: RequestContext,
    linkRediectCreateByMessageAction: LinkRediectCreateByMessageAction,
    updateUpdateProgressAction: UpdateUpdateProgressAction,
    smsService: SmsService,
    ownerPhoneNumber: string,
    ownerEmail: string,
    subscribers: FormSubmission[],
    update: UpdateDocument,
    scheduleName: string,
  ): Promise<void> {
    const { logger } = context;

    const timeTriggerSchedule = new Date();
    await Promise.all(
      subscribers.map(async (sub) => {
        const { phoneNumber, firstName, lastName, email, _id } = sub;

        Logger.log(`Sending message to ${email}`);

        const subscriber = await this.formSubmissionFindByIdAction.execute(
          context,
          _id.toString(),
        );

        if (!subscriber || !subscriber.isSubscribed) {
          return;
        }

        const to = `+${phoneNumber.code}${phoneNumber.phone}`;

        const messageReview = await this.handleGenerateLinkRedirect(
          update,
          sub,
          context,
        );

        const message = messageReview === null ? update.message : messageReview;

        const messageFilled = fillMergeFieldsToMessage(message, {
          fname: firstName,
          lname: lastName,
          name: firstName + lastName,
          mobile: to,
          email,
        });

        this.formSubmissionUpdateLastContactedAction.execute(
          context,
          to,
          ownerPhoneNumber,
        );

        const testEmails: string[] = this.configService.testEmails;
        const isTestEmail = testEmails.includes(ownerEmail);

        const logGroup = 'kinsend-sqs-consumer';
        const hostname = await getHostname();
        const logStream = getLogStream(hostname, email);
        const logMessage = util.format("Sending message to %s%s\nMessage Content: %s", to, (isTestEmail ? '\nSMS SKIPPED - test email detected' : ''), messageFilled)

        putLogEvent(this.awsCloudWatchLoggerService, logGroup, logStream, logMessage);

        if (isTestEmail) {
            // Prevent sending SMS messages when test email has been used.
            // This is used for SQS testing.
            return;
        }

        return smsService.sendMessage(
          context,
          ownerPhoneNumber,
          messageFilled,
          update.fileUrl,
          to,
          `api/hook/sms/update/status/${update.id}`,
          this.saveSms(
            context,
            ownerPhoneNumber,
            to,
            messageFilled,
            update.fileUrl,
            update.id,
          ),
        );
      }),
    );
    if (update.triggerType === INTERVAL_TRIGGER_TYPE.ONCE) {
      // Note: update process for update type Once
      await updateUpdateProgressAction.execute(
        context,
        update.id,
        UPDATE_PROGRESS.DONE,
      );
      await this.updateScheduleModel.updateOne(
        { scheduleName },
        {
          status: UPDATE_PROGRESS.DONE,
        },
      );
    }
    try {
      await this.updateChargeMessageTriggerAction.execute(
        context,
        update.id,
        timeTriggerSchedule,
      );
    } catch (error) {
      logger.error(
        `Exception payment charges error by Stripe: ${error.message || error}`,
      );
    }
  }

  private saveSms(
    context: RequestContext,
    from: string,
    to: string,
    message: string,
    file?: string,
    updateId?: string,
  ) {
    return (status = 'success', error?: string) =>
      this.messageCreateAction.execute(context, {
        content: message,
        updateId,
        dateSent: new Date(),
        isSubscriberMessage: false,
        status,
        fileAttached: file,
        phoneNumberSent: from,
        phoneNumberReceipted: to,
        errorMessage: error,
        typeMessage: !file ? this.handleTypeMessage(to) : TYPE_MESSAGE.MMS,
      });
  }

  private async handleGenerateLinkRedirect(
    update: UpdateDocument,
    subscriber: FormSubmission,
    context: RequestContext,
    // linkRediectCreateByMessageAction: LinkRediectCreateByMessageAction,
  ) {
    const links = getLinksInMessage(update.message);
    if (links.length === 0) {
      return null;
    }
    const linkCreated = await this.linkRediectCreateByMessageAction.execute(
      context,
      update,
      subscriber as FormSubmissionDocument,
    );
    return linkCreated.messageReview;
  }

  private handleTypeMessage(phoneNumberReceipted: string): TYPE_MESSAGE {
    const region = regionPhoneNumber(phoneNumberReceipted);
    if (!region || region === REGION_DOMESTIC) {
      return TYPE_MESSAGE.MESSAGE_UPDATE_DOMESTIC;
    }
    return TYPE_MESSAGE.MESSAGE_UPDATE_INTERNATIONAL;
  }
}
