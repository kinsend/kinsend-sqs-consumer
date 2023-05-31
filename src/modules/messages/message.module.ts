import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSubmissionModule } from '../form.submission/form.submission.module';
import { UserModule } from '../user/user.module';
import { Message, MessageSchema } from './message.schema';
import { MessageCreateAction } from './services/MessageCreateAction.service';
import { MessagesFindByConditionAction } from './services/MessagesFindByConditionAction.service';
import { MessageUpdateManyAction } from './services/MessageUpdateManyAction.service';

@Module({
  imports: [
    forwardRef(() => FormSubmissionModule),
    UserModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [],
  providers: [
    MessageCreateAction,
    MessagesFindByConditionAction,
    MessageUpdateManyAction,
  ],
  exports: [MessageCreateAction, MessagesFindByConditionAction, MessageUpdateManyAction],
})
export class MessageModule {}
