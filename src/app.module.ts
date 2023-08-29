import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AWSModule } from './modules/aws/aws.module';
import { SQSModule } from './modules/sqs/sqs.module';
import { ConfigModule } from './modules/config/config.module';
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { VirtualCardModule } from './modules/virtualcard/virtual.card.module';
import { TagsModule } from './modules/tags/tags.module';
import { CustomFieldsModule } from './modules/custom.fields/custom.fields.module';
import { FormModule } from './modules/form/form.module';
import { FormSubmissionModule } from './modules/form.submission/form.submission.module';
import { CNAMEModule } from './modules/cname/cname.module';
import { UpdateModule } from './modules/update/update.module';
import { MessageModule } from './modules/messages/message.module';
import { SharedModule } from './shared/shared.module';
import { PlanSubscriptionModule } from './modules/plan-subscription/plan-subscription.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule,
    AWSModule,
    SQSModule,
    UserModule,
    PaymentModule,
    SubscriptionModule,
    VirtualCardModule,
    TagsModule,
    CustomFieldsModule,
    FormModule,
    FormSubmissionModule,
    CNAMEModule,
    UpdateModule,
    MessageModule,
    AWSModule,
    PlanSubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
