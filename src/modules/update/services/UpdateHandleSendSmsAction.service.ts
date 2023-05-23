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


import { UpdateSchedule, UpdateScheduleDocument } from '../update.schedule.schema';
import { LinkRediectCreateByMessageAction } from './link.redirect/LinkRediectCreateByMessageAction.service';
import { UpdateUpdateProgressAction } from './UpdateUpdateProgressAction.service';
import { UpdateFindByIdWithoutReportingAction } from './UpdateFindByIdWithoutReportingAction.service';
import { MessageCreateAction } from '../../messages/services/MessageCreateAction.service';
import { RequestContext } from '../../../utils/RequestContext';
import { SmsService } from '../../../shared/services/sms.service';
import { TYPE_MESSAGE } from '../../../domain/const';
import { UpdateChargeMessageTriggerAction } from './UpdateTriggerAction/UpdateChargeMessageTriggerAction';

import { FormSubmissionFindByIdAction } from 'src/modules/form.submission/services/FormSubmissionFindByIdAction.service';
import { getLinksInMessage } from 'src/utils/getLinksInMessage';
import { fillMergeFieldsToMessage } from '../../../utils/fillMergeFieldsToMessage';
import { UpdateDocument } from '../update.schema';
import { INTERVAL_TRIGGER_TYPE, UPDATE_PROGRESS } from '../interfaces/const';
import { FormSubmissionUpdateLastContactedAction } from '../../form.submission/services/FormSubmissionUpdateLastContactedAction.service';


@Injectable()
export class UpdateHandleSendSmsAction {

  constructor(
    private formSubmissionUpdateLastContactedAction : FormSubmissionUpdateLastContactedAction
  ){

  }

  // private readonly sqsService: SqsService;

  @Inject(MessageCreateAction) private messageCreateAction: MessageCreateAction;
  @Inject(UpdateChargeMessageTriggerAction)
  private updateChargeMessageTriggerAction: UpdateChargeMessageTriggerAction;

  @InjectModel(UpdateSchedule.name) private updateScheduleModel: Model<UpdateScheduleDocument>;


    // Created
  @Inject(FormSubmissionFindByIdAction)
  private formSubmissionFindByIdAction: FormSubmissionFindByIdAction;

  async handleSendSms(
    context: RequestContext,
    linkRediectCreateByMessageAction: LinkRediectCreateByMessageAction,
    updateUpdateProgressAction: UpdateUpdateProgressAction,
    smsService: SmsService,
    updateFindByIdWithoutReportingAction: UpdateFindByIdWithoutReportingAction,
    ownerPhoneNumber: string,
    subscribers: FormSubmission[],
    update: UpdateDocument,
    datetimeTrigger: Date,
    scheduleName: string,
  ): Promise<void> {

    const { logger } = context;
    
    const timeTriggerSchedule = new Date();

    await Promise.all(

      subscribers.map(async (sub) => {

        const { phoneNumber, firstName, lastName, email, _id } = sub;

        const subscriber = await this.formSubmissionFindByIdAction.execute(context, _id.toString());

        if (!subscriber || !subscriber.isSubscribed) {
          return;
        }

        const to = `+${phoneNumber.code}${phoneNumber.phone}`;

        const messageReview = await this.handleGenerateLinkRedirect(
          update,
          sub,
          context,
          linkRediectCreateByMessageAction,
        );

        const message = messageReview === null ? update.message : messageReview;

        const messageFilled = fillMergeFieldsToMessage(message, {
          fname: firstName,
          lname: lastName,
          name: firstName + lastName,
          mobile: to,
          email,
        });

        // Note: run async for update lastContacted
        this.formSubmissionUpdateLastContactedAction.execute(context, to, ownerPhoneNumber);

        return smsService.sendMessage(
          context,
          ownerPhoneNumber,
          messageFilled,
          update.fileUrl,
          to,
          `api/hook/sms/update/status/${update.id}`,
          this.saveSms(context, ownerPhoneNumber, to, messageFilled, update.fileUrl, update.id),
        );

      }),

    );
    if (update.triggerType === INTERVAL_TRIGGER_TYPE.ONCE) {
      // Note: update process for update type Once
      await updateUpdateProgressAction.execute(context, update.id, UPDATE_PROGRESS.DONE);
      await this.updateScheduleModel.updateOne(
        { scheduleName },
        {
          status: UPDATE_PROGRESS.DONE,
        },
      );
    }
    try {
      await this.updateChargeMessageTriggerAction.execute(context, update.id, timeTriggerSchedule);
    } catch (error) {
      logger.error(`Exception payment charges error by Stripe: ${error.message || error}`);
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
    linkRediectCreateByMessageAction: LinkRediectCreateByMessageAction,
  ) {
    const links = getLinksInMessage(update.message);
    if (links.length === 0) {
      return null;
    }
    const linkCreated = await linkRediectCreateByMessageAction.execute(
      context,
      update,
      subscriber as FormSubmissionDocument,
    );
    return linkCreated.messageReview;
  }
}
