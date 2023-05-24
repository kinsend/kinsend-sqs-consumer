import { Module } from '@nestjs/common';
import { FormSubmissionModule } from '../form.submission/form.submission.module';
import { MessageModule } from '../messages/message.module';
import { PaymentMonthlyModule } from '../payment.monthly/payment.monthly.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    PaymentMonthlyModule,
    MessageModule,
    FormSubmissionModule,
    PaymentModule,
  ],
  exports: [],
})
export class SubscriptionModule {}
