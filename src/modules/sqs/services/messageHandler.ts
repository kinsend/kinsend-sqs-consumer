import { Inject, Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as dotenv from 'dotenv';
import { UpdateHandleSendSmsAction } from 'src/modules/update/services/UpdateHandleSendSmsAction.service';
import { UpdateUpdateProgressAction } from 'src/modules/update/services/UpdateUpdateProgressAction.service';
import { LinkRediectCreateByMessageAction } from 'src/modules/update/services/link.redirect/LinkRediectCreateByMessageAction.service';
import { SmsService } from 'src/shared/services/sms.service';
import { rootLogger } from 'src/utils/Logger';
import { RequestContext } from 'src/utils/RequestContext';
dotenv.config();

@Injectable()
export class MessageHandler {
  constructor(
    // private configService: ConfigService,
    @Inject(LinkRediectCreateByMessageAction)
    private linkRediectCreateByMessageAction: LinkRediectCreateByMessageAction,

    // @Inject(FormSubmissionUpdateLastContactedAction)
    // private formSubmissionUpdateLastContactedAction: FormSubmissionUpdateLastContactedAction,

    @Inject(UpdateHandleSendSmsAction)
    private updateHandleSendSmsAction: UpdateHandleSendSmsAction,

    @Inject(UpdateUpdateProgressAction)
    private updateUpdateProgressAction: UpdateUpdateProgressAction,

    @Inject(SmsService) private smsService: SmsService,
  ) {}

  @SqsMessageHandler('kinsend-dev')
  async handleMessage(message: AWS.SQS.Message) {
    // const { MessageId: msgId } = message;
    let body: any = message.Body;
    body = JSON.parse(body) as any;
    let msg: any = body.message;
    msg = JSON.parse(msg);
    const { subscribers, ownerPhoneNumber, update, scheduleName } = msg.message;
    // console.log(
    //   'subscribers',
    //   subscribers,
    //   'ownerPhoneNumber',
    //   ownerPhoneNumber,
    //   'update',
    //   update,
    //   'scheduleName',
    //   scheduleName,
    // );
    const context: RequestContext = {
      logger: rootLogger,
      correlationId: '',
      user: {},
    };
    if (!update) {
      Logger.error('update not found');
    }
    if (!ownerPhoneNumber) {
      Logger.error('ownerPhoneNumber not found');
    }
    if (!subscribers) {
      Logger.error('subscribers not found');
    }
    if (subscribers.length < 1) {
      Logger.error('subscribers either not an array or is empty');
    }
    if (!scheduleName) {
      Logger.error('scheduleName not found');
    }
    // const tempNumber = '+19179058788';
    // const tempNumber = '+13613064427';
    this.updateHandleSendSmsAction.handleSendSms(
      context,
      this.linkRediectCreateByMessageAction,
      // this.formSubmissionUpdateLastContactedAction,
      this.updateUpdateProgressAction,
      this.smsService,
      // tempNumber,
      ownerPhoneNumber,
      subscribers,
      update,
      scheduleName,
    );
  }
}

// +19178891549
