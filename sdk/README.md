# postasend

Official Node.js SDK for the [PostaSend](https://postasend.com) email API.

## Installation

```bash
npm install postasend
# or
yarn add postasend
# or
pnpm add postasend
```

Requires Node.js ≥ 18. Ships with TypeScript declarations — no `@types/` package needed.

## Quick start

```ts
import { PostaSend } from 'postasend';

const client = new PostaSend({ apiKey: process.env.POSTASEND_API_KEY! });

await client.emails.send({
  from: 'hello@yourdomain.com',
  to: 'user@example.com',
  subject: 'Welcome aboard',
  html: '<p>Great to have you!</p>',
  text: 'Great to have you!',
});
```

## Client options

```ts
new PostaSend({
  apiKey: 'ps_live_...',  // required — from your PostaSend dashboard
  baseUrl: '...',         // optional — override for self-hosted instances
  timeout: 10_000,        // optional — request timeout in ms (default: none)
})
```

## Emails

### Send a single email

```ts
await client.emails.send({
  from: 'hello@yourdomain.com',             // string or { email, name }
  to: 'user@example.com',                   // string, { email, name }, or array
  cc: ['cc@example.com'],
  bcc: [{ email: 'bcc@example.com' }],
  replyTo: 'support@yourdomain.com',
  subject: 'Your order has shipped',
  html: '<p>Track it <a href="...">here</a></p>',
  text: 'Track it at ...',
  attachments: [
    {
      filename: 'invoice.pdf',
      content: '<base64-encoded content>',
      contentType: 'application/pdf',
    },
  ],
  headers: { 'X-Custom-Header': 'value' },
  tag: 'transactional',
  trackOpens: true,
  trackLinks: true,
  metadata: { orderId: '1234' },
  scheduledAt: '2026-07-01T09:00:00Z',  // ISO 8601 — schedule for later
});
```

### Send with a template

```ts
await client.emails.send({
  from: 'hello@yourdomain.com',
  to: 'user@example.com',
  subject: 'Reset your password',
  templateId: 'password-reset',          // template id or alias
  templateData: {
    firstName: 'Jane',
    resetUrl: 'https://yourapp.com/reset?token=abc',
    expiresInMinutes: 30,
  },
});
```

### Batch send

```ts
await client.emails.sendBatch({
  messages: [
    {
      from: 'newsletter@yourapp.com',
      to: 'alice@example.com',
      subject: 'June update',
      templateId: 'newsletter',
      templateData: { firstName: 'Alice' },
    },
    {
      from: 'newsletter@yourapp.com',
      to: 'bob@example.com',
      subject: 'June update',
      templateId: 'newsletter',
      templateData: { firstName: 'Bob' },
    },
  ],
});
```

### List & retrieve emails

```ts
// Paginated list — optional filters: status, tag
const emails = await client.emails.list({ page: 1, perPage: 50, status: 'BOUNCED' });

// Single email
const email = await client.emails.get('email-id');

// Delivery stats
const stats = await client.emails.stats({ from: '2026-01-01', to: '2026-06-30', tag: 'transactional' });

// Daily volume chart data
const chart = await client.emails.chart({ from: '2026-06-01', to: '2026-06-30' });
```

### Suppressions

```ts
// List suppressed addresses
const list = await client.emails.listSuppressions({ page: 1, perPage: 100 });

// Suppress an address manually
await client.emails.addSuppression({ email: 'bounced@example.com', reason: 'hard_bounce' });

// Remove from suppression list
await client.emails.removeSuppression('bounced@example.com');
```

## Templates

```ts
// Create
const template = await client.templates.create({
  name: 'Password Reset',
  alias: 'password-reset',
  subject: 'Reset your {{appName}} password',
  htmlBody: '<p>Hi {{firstName}}, <a href="{{resetUrl}}">click here</a> to reset.</p>',
  textBody: 'Hi {{firstName}}, visit {{resetUrl}} to reset your password.',
  previewText: 'Reset your password — link expires in 30 minutes',
  variables: { appName: 'MyApp', expiresInMinutes: 30 },
  isActive: true,
});

// Retrieve by id or alias
const t = await client.templates.get('password-reset');

// List
const templates = await client.templates.list({ page: 1, perPage: 20 });

// Update (partial)
await client.templates.update('password-reset', { subject: 'Reset your password' });

// Delete
await client.templates.delete('password-reset');
```

## Domains

Custom sending domains must be added and DNS-verified before use.

```ts
// Add a domain — returns DNS records to configure
const domain = await client.domains.add('mail.yourapp.com');
// → { id, domain, dnsRecords: [...], status: 'PENDING' }

// After DNS is configured, trigger verification
await client.domains.verify(domain.id);

// List and retrieve
const domains = await client.domains.list();
const d = await client.domains.get(domain.id);

// Delete
await client.domains.delete(domain.id);
```

## Senders

Verified sender addresses within your domains.

```ts
// Create
await client.senders.create({
  email: 'hello@mail.yourapp.com',
  name: 'Your App',
  isDefault: true,
});

// List, retrieve, delete
const senders = await client.senders.list();
const sender = await client.senders.get('sender-id');
await client.senders.delete('sender-id');
```

## Webhooks

```ts
// Register a webhook endpoint
const webhook = await client.webhooks.create({
  url: 'https://yourapp.com/webhooks/postasend',
  description: 'Production handler',
  events: ['DELIVERY', 'BOUNCE', 'OPEN', 'CLICK', 'SPAM_COMPLAINT', 'UNSUBSCRIBE'],
  active: true,
});

// Update (partial)
await client.webhooks.update(webhook.id, { active: false });

// List delivery attempts for a webhook
const deliveries = await client.webhooks.listDeliveries(webhook.id, { page: 1, perPage: 50 });

// List, retrieve, delete
const webhooks = await client.webhooks.list();
await client.webhooks.delete(webhook.id);
```

### Webhook event types

| Event | When it fires |
|-------|--------------|
| `DELIVERY` | Email successfully delivered |
| `BOUNCE` | Hard or soft bounce |
| `OPEN` | Recipient opened the email |
| `CLICK` | Recipient clicked a tracked link |
| `SPAM_COMPLAINT` | Email reported as spam |
| `UNSUBSCRIBE` | Recipient unsubscribed |
| `*` | Subscribe to all events |

## Error handling

All SDK methods throw typed errors on failure. Import error classes from the package root:

```ts
import {
  PostaSend,
  PostaSendError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
} from 'postasend';

try {
  await client.emails.send({ ... });
} catch (err) {
  if (err instanceof RateLimitError) {
    // err.retryAfter — seconds to wait before retrying
    await sleep(err.retryAfter ?? 60);
  } else if (err instanceof ValidationError) {
    // err.details — field-level validation errors from the API
    console.error(err.details);
  } else if (err instanceof AuthenticationError) {
    console.error('Check your API key');
  } else if (err instanceof PostaSendError) {
    // err.statusCode — HTTP status
    // err.code       — machine-readable error code
    console.error(err.statusCode, err.code, err.message);
  } else {
    throw err;
  }
}
```

| Error class | HTTP status | When |
|-------------|-------------|------|
| `AuthenticationError` | 401 | Invalid or missing API key |
| `PermissionError` | 403 | Key lacks required permissions |
| `NotFoundError` | 404 | Resource not found |
| `ValidationError` | 422 | Request body failed validation |
| `RateLimitError` | 429 | Rate limit exceeded (`retryAfter` in seconds) |
| `PostaSendError` | any | Base class for all SDK errors |

## TypeScript

All types are exported from the package root:

```ts
import type {
  SendEmailOptions,
  BatchSendOptions,
  EmailAddress,
  Attachment,
  EmailStatus,
  WebhookEventType,
  CreateTemplateOptions,
  UpdateTemplateOptions,
  CreateWebhookOptions,
  UpdateWebhookOptions,
  CreateSenderOptions,
  PostaSendOptions,
} from 'postasend';
```

## CommonJS

The SDK ships dual ESM/CJS builds — `require` works without any configuration:

```js
const { PostaSend } = require('postasend');
```

## Building the SDK locally

```bash
cd packages/sdk
npm install
npm run build      # outputs to dist/
npm run dev        # watch mode
npm run typecheck
```
