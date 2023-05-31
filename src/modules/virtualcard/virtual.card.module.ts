import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { VCard, VCardSchema } from './virtual.card.schema';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: VCard.name, schema: VCardSchema }]),
    forwardRef(() => UserModule),
  ],
  providers: [
  ],
  exports: [
  ],
})
export class VirtualCardModule {}
