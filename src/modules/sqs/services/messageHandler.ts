import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSMessageBody } from '../interfaces/body.interface';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MessageHandler {
  constructor(private configService: ConfigService) {}

  @SqsMessageHandler('kinsend-dev')
  async handleMessage(message: AWS.SQS.Message) {
    // console.log(`Received message: ${message}`);
    const keys = Object.keys(message);
    console.log(JSON.parse(message.Body));
    console.log(keys);
    keys.forEach((key) => {
      // console.log(`key: ${key}, value: ${message[key]}`);
    });
  }
}
