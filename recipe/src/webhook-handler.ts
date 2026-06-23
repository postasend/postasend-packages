/**
 * Express/Node.js example for handling PostaSend webhook events.
 * Run: npm install express @types/express
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServer } from 'node:http';

type WebhookEvent = {
  type: string;
  timestamp: string;
  data: {
    emailId: string;
    recipient: string;
    [key: string]: unknown;
  };
};

function handleWebhook(event: WebhookEvent) {
  switch (event.type) {
    case 'DELIVERY':
      console.log(`Email ${event.data.emailId} delivered to ${event.data.recipient}`);
      break;
    case 'BOUNCE':
      console.log(`Bounce for ${event.data.recipient} — add to suppression list`);
      break;
    case 'OPEN':
      console.log(`Email ${event.data.emailId} opened by ${event.data.recipient}`);
      break;
    case 'CLICK':
      console.log(`Link clicked in ${event.data.emailId} by ${event.data.recipient}`);
      break;
    case 'SPAM_COMPLAINT':
      console.log(`Spam complaint from ${event.data.recipient}`);
      break;
    case 'UNSUBSCRIBE':
      console.log(`${event.data.recipient} unsubscribed`);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== 'POST' || req.url !== '/webhooks/postasend') {
    res.writeHead(404);
    res.end();
    return;
  }

  let body = '';
  req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const event = JSON.parse(body) as WebhookEvent;
      handleWebhook(event);
      res.writeHead(200);
      res.end('OK');
    } catch {
      res.writeHead(400);
      res.end('Invalid JSON');
    }
  });
});

server.listen(3001, () => {
  console.log('Webhook listener running on http://localhost:3001/webhooks/postasend');
});
