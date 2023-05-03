import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AWSModule } from './modules/aws/aws.module';
import { SQSModule } from './modules/sqs/sqs.module';
import { ConfigModule } from './modules/config/config.module';

@Module({
  imports: [ConfigModule, AWSModule, SQSModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
