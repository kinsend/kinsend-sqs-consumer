import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { AWSModule } from '../aws/aws.module';
import { MessageHandler } from './services/messageHandler';
import { SharedModule } from 'src/shared/shared.module';
import { UpdateModule } from '../update/update.module';
import { LinkRediectCreateByMessageAction } from '../update/services/link.redirect/LinkRediectCreateByMessageAction.service';
import { UpdateUpdateProgressAction } from '../update/services/UpdateUpdateProgressAction.service';
import { UpdateHandleSendSmsAction } from '../update/services/UpdateHandleSendSmsAction.service';
import { FormSubmissionUpdateLastContactedAction } from '../form.submission/services/FormSubmissionUpdateLastContactedAction.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LinkRedirect,
  LinkRedirectSchema,
} from '../update/link.redirect.schema';
import {
  FormSubmission,
  FormSubmissionSchema,
} from '../form.submission/form.submission.schema';

import { FormSubmissionFindByPhoneNumberAction } from '../form.submission/services/FormSubmissionFindByPhoneNumberAction.service';
import { UserFindByPhoneSystemAction } from '../user/services/UserFindByPhoneSystemAction.service';
import { Update, UpdateSchema } from '../update/update.schema';
import { User, UserSchema } from '../user/user.schema';
import { MessageCreateAction } from '../messages/services/MessageCreateAction.service';
import { Message, MessageSchema } from '../messages/message.schema';
import { UpdateChargeMessageTriggerAction } from '../update/services/UpdateTriggerAction/UpdateChargeMessageTriggerAction';
import { UserFindByIdAction } from '../user/services/UserFindByIdAction.service';
import { MessageUpdateManyAction } from '../messages/services/MessageUpdateManyAction.service';
import { PaymentSendInvoiceAction } from '../payment/services/PaymentSendInvoiceAction.service';
import { MessagesFindByConditionAction } from '../messages/services/MessagesFindByConditionAction.service';
import { PaymentMonthlyCreateAction } from '../payment.monthly/services/PaymentMonthlyCreateAction.service';
import {
  PaymentMonthly,
  PaymentMonthlySchema,
} from '../payment.monthly/payment.monthly.schema';
import {
  UpdateSchedule,
  UpdateScheduleSchema,
} from '../update/update.schedule.schema';
import { FormSubmissionFindByIdAction } from '../form.submission/services/FormSubmissionFindByIdAction.service';

@Module({
  imports: [
    AWSModule,
    UpdateModule,
    ConfigModule,
    SharedModule,
    MongooseModule.forFeature([
      { name: Update.name, schema: UpdateSchema },
      { name: LinkRedirect.name, schema: LinkRedirectSchema },
      { name: FormSubmission.name, schema: FormSubmissionSchema },
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
      { name: PaymentMonthly.name, schema: PaymentMonthlySchema },
      { name: UpdateSchedule.name, schema: UpdateScheduleSchema },
    ]),
    SqsModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        consumers: [
          {
            name: configService.get<string>('aws.sqsName'),
            queueUrl: configService.get<string>('aws.sqsUri'),
            region: configService.get<string>('aws.region'),
          },
        ],
        producers: [],
      }),
    }),
  ],
  controllers: [],
  providers: [
    MessageHandler,
    ConfigService,
    MessageCreateAction,
    LinkRediectCreateByMessageAction,
    FormSubmissionUpdateLastContactedAction,
    FormSubmissionFindByPhoneNumberAction,
    UpdateChargeMessageTriggerAction,
    UpdateHandleSendSmsAction,
    UserFindByIdAction,
    MessageUpdateManyAction,
    FormSubmissionFindByIdAction,
    PaymentMonthlyCreateAction,
    MessagesFindByConditionAction,
    PaymentSendInvoiceAction,
    UpdateUpdateProgressAction,
    UserFindByPhoneSystemAction,
  ],
})
export class SQSModule {}
