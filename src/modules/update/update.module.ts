import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSubmissionModule } from '../form.submission/form.submission.module';
import { FormModule } from '../form/form.module';
import { MessageModule } from '../messages/message.module';
import { PaymentMonthlyModule } from '../payment.monthly/payment.monthly.module';
import { PaymentModule } from '../payment/payment.module';
import { SegmentModule } from '../segment/segment.module';
import { TagsModule } from '../tags/tags.module';
import { LinkRedirect, LinkRedirectSchema } from './link.redirect.schema';
import { LinkRediectCreateAction } from './services/link.redirect/LinkRediectCreateAction.service';
import { LinkRediectCreateByMessageAction } from './services/link.redirect/LinkRediectCreateByMessageAction.service';
import { UpdateFindByIdWithoutReportingAction } from './services/UpdateFindByIdWithoutReportingAction.service';
import { UpdateChargeMessageTriggerAction } from './services/UpdateTriggerAction/UpdateChargeMessageTriggerAction';
import { UpdateUpdateProgressAction } from './services/UpdateUpdateProgressAction.service';
import { Update, UpdateSchema } from './update.schema';
import { UpdateSchedule, UpdateScheduleSchema } from './update.schedule.schema';
import { UpdateHandleSendSmsAction } from './services/UpdateHandleSendSmsAction.service';
import { SQSModule } from '../sqs/sqs.module';
import { AWSModule } from '../aws/aws.module';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [],
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: Update.name, schema: UpdateSchema },
      { name: LinkRedirect.name, schema: LinkRedirectSchema },
      { name: UpdateSchedule.name, schema: UpdateScheduleSchema },
    ]),
    TagsModule,
    SegmentModule,
    PaymentMonthlyModule,
    forwardRef(() => UserModule),
    forwardRef(() => FormModule),
    forwardRef(() => MessageModule),
    forwardRef(() => FormSubmissionModule),
    forwardRef(() => PaymentModule),
    AWSModule,
  ],
  providers: [
    LinkRediectCreateAction,
    LinkRediectCreateByMessageAction,
    UpdateFindByIdWithoutReportingAction,
    UpdateUpdateProgressAction,
    UpdateChargeMessageTriggerAction,
    UpdateHandleSendSmsAction,
  ],
  exports: [
    LinkRediectCreateAction,
    LinkRediectCreateByMessageAction,
    UpdateFindByIdWithoutReportingAction,
  ],
})
export class UpdateModule {}
