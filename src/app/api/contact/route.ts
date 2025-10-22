import { Resend } from 'resend';
import { VercelInviteUserEmail } from '@/components/email-template';

const resend = new Resend(
  process.env.NEXT_PUBLIC_RESEND_API_KEY ||
    're_XicT7FtX_9utgfRBYtvZVAY8NBzqu9Tbw',
);

// resend.domains.get('3fc93a2e-1f60-4292-a2e2-d03758a045e6');
export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'test@nhatcapdang.com',
      to: ['vankiet.kn78@gmail.com'],
      subject: 'Hello world',
      react: VercelInviteUserEmail({
        username: 'John',
        userImage: 'https://resend.com/image.png',
        invitedByUsername: 'Jane',
        invitedByEmail: 'jane@example.com',
        teamName: 'Acme',
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
