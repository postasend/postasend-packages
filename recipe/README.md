# @postasend/recipes

Ready-to-run integration examples for the PostaSend Node.js SDK. Copy any recipe into your project as a starting point.

## Setup

These examples use the `postasend` SDK from the monorepo workspace. To run them:

```bash
cd packages/recipe
npm install

# Set your API key
export POSTASEND_API_KEY=ps_live_...

# Run a recipe
npx tsx src/send-transactional.ts
```

## Recipes

### `send-transactional.ts` — Welcome / onboarding email

Sends a plain HTML email with inline content. Good starting point for any triggered transactional send (welcome, confirmation, notification).

```ts
import { PostaSend } from 'postasend';

const client = new PostaSend({ apiKey: process.env.POSTASEND_API_KEY! });

await client.emails.send({
  from: { email: 'noreply@yourapp.com', name: 'Your App' },
  to: { email: user.email, name: user.name },
  subject: `Welcome to YourApp, ${user.name}!`,
  html: `<h1>Welcome!</h1><p>Verify: <a href="...">click here</a></p>`,
  tag: 'onboarding',
  trackOpens: true,
});
```

---

### `send-with-template.ts` — Template-based send

Sends an email using a saved PostaSend template, passing dynamic variables via `templateData`. Keeps content managed in the dashboard rather than in code.

```ts
await client.emails.send({
  from: 'noreply@yourapp.com',
  to: user.email,
  subject: 'Reset your password',
  templateId: 'password-reset',
  templateData: {
    firstName: user.name,
    resetUrl: user.resetUrl,
    expiresInMinutes: 30,
  },
  tag: 'auth',
});
```

---

### `batch-send.ts` — Newsletter / bulk send

Sends one email per subscriber in a single batch request. Each message can have different `templateData`, subject, and recipient — useful for newsletters, digest emails, or personalised campaigns.

```ts
const messages = subscribers.map((sub) => ({
  from: { email: 'newsletter@yourapp.com', name: 'YourApp Newsletter' },
  to: { email: sub.email, name: sub.name },
  subject: issueTitle,
  templateId: 'newsletter',
  templateData: {
    firstName: sub.name,
    unsubscribeUrl: `https://yourapp.com/unsubscribe?token=${sub.token}`,
  },
  tag: 'newsletter',
  trackOpens: true,
  trackLinks: true,
}));

await client.emails.sendBatch({ messages });
```

---

### `manage-domain.ts` — Domain setup

Adds a custom sending domain and triggers DNS verification. Run this once when onboarding a new domain; re-run the verify step after DNS propagates.

```ts
// Step 1 — add the domain, get DNS records to configure
const domain = await client.domains.add('mail.yourapp.com');
console.log('DNS records to add:', domain.dnsRecords);

// Step 2 — after DNS is set, verify
await client.domains.verify(domain.id);
```

---

### `webhook-handler.ts` — Webhook listener

A minimal Node.js HTTP server that receives PostaSend webhook events. Handles all event types (`DELIVERY`, `BOUNCE`, `OPEN`, `CLICK`, `SPAM_COMPLAINT`, `UNSUBSCRIBE`) with a typed switch. Adapt the handlers to update your database, trigger re-sends, or feed analytics.

```ts
// Register the webhook first
await client.webhooks.create({
  url: 'https://yourapp.com/webhooks/postasend',
  events: ['DELIVERY', 'BOUNCE', 'OPEN', 'CLICK', 'SPAM_COMPLAINT', 'UNSUBSCRIBE'],
});

// Then run the listener
npx tsx src/webhook-handler.ts
// → Webhook listener running on http://localhost:3001/webhooks/postasend
```

## Using these recipes in your project

Each file is self-contained — copy it directly and adapt:

1. Replace the `from` address with a verified sender from your account.
2. Replace `templateId` values with your actual template ids or aliases.
3. Wire in your own database/user objects in place of the inline stubs.
4. Remove or replace the `console.log` calls with your logging library.

## TypeScript

All recipes are written in TypeScript. Run type checking across the package:

```bash
npm run typecheck
```
