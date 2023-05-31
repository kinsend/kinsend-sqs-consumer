import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomFields, CustomFieldsSchema } from './custom.fields.schema';

@Module({
  controllers: [],
  imports: [MongooseModule.forFeature([{ name: CustomFields.name, schema: CustomFieldsSchema }])],
  providers: [],
  exports: [],
})
export class CustomFieldsModule {}
