import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tags, TagsSchema } from './tags.schema';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }]),
  ],
  providers: [],
  exports: [],
})
export class TagsModule {}
