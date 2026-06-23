import { PostaSend } from 'postasend';

const client = new PostaSend({ apiKey: process.env.POSTASEND_API_KEY! });

async function sendWelcomeEmail(user: { email: string; name: string }) {
  const result = await client.emails.send({
    from: { email: 'noreply@yourapp.com', name: 'Your App' },
    to: { email: user.email, name: user.name },
    subject: `Welcome to YourApp, ${user.name}!`,
    html: `
      <h1>Welcome, ${user.name}!</h1>
      <p>Thanks for signing up. Get started by verifying your email.</p>
      <a href="https://yourapp.com/verify">Verify my email</a>
    `,
    text: `Welcome, ${user.name}! Visit https://yourapp.com/verify to get started.`,
    tag: 'onboarding',
    trackOpens: true,
  });

  console.log('Sent:', result);
}

sendWelcomeEmail({ email: 'jane@example.com', name: 'Jane' });
