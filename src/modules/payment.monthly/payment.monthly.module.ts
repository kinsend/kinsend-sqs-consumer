import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMonthly, PaymentMonthlySchema } from './payment.monthly.schema';
import { PaymentMonthlyCreateAction } from './services/PaymentMonthlyCreateAction.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PaymentMonthly.name, schema: PaymentMonthlySchema }]),
  ],
  providers: [PaymentMonthlyCreateAction],
  exports: [PaymentMonthlyCreateAction],
})
export class PaymentMonthlyModule {}
