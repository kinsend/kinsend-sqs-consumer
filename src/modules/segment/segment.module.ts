import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Segment, SegmentSchema } from './segment.schema';
import { SegmentFindByIdAction } from './services/SegmentFindByIdAction.service';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: Segment.name, schema: SegmentSchema }]),
  ],
  providers: [SegmentFindByIdAction],
  exports: [],
})
export class SegmentModule {}
