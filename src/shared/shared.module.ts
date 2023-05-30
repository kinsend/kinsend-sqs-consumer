import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbConfigService } from '../configs/mongodb.config.service';
import { MailModule } from '../modules/mail/mail.module';
import { SmsService } from './services/sms.service';
import { StripeService } from './services/stripe.service';
import { ConfigService } from '../configs/config.service';

const configService = new ConfigService();
const { jwtSecret, accessTokenExpiry } = configService;
@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbConfigService,
    }),
    MailModule,
  ],
  exports: [ConfigService, SmsService, StripeService, MailModule, CacheModule],
  providers: [ConfigService, SmsService, StripeService],
})
export class SharedModule {}
