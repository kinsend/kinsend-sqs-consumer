/* eslint-disable import/newline-after-import */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';
import { Transform } from 'class-transformer';
import { User } from '../user/user.schema';
import { FormSubmission } from '../form.submission/form.submission.schema';
import { PhoneNumber } from '../user/dtos/UserResponse.dto';
import { TYPE_MESSAGE } from '../../domain/const';

export type MessageDocument = Message & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class Message {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FormSubmission' })
  formSubmission: FormSubmission;

  @Prop({ type: String, required: false })
  updateId?: string;

  @Prop({ type: String, required: false })
  content?: string;

  @Prop({ type: String, required: false })
  fileAttached?: string;

  @Prop({ type: Date, required: true })
  dateSent: Date;

  @Prop({ type: Number, required: false })
  errorCode?: number;

  @Prop({ type: String, required: false })
  errorMessage?: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Boolean, required: true, default: false })
  statusPaid: boolean;

  @Prop({ type: String, required: true })
  phoneNumberSent: string;

  @Prop({ type: String, required: true })
  phoneNumberReceipted: string;

  @Prop({ type: Boolean, required: true, default: false })
  isSubscriberMessage: boolean;

  @Prop({ type: String, required: false })
  typeMessage?: TYPE_MESSAGE;
}

const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ status: 'text', content: 'text' });

export { MessageSchema };
