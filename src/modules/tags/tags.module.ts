import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsGetByIdAction } from './services/TagsGetByIdAction.service';
import { Tags, TagsSchema } from './tags.schema';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }]),
  ],
  providers: [TagsGetByIdAction],
  exports: [],
})
export class TagsModule {}
