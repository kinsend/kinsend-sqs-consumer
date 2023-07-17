/* eslint-disable no-await-in-loop */
/* eslint-disable new-cap */
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../../../../configs/config.service';
import { RequestContext } from '../../../../utils/RequestContext';
import { regexLink } from '../../../../utils/getLinksInMessage';
import { FormSubmissionDocument } from '../../../form.submission/form.submission.schema';
import { UpdateDocument } from '../../update.schema';
import { LinkRediectCreateAction } from './LinkRediectCreateAction.service';

@Injectable()
export class LinkRediectCreateByMessageAction {
  constructor(
    private readonly configService: ConfigService,
    @Inject(LinkRediectCreateAction)
    private linkRediectCreateAction: LinkRediectCreateAction,
  ) {}

  async execute(
    context: RequestContext,
    update: UpdateDocument,
    subscriber?: FormSubmissionDocument,
    isRoot = false,
  ): Promise<{ messageReview: string }> {
    const messagesResponse: string[] = [];
    for (const item of update.message.split(/[\n '()|]/)) {
      if (regexLink.test(item)) {
        const linkCreated = await this.linkRediectCreateAction.execute(
          context,
          update,
          item,
          subscriber,
          isRoot,
        );
        messagesResponse.push(
          `${this.configService.backendDomain}/${linkCreated.url}`,
        );
      } else {
        messagesResponse.push(item);
      }
    }
    const messageReview = messagesResponse.join(' ');
    await update.updateOne({
      messageReview,
    });
    return { messageReview };
  }
}
