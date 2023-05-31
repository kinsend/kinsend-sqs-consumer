import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CNAME, CNAMESchema } from './cname.schema';

@Module({
  controllers: [],
  imports: [MongooseModule.forFeature([{ name: CNAME.name, schema: CNAMESchema }])],
  providers: [],
  exports: [],
})
export class CNAMEModule {}
