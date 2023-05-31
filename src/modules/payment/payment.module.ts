import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { User, UserSchema } from '../user/user.schema';
import { PaymentSendInvoiceAction } from './services/PaymentSendInvoiceAction.service';

@Module({
  controllers: [],
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    PaymentSendInvoiceAction
  ],
  exports: [PaymentSendInvoiceAction]
})
export class PaymentModule {}
