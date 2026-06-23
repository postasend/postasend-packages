import { PostaSend } from 'postasend';

const client = new PostaSend({ apiKey: process.env.POSTASEND_API_KEY! });

interface NewsletterSubscriber {
  email: string;
  name: string;
  unsubscribeToken: string;
}

async function sendNewsletter(subscribers: NewsletterSubscriber[], issueTitle: string) {
  const messages = subscribers.map((sub) => ({
    from: { email: 'newsletter@yourapp.com', name: 'YourApp Newsletter' },
    to: { email: sub.email, name: sub.name },
    subject: issueTitle,
    templateId: 'newsletter',
    templateData: {
      firstName: sub.name,
      unsubscribeUrl: `https://yourapp.com/unsubscribe?token=${sub.unsubscribeToken}`,
    },
    tag: 'newsletter',
    trackOpens: true,
    trackLinks: true,
  }));

  const result = await client.emails.sendBatch({ messages });
  console.log('Batch sent:', result);
}

sendNewsletter(
  [
    { email: 'alice@example.com', name: 'Alice', unsubscribeToken: 'tok_alice' },
    { email: 'bob@example.com', name: 'Bob', unsubscribeToken: 'tok_bob' },
  ],
  'June 2026 — What\'s new in YourApp',
);
