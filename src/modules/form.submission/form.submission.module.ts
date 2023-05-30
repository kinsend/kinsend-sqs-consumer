import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormModule } from '../form/form.module';
import { UserModule } from '../user/user.module';
import { FormSubmission, FormSubmissionSchema } from './form.submission.schema';
import { FormSubmissionFindByIdAction } from './services/FormSubmissionFindByIdAction.service';
import { FormSubmissionFindByPhoneNumberAction } from './services/FormSubmissionFindByPhoneNumberAction.service';
import { FormSubmissionUpdateLastContactedAction } from './services/FormSubmissionUpdateLastContactedAction.service';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      { name: FormSubmission.name, schema: FormSubmissionSchema },
    ]),
    UserModule,
    forwardRef(() => FormModule),
  ],
  providers: [
    FormSubmissionFindByIdAction,
    FormSubmissionFindByPhoneNumberAction,
    FormSubmissionUpdateLastContactedAction,
  ],
  exports: [
    FormSubmissionFindByIdAction,
    FormSubmissionFindByPhoneNumberAction,
    FormSubmissionUpdateLastContactedAction,
  ],
})
export class FormSubmissionModule {}
