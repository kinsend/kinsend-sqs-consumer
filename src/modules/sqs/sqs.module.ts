import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { AWSModule } from '../aws/aws.module';
import { MessageHandler } from './services/messageHandler';

@Module({
  imports: [
    AWSModule,
    ConfigModule,
    SqsModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        consumers: [
          {
            name: configService.get<string>('aws.sqsName'),
            queueUrl: configService.get<string>('aws.sqsUri'),
            region: configService.get<string>('aws.region'),
          },
        ],
        producers: [],
      }),
    }),
  ],
  controllers: [],
  providers: [MessageHandler, ConfigService],
})
export class SQSModule {}
