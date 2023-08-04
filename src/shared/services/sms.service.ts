/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PRICE_PER_MESSAGE_INTERNATIONAL } from 'src/domain/const';
import { Twilio } from 'twilio';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import { ConfigService } from '../../configs/config.service';
import { RequestContext } from '../../utils/RequestContext';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    const { twilioAccountSid, twilioAuthToken } = this.configService;
    this.twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);
  }

  async sendMessage(
    context: RequestContext,
    from: string,
    message: string,
    fileUrl: string | undefined,
    to: string,
    callbackUrl?: string,
    callbackSaveSms?: (status?: string, error?: any) => Promise<any>,
  ): Promise<void> {
    const { logger, correlationId } = context;
    try {
      const payload: MessageListInstanceCreateOptions = {
        from,
        to,
      };
      if (message) {
        payload.body = message;
      }

      if (fileUrl) {
        payload.mediaUrl = [fileUrl];
      }

      if (callbackUrl) {
        payload.statusCallback = `${this.configService.backendDomain}/${callbackUrl}`;
      }
      const result = await this.twilioClient.messages.create(payload);
      logger.info({
        correlationId,
        message: 'Send message successful!',
        result: 'ok',
        to,
      });
      if (callbackSaveSms) {
        await callbackSaveSms();
      }
    } catch (error: any) {
      const errorMessage = error.message || error;

      logger.error({
        correlationId,
        message: 'Send message fail to ' + to,
        error: errorMessage,
        to,
      });
      if (callbackSaveSms) {
        await callbackSaveSms('failed', JSON.stringify(error));
      }
    }
  }

  async getPriceSendMessage(
    context: RequestContext,
    region: string,
  ): Promise<number> {
    const { logger, correlationId } = context;
    try {
      const twilioClientCountries =
        this.twilioClient.pricing.v1.messaging.countries;
      if (!twilioClientCountries) {
        logger.error({
          correlationId,
          message: 'Get price message fail!',
        });
        return PRICE_PER_MESSAGE_INTERNATIONAL;
      }
      const countryPricing = await twilioClientCountries(region).fetch();
      const price = (countryPricing.outboundSmsPrices as any)[0].prices[0]
        .current_price;
      return price;
    } catch (error: any) {
      const errorMessage = error.message || error;
      logger.error({
        correlationId,
        msg: 'Request buy phone numbers error',
        error: errorMessage,
      });
      return PRICE_PER_MESSAGE_INTERNATIONAL;
    }
  }
}
