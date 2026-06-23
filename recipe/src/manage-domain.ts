import { PostaSend } from 'postasend';

const client = new PostaSend({ apiKey: process.env.POSTASEND_API_KEY! });

async function setupDomain() {
  // 1. Add a domain
  const domain = await client.domains.add('mail.yourapp.com') as { id: string; dnsRecords?: unknown[] };
  console.log('Domain added:', domain);
  console.log('Add the following DNS records, then call verify:', domain.dnsRecords);

  // 2. After DNS is configured, verify the domain
  const verified = await client.domains.verify(domain.id);
  console.log('Verification result:', verified);
}

setupDomain();
