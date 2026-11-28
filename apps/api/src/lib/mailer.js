import { env } from '../config/env.js';

// Every message sent while the server runs. Tests read it to find the link in an e-mail.
export const sentEmails = [];

// Real e-mail sending is not built yet (slice S2). The message is printed to the server console
// instead, so in development you copy the reset link from there.
export async function sendEmail({ to, subject, text }) {
  sentEmails.push({ to, subject, text });
  if (env.nodeEnv !== 'test') {
    console.log(`\n[e-mail] To: ${to}\nSubject: ${subject}\n${text}\n`);
  }
}
