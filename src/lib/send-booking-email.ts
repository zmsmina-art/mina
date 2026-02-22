import { getGmailClient } from './google-calendar';

interface BookingDetails {
  name: string;
  email: string;
  company?: string;
  companyStage?: string;
  context?: string;
  date: string;       // YYYY-MM-DD
  time: string;       // e.g. "2:00 PM"
  meetLink: string | null;
}

/** Format YYYY-MM-DD into a readable date like "Monday, March 17, 2025" */
function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Build a base64url-encoded RFC 2822 MIME message */
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

function bookerEmailHtml(details: BookingDetails): string {
  const formattedDate = formatDate(details.date);
  const meetSection = details.meetLink
    ? `<tr>
        <td style="padding:12px 24px;">
          <a href="${details.meetLink}" style="display:inline-block;padding:12px 28px;background:#6d28d9;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">Join Google Meet</a>
        </td>
      </tr>`
    : '';

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
              <h1 style="margin:0;font-size:22px;color:#f5f5f5;font-weight:600;">Your call is confirmed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #262626;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px;color:#a3a3a3;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Date</p>
                    <p style="margin:0 0 20px;color:#f5f5f5;font-size:16px;font-weight:500;">${formattedDate}</p>
                    <p style="margin:0 0 12px;color:#a3a3a3;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Time</p>
                    <p style="margin:0 0 20px;color:#f5f5f5;font-size:16px;font-weight:500;">${details.time} ET (30 min)</p>
                    <p style="margin:0 0 12px;color:#a3a3a3;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">With</p>
                    <p style="margin:0;color:#f5f5f5;font-size:16px;font-weight:500;">Mina Mankarious</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${meetSection}
          <tr>
            <td style="padding:16px 24px 32px;">
              <p style="margin:0;color:#737373;font-size:13px;line-height:1.5;">A calendar invite has also been sent to your email. If you need to reschedule, reply to this email or reach out at <a href="mailto:mina@olunix.com" style="color:#8b5cf6;text-decoration:none;">mina@olunix.com</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function minaEmailHtml(details: BookingDetails): string {
  const formattedDate = formatDate(details.date);

  const detailRows = [
    { label: 'Name', value: details.name },
    { label: 'Email', value: `<a href="mailto:${details.email}" style="color:#8b5cf6;text-decoration:none;">${details.email}</a>` },
    details.company ? { label: 'Company', value: details.company } : null,
    details.companyStage ? { label: 'Stage', value: details.companyStage } : null,
    { label: 'Date', value: formattedDate },
    { label: 'Time', value: `${details.time} ET` },
  ].filter(Boolean) as { label: string; value: string }[];

  const detailRowsHtml = detailRows
    .map(
      (r) => `<tr>
        <td style="padding:8px 0;color:#a3a3a3;font-size:14px;vertical-align:top;width:100px;">${r.label}</td>
        <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${r.value}</td>
      </tr>`,
    )
    .join('');

  const contextSection = details.context
    ? `<tr>
        <td style="padding:16px 24px 24px;" colspan="2">
          <p style="margin:0 0 8px;color:#a3a3a3;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Context</p>
          <div style="background:#1a1a1a;border-radius:8px;border:1px solid #262626;padding:16px;">
            <p style="margin:0;color:#d4d4d4;font-size:14px;line-height:1.6;white-space:pre-wrap;">${details.context}</p>
          </div>
        </td>
      </tr>`
    : '';

  const meetSection = details.meetLink
    ? `<tr>
        <td style="padding:8px 24px 24px;" colspan="2">
          <a href="${details.meetLink}" style="display:inline-block;padding:10px 24px;background:#6d28d9;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Join Google Meet</a>
        </td>
      </tr>`
    : '';

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
              <h1 style="margin:0;font-size:22px;color:#f5f5f5;font-weight:600;">New booking from ${details.name}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${detailRowsHtml}
              </table>
            </td>
          </tr>
          ${contextSection}
          ${meetSection}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends booking confirmation emails to both the booker and Mina.
 * Errors are logged but never thrown — email failure should not block booking.
 */
export async function sendBookingEmails(details: BookingDetails): Promise<void> {
  const client = getGmailClient();
  if (!client) {
    console.warn('Gmail client not configured — skipping booking emails');
    return;
  }

  const { gmail, senderEmail } = client;

  // Send to booker
  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: buildMimeMessage(
          details.email,
          senderEmail,
          `Your call with Mina is confirmed — ${formatDate(details.date)} at ${details.time} ET`,
          bookerEmailHtml(details),
        ),
      },
    });
  } catch (err) {
    console.error('Failed to send booker confirmation email:', err instanceof Error ? err.message : err);
  }

  // Send to Mina
  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: buildMimeMessage(
          senderEmail,
          senderEmail,
          `New booking: ${details.name}${details.company ? ` (${details.company})` : ''} — ${formatDate(details.date)} at ${details.time} ET`,
          minaEmailHtml(details),
        ),
      },
    });
  } catch (err) {
    console.error('Failed to send Mina notification email:', err instanceof Error ? err.message : err);
  }
}
