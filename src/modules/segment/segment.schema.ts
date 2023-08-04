/* eslint-disable max-classes-per-file */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';
import { User } from '../user/user.schema';
import { Filter } from './dtos/SegmentCreatePayload.dto';

export type SegmentDocument = Segment & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Segment {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
  user: User;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ required: true })
  filters: [[Filter]];

  @Prop({ default: Date.now, type: Date })
  createdAt: Date;
}

const SegmentSchema = SchemaFactory.createForClass(Segment);
export { SegmentSchema };
