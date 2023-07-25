import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { AWSModule } from '../aws/aws.module';
import { FormSubmissionModule } from '../form.submission/form.submission.module';
import { FormModule } from '../form/form.module';
import { MessageModule } from '../messages/message.module';
import { PaymentMonthlyModule } from '../payment.monthly/payment.monthly.module';
import { PaymentModule } from '../payment/payment.module';
import { SegmentModule } from '../segment/segment.module';
import { Segment, SegmentSchema } from '../segment/segment.schema';
import { SegmentFindByIdAction } from '../segment/services/SegmentFindByIdAction.service';
import { TagsGetByIdAction } from '../tags/services/TagsGetByIdAction.service';
import { TagsModule } from '../tags/tags.module';
import { Tags, TagsSchema } from '../tags/tags.schema';
import { UserModule } from '../user/user.module';
import { LinkRedirect, LinkRedirectSchema } from './link.redirect.schema';
import { LinkRediectCreateAction } from './services/link.redirect/LinkRediectCreateAction.service';
import { LinkRediectCreateByMessageAction } from './services/link.redirect/LinkRediectCreateByMessageAction.service';
import { LinkRedirectFinddByUpdateIdAction } from './services/link.redirect/LinkRedirectFindByUpdateIdAction.service';
import { UpdateReportingFindByUpdateIdWithoutErrorAction } from './services/update.reporting/UpdateReportingFindByUpdateIdWithoutErrorAction.service';
import { UpdateFindByIdAction } from './services/UpdateFindByIdAction.service';
import { UpdateFindByIdWithoutReportingAction } from './services/UpdateFindByIdWithoutReportingAction.service';
import { UpdateHandleSendSmsAction } from './services/UpdateHandleSendSmsAction.service';
import { UpdateChargeMessageTriggerAction } from './services/UpdateTriggerAction/UpdateChargeMessageTriggerAction';
import { UpdateUpdateProgressAction } from './services/UpdateUpdateProgressAction.service';
import {
  UpdateReporting,
  UpdateReportingSchema,
} from './update.reporting.schema';
import { UpdateSchedule, UpdateScheduleSchema } from './update.schedule.schema';
import { Update, UpdateSchema } from './update.schema';

@Module({
  controllers: [],
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: Update.name, schema: UpdateSchema },
      { name: LinkRedirect.name, schema: LinkRedirectSchema },
      { name: UpdateSchedule.name, schema: UpdateScheduleSchema },
      { name: UpdateReporting.name, schema: UpdateReportingSchema },
      { name: Tags.name, schema: TagsSchema },
      { name: Segment.name, schema: SegmentSchema },
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
    LinkRedirectFinddByUpdateIdAction,
    SegmentFindByIdAction,
    TagsGetByIdAction,
    UpdateReportingFindByUpdateIdWithoutErrorAction,
    UpdateFindByIdAction,
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
