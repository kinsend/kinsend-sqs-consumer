import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SharedModule } from 'src/shared/shared.module';
import { AWSModule } from '../aws/aws.module';
import {
  FormSubmission,
  FormSubmissionSchema,
} from '../form.submission/form.submission.schema';
import { FormSubmissionUpdateLastContactedAction } from '../form.submission/services/FormSubmissionUpdateLastContactedAction.service';
import {
  LinkRedirect,
  LinkRedirectSchema,
} from '../update/link.redirect.schema';
import { UpdateHandleSendSmsAction } from '../update/services/UpdateHandleSendSmsAction.service';
import { UpdateUpdateProgressAction } from '../update/services/UpdateUpdateProgressAction.service';
import { LinkRediectCreateByMessageAction } from '../update/services/link.redirect/LinkRediectCreateByMessageAction.service';
import { UpdateModule } from '../update/update.module';
import { MessageHandler } from './services/messageHandler';

import { FormSubmissionFindByIdAction } from '../form.submission/services/FormSubmissionFindByIdAction.service';
import { FormSubmissionFindByPhoneNumberAction } from '../form.submission/services/FormSubmissionFindByPhoneNumberAction.service';
import { Message, MessageSchema } from '../messages/message.schema';
import { MessageCreateAction } from '../messages/services/MessageCreateAction.service';
import { MessageUpdateManyAction } from '../messages/services/MessageUpdateManyAction.service';
import { MessagesFindByConditionAction } from '../messages/services/MessagesFindByConditionAction.service';
import {
  PaymentMonthly,
  PaymentMonthlySchema,
} from '../payment.monthly/payment.monthly.schema';
import { PaymentMonthlyCreateAction } from '../payment.monthly/services/PaymentMonthlyCreateAction.service';
import { PaymentSendInvoiceAction } from '../payment/services/PaymentSendInvoiceAction.service';
import { Segment, SegmentSchema } from '../segment/segment.schema';
import { SegmentFindByIdAction } from '../segment/services/SegmentFindByIdAction.service';
import { TagsGetByIdAction } from '../tags/services/TagsGetByIdAction.service';
import { Tags, TagsSchema } from '../tags/tags.schema';
import { UpdateFindByIdAction } from '../update/services/UpdateFindByIdAction.service';
import { UpdateChargeMessageTriggerAction } from '../update/services/UpdateTriggerAction/UpdateChargeMessageTriggerAction';
import { LinkRedirectFinddByUpdateIdAction } from '../update/services/link.redirect/LinkRedirectFindByUpdateIdAction.service';
import { UpdateReportingFindByUpdateIdWithoutErrorAction } from '../update/services/update.reporting/UpdateReportingFindByUpdateIdWithoutErrorAction.service';
import {
  UpdateReporting,
  UpdateReportingSchema,
} from '../update/update.reporting.schema';
import {
  UpdateSchedule,
  UpdateScheduleSchema,
} from '../update/update.schedule.schema';
import { Update, UpdateSchema } from '../update/update.schema';
import { UserFindByIdAction } from '../user/services/UserFindByIdAction.service';
import { UserFindByPhoneSystemAction } from '../user/services/UserFindByPhoneSystemAction.service';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    AWSModule,
    UpdateModule,
    ConfigModule,
    SharedModule,
    MongooseModule.forFeature([
      { name: FormSubmission.name, schema: FormSubmissionSchema },
      { name: LinkRedirect.name, schema: LinkRedirectSchema },
      { name: Message.name, schema: MessageSchema },
      { name: PaymentMonthly.name, schema: PaymentMonthlySchema },
      { name: Segment.name, schema: SegmentSchema },
      { name: Tags.name, schema: TagsSchema },
      { name: Update.name, schema: UpdateSchema },
      { name: UpdateSchedule.name, schema: UpdateScheduleSchema },
      { name: UpdateReporting.name, schema: UpdateReportingSchema },
      { name: User.name, schema: UserSchema },
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
    ConfigService,
    FormSubmissionUpdateLastContactedAction,
    FormSubmissionFindByPhoneNumberAction,
    FormSubmissionFindByIdAction,
    LinkRediectCreateByMessageAction,
    LinkRedirectFinddByUpdateIdAction,
    MessageHandler,
    MessageCreateAction,
    MessageUpdateManyAction,
    MessagesFindByConditionAction,
    PaymentMonthlyCreateAction,
    PaymentSendInvoiceAction,
    SegmentFindByIdAction,
    TagsGetByIdAction,
    UpdateChargeMessageTriggerAction,
    UpdateFindByIdAction,
    UpdateHandleSendSmsAction,
    UpdateUpdateProgressAction,
    UpdateReportingFindByUpdateIdWithoutErrorAction,
    UserFindByPhoneSystemAction,
    UserFindByIdAction,
  ],
})
export class SQSModule {}
