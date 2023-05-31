import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const port = parseInt(process.env.PORT, 10);
  const host = process.env.HOST;
  if (!port) throw new Error('Port is not defined');
  if (!host) throw new Error('Host is not defined');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );
  Logger.log(`🚀 Microservice SQS consumer ready at http://${host}:${port}`);
  await app.listen();
}
bootstrap();
