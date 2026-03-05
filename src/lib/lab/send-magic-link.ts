/* ------------------------------------------------------------------ */
/*  Positioning Lab — Magic link email sender (uses existing Gmail)   */
/* ------------------------------------------------------------------ */

import { getGmailClient } from '@/lib/google-calendar';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://minamankarious.com';

function buildMimeMessage(to: string, from: string, subject: string, html: string): string {
  const boundary = `boundary_${Date.now()}`;
  const lines = [
    `From: Mina Mankarious <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    html,
    ``,
    `--${boundary}--`,
  ];
  const raw = lines.join('\r\n');
  return Buffer.from(raw).toString('base64url');
}

function magicLinkHtml(link: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:16px;border:1px solid #262626;overflow:hidden;">
          <tr>
            <td style="padding:32px 24px 16px;border-bottom:1px solid #262626;">
              <h1 style="margin:0;font-size:22px;color:#f5f5f5;font-weight:600;">Your Positioning Lab link</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 20px;color:#d4d4d4;font-size:15px;line-height:1.6;">
                Click below to access your Positioning Lab workspace. This link is unique to you — bookmark it or keep this email to return anytime.
              </p>
              <a href="${link}" style="display:inline-block;padding:14px 32px;background:#7a40f2;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
                Open Positioning Lab
              </a>
              <p style="margin:20px 0 0;color:#737373;font-size:13px;line-height:1.5;">
                Or copy this link:<br/>
                <span style="color:#a3a3a3;word-break:break-all;">${link}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 32px;">
              <p style="margin:0;color:#525252;font-size:12px;line-height:1.5;">
                This link never expires. If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;color:#525252;font-size:12px;text-align:center;">
          Positioning Lab by <a href="https://minamankarious.com" style="color:#7a40f2;text-decoration:none;">Mina Mankarious</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendMagicLinkEmail(
  email: string,
  token: string,
  workspaceId: string
): Promise<boolean> {
  const link = `${BASE_URL}/lab/verify?token=${token}&workspace=${workspaceId}`;

  const client = getGmailClient();
  if (!client) {
    console.warn('Gmail client not configured — cannot send magic link');
    return false;
  }

  const { gmail, senderEmail } = client;

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: buildMimeMessage(
          email,
          senderEmail,
          'Your Positioning Lab workspace is ready',
          magicLinkHtml(link),
        ),
      },
    });
    return true;
  } catch (err) {
    console.error('Failed to send magic link email:', err instanceof Error ? err.message : err);
    return false;
  }
}
