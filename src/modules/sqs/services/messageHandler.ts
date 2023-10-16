import { Inject, Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as dotenv from 'dotenv';
import { UpdateFindByIdAction } from 'src/modules/update/services/UpdateFindByIdAction.service';
import { UpdateHandleSendSmsAction } from 'src/modules/update/services/UpdateHandleSendSmsAction.service';
import { UpdateUpdateProgressAction } from 'src/modules/update/services/UpdateUpdateProgressAction.service';
import { LinkRediectCreateByMessageAction } from 'src/modules/update/services/link.redirect/LinkRediectCreateByMessageAction.service';
import { UserFindByIdAction } from 'src/modules/user/services/UserFindByIdAction.service';
import { SmsService } from 'src/shared/services/sms.service';
import { rootLogger } from 'src/utils/Logger';
import { RequestContext } from 'src/utils/RequestContext';
dotenv.config();

@Injectable()
export class MessageHandler {
  constructor(
    @Inject(LinkRediectCreateByMessageAction)
    private linkRediectCreateByMessageAction: LinkRediectCreateByMessageAction,

    @Inject(UpdateHandleSendSmsAction)
    private updateHandleSendSmsAction: UpdateHandleSendSmsAction,

    @Inject(UpdateUpdateProgressAction)
    private updateUpdateProgressAction: UpdateUpdateProgressAction,

    @Inject(SmsService) private smsService: SmsService,

    @Inject(UpdateFindByIdAction)
    private updateFindByIdAction: UpdateFindByIdAction,

    @Inject(UserFindByIdAction)
    private userFindByIdAction: UserFindByIdAction,
  ) {}

  @SqsMessageHandler(process.env.AWS_SQS_NAME)
  async handleMessage(message: AWS.SQS.Message) {
    let body: any = message.Body;
    body = JSON.parse(body) as any;
    let msg: any = body.message;
    msg = JSON.parse(msg);
    const {
      subscribers,
      ownerPhoneNumber,
      update: updateId,
      scheduleName,
    } = msg.message;
    const context: RequestContext = {
      logger: rootLogger,
      correlationId: '',
      user: {},
    };
    if (!updateId) {
      return Logger.error('update not found');
    }
    if (!ownerPhoneNumber) {
      return Logger.error('ownerPhoneNumber not found');
    }
    if (!subscribers) {
      return Logger.error('subscribers not found');
    }
    if (subscribers.length < 1) {
      return Logger.error('subscribers either not an array or is empty');
    }
    if (!scheduleName) {
      return Logger.error('scheduleName not found');
    }

    const update = await this.updateFindByIdAction.execute(context, updateId);
    const owner = await this.userFindByIdAction.execute(
      context,
      String(update.createdBy),
    );
    context.user = owner || {};
    if (!update) {
      return Logger.error('update not found');
    }

    this.updateHandleSendSmsAction.handleSendSms(
      context,
      this.linkRediectCreateByMessageAction,
      this.updateUpdateProgressAction,
      this.smsService,
      ownerPhoneNumber,
      owner.email,
      subscribers,
      update,
      scheduleName,
    );
  }
}
