export type EmailAddress = string | { email: string; name?: string };

export interface Attachment {
  filename: string;
  content: string;
  contentType: string;
  contentId?: string;
}

export interface SendEmailOptions {
  from: EmailAddress;
  to: EmailAddress | EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  replyTo?: EmailAddress;
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  tag?: string;
  trackOpens?: boolean;
  trackLinks?: boolean;
  metadata?: Record<string, string>;
  scheduledAt?: string;
}

export interface BatchSendOptions {
  messages: SendEmailOptions[];
}

export interface CreateTemplateOptions {
  name: string;
  alias?: string;
  subject: string;
  htmlBody?: string;
  textBody?: string;
  previewText?: string;
  variables?: Record<string, unknown>;
  isActive?: boolean;
}

export type UpdateTemplateOptions = Partial<CreateTemplateOptions>;

export interface ListOptions {
  page?: number;
  perPage?: number;
}

export type EmailStatus =
  | 'QUEUED'
  | 'SENDING'
  | 'DELIVERED'
  | 'OPENED'
  | 'CLICKED'
  | 'BOUNCED'
  | 'FAILED'
  | 'SPAM'
  | 'UNSUBSCRIBED';

export interface EmailListOptions extends ListOptions {
  status?: EmailStatus;
  tag?: string;
}

export interface EmailStatsOptions {
  from?: string;
  to?: string;
  tag?: string;
}

export interface EmailChartOptions {
  from: string;
  to: string;
}

export interface CreateSenderOptions {
  email: string;
  name?: string;
  isDefault?: boolean;
}

export type WebhookEventType =
  | 'DELIVERY'
  | 'BOUNCE'
  | 'OPEN'
  | 'CLICK'
  | 'SPAM_COMPLAINT'
  | 'UNSUBSCRIBE'
  | 'SUBSCRIPTION_CHANGE'
  | '*';

export interface CreateWebhookOptions {
  url: string;
  description?: string;
  events: WebhookEventType[];
  active?: boolean;
}

export type UpdateWebhookOptions = Partial<CreateWebhookOptions>;

export interface AddSuppressionOptions {
  email: string;
  reason?: string;
}

export interface PostaSendOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}
