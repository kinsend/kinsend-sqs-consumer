/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '../../configs/config.service';

@Injectable()
export class MailSendGridService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.sendGridApiKey);
  }

  async sendUserConfirmation(
    mail: SendGrid.MailDataRequired,
  ): Promise<[SendGrid.ClientResponse, {}] | undefined> {
    try {
      const transport = await SendGrid.send(mail);
      return transport;
    } catch (err) {
      console.log('error :>> ', err);
      return undefined;
    }
  }

  async sendUserStatusPayment(
    mail: SendGrid.MailDataRequired,
  ): Promise<[SendGrid.ClientResponse, {}] | undefined> {
    try {
      const transport = await SendGrid.send(mail);
      return transport;
    } catch (err) {
      return undefined;
    }
  }
}
