import { Resend } from 'resend';
import { EmailInterface } from '@gitroom/nestjs-libraries/emails/email.interface';

const resend = new Resend(process.env.RESEND_API_KEY || 're_132');

export class ResendProvider implements EmailInterface {
  name = 'resend';
  validateEnvKeys = ['RESEND_API_KEY'];
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    emailFromName: string,
    emailFromAddress: string,
    replyTo?: string
  ) {
    const text = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const sends = await resend.emails.send({
      from: `${emailFromName} <${emailFromAddress}>`,
      to,
      subject,
      html,
      text,
      ...(replyTo && { reply_to: replyTo }),
    });

    if (sends.error) {
      throw new Error(sends.error.message);
    }

    return sends;
  }
}
