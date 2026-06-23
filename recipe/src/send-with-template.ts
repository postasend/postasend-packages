import { PostaSend } from 'postasend';

const client = new PostaSend({ apiKey: process.env.POSTASEND_API_KEY! });

async function sendPasswordReset(user: { email: string; name: string; resetUrl: string }) {
  const result = await client.emails.send({
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

  console.log('Sent:', result);
}

sendPasswordReset({
  email: 'jane@example.com',
  name: 'Jane',
  resetUrl: 'https://yourapp.com/reset?token=abc123',
});
