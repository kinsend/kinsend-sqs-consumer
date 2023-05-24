import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserFindByIdAction } from './services/UserFindByIdAction.service';
import { CNAMEModule } from '../cname/cname.module';
import { UserFindByPhoneSystemAction } from './services/UserFindByPhoneSystemAction.service';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => CNAMEModule),
  ],
  providers: [
    UserFindByIdAction,
    UserFindByPhoneSystemAction,
  ],
  exports: [
    UserFindByIdAction,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserFindByPhoneSystemAction,
  ],
})
export class UserModule {}
