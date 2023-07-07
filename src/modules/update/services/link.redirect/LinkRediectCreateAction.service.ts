/* eslint-disable new-cap */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as randomstring from 'randomstring';
import { RequestContext } from '../../../../utils/RequestContext';
import { FormSubmissionDocument } from '../../../form.submission/form.submission.schema';
import { LinkRedirect, LinkRedirectDocument } from '../../link.redirect.schema';
import { UpdateDocument } from '../../update.schema';

@Injectable()
export class LinkRediectCreateAction {
  constructor(
    @InjectModel(LinkRedirect.name)
    private linkRedirectModel: Model<LinkRedirectDocument>,
  ) {}

  async execute(
    context: RequestContext,
    update: UpdateDocument,
    link: string,
    subscriber?: FormSubmissionDocument,
    isRoot = false,
  ): Promise<LinkRedirectDocument> {
    const randomUrl = randomstring.generate(7);

    return new this.linkRedirectModel({
      update,
      url: randomUrl,
      redirect: link,
      clicked: subscriber ? [subscriber] : [],
      isRoot,
      createdBy: context.user.id,
    }).save();
  }
}
