/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PLAN_PAYMENT_METHOD } from 'src/modules/plan-subscription/plan-subscription.constant';
import { TYPE_MESSAGE } from '../../../domain/const';
import { RequestContext } from '../../../utils/RequestContext';
import { convertStringToPhoneNumber } from '../../../utils/convertStringToPhoneNumber';
import { FormSubmissionDocument } from '../../form.submission/form.submission.schema';
import { FormSubmissionFindByPhoneNumberAction } from '../../form.submission/services/FormSubmissionFindByPhoneNumberAction.service';
import { PlanSubscriptionGetByUserIdAction } from '../../plan-subscription/services/plan-subscription-get-by-user-id-action.service';
import { UserFindByPhoneSystemAction } from '../../user/services/UserFindByPhoneSystemAction.service';
import { UserDocument } from '../../user/user.schema';
import { MessageCreatePayloadDto } from '../dtos/MessageCreatePayloadDto.dto';
import { Message, MessageDocument } from '../message.schema';

@Injectable()
export class MessageCreateAction {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private formSubmissionFindByPhoneNumberAction: FormSubmissionFindByPhoneNumberAction,
    private userFindByPhoneSystemAction: UserFindByPhoneSystemAction,
    private planSubscriptionGetByUserIdAction: PlanSubscriptionGetByUserIdAction,
  ) {}

  async execute(
    context: RequestContext,
    payload: MessageCreatePayloadDto,
  ): Promise<MessageDocument> {
    const {
      isSubscriberMessage,
      phoneNumberReceipted,
      phoneNumberSent,
      fileAttached,
      typeMessage,
    } = payload;
    const { user } = context;
    const planSubscription =
      await this.planSubscriptionGetByUserIdAction.execute(user.id);
    const subscribers =
      await this.formSubmissionFindByPhoneNumberAction.execute(
        context,
        convertStringToPhoneNumber(
          isSubscriberMessage ? phoneNumberSent : phoneNumberReceipted,
        ),
      );

    const userModel = await this.userFindByPhoneSystemAction.execute(
      convertStringToPhoneNumber(
        isSubscriberMessage ? phoneNumberReceipted : phoneNumberSent,
      ),
    );
    const subscriber = this.getSubcriberByOwner(subscribers, userModel[0]);
    const type = typeMessage
      ? typeMessage
      : fileAttached
      ? TYPE_MESSAGE.MMS
      : undefined;

    return new this.messageModel({
      ...payload,
      typeMessage: type,
      formSubmission: subscriber,
      user: userModel[0],
      statusPaid:
        planSubscription?.planPaymentMethod === PLAN_PAYMENT_METHOD.MONTHLY
          ? true
          : false,
    }).save();
  }

  private getSubcriberByOwner(
    subscribers: FormSubmissionDocument[],
    owner: UserDocument,
  ) {
    const subs = subscribers.filter(
      (sub) => sub.owner.toString() === owner._id.toString(),
    );
    return subs[0];
  }
}
