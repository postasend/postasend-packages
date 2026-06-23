import { HttpClient } from './http.js';
import { DomainsResource } from './resources/domains.js';
import { EmailsResource } from './resources/emails.js';
import { SendersResource } from './resources/senders.js';
import { TemplatesResource } from './resources/templates.js';
import { WebhooksResource } from './resources/webhooks.js';
import type { PostaSendOptions } from './types.js';

const DEFAULT_BASE_URL = 'https://api.postasend.com/v1';

export class PostaSend {
  readonly emails: EmailsResource;
  readonly templates: TemplatesResource;
  readonly domains: DomainsResource;
  readonly senders: SendersResource;
  readonly webhooks: WebhooksResource;

  constructor(options: PostaSendOptions) {
    if (!options.apiKey) throw new Error('PostaSend: apiKey is required');

    const http = new HttpClient(
      options.baseUrl ?? DEFAULT_BASE_URL,
      options.apiKey,
      options.timeout,
    );

    this.emails = new EmailsResource(http);
    this.templates = new TemplatesResource(http);
    this.domains = new DomainsResource(http);
    this.senders = new SendersResource(http);
    this.webhooks = new WebhooksResource(http);
  }
}
