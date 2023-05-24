/* eslint-disable unicorn/prefer-module */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { ConfigService as ConfigEnvironmentService } from '../../configs/config.service';
import { MailSendGridService } from './mail-send-grid.service';

@Module({
  imports: [],
  providers: [MailSendGridService, ConfigEnvironmentService],
  exports: [MailSendGridService],
})
export class MailModule {}
