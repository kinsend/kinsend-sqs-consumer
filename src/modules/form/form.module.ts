import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CNAMEModule } from '../cname/cname.module';
import { CustomFieldsModule } from '../custom.fields/custom.fields.module';
import { Form, FormSchema } from './form.schema';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    CustomFieldsModule,
    CNAMEModule,
  ],
  providers: [],
  exports: [],
})
export class FormModule {}
