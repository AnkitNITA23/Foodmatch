import { Resend } from 'resend';

// Safeguard initialization: don't crash if key is missing
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// Shared branded HTML wrapper
function htmlWrap(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#ff6b6b,#ff8e53);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:white;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Food<span style="opacity:0.85;">Match</span></h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Real-Time Food Rescue Platform</p>
          </td>
        </tr>
        <tr><td style="padding:40px;">${content}</td></tr>
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #eef2f7;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated message from the FoodMatch platform.</p>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Made with ❤️ by Ankit</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendClaimEmail(
  donorEmail: string,
  donorName: string,
  receiverName: string,
  foodTitle: string
) {
  if (!resend) {
    console.warn('⚠️ sendClaimEmail skipped: RESEND_API_KEY not configured.');
    return false;
  }
  
  try {
    const { error } = await resend.emails.send({
      from: 'FoodMatch <onboarding@resend.dev>',
      to: donorEmail,
      subject: `🎉 Your donation "${foodTitle}" has been claimed!`,
      html: htmlWrap(`
        <h2 style="margin:0 0 16px;color:#1e293b;font-size:22px;">Great news, ${donorName || 'there'}! 🎉</h2>
        <p style="margin:0 0 20px;color:#475569;font-size:16px;line-height:1.6;">
          Your surplus food listing <strong style="color:#ff6b6b;">"${foodTitle}"</strong> has just been claimed by <strong>${receiverName}</strong>.
        </p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #40c057;border-radius:10px;padding:20px;margin:0 0 24px;">
          <p style="margin:0;color:#166534;font-size:15px;font-weight:600;">⏰ What to do next</p>
          <p style="margin:8px 0 0;color:#166534;font-size:14px;">The receiver will arrive shortly. Have the food ready and packaged.</p>
          <p style="margin:8px 0 0;color:#166534;font-size:14px;">They will show you a <strong>4-digit PIN</strong> — enter it in your Dashboard to confirm the handover.</p>
        </div>
        <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">Thank you for reducing food waste and making a real difference. 🌍</p>
      `),
    });

    if (error) {
      console.error('❌ Resend claim email error:', error);
      return false;
    }

    console.log(`✅ Claim email sent to: ${donorEmail}`);
    return true;
  } catch (err) {
    console.error('❌ Unexpected claim email error:', err);
    return false;
  }
}

export async function sendMatchEmail(
  receiverEmail: string,
  receiverName: string,
  donorName: string,
  foodTitle: string
) {
  if (!resend) {
    console.warn('⚠️ sendMatchEmail skipped: RESEND_API_KEY not configured.');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: 'FoodMatch Radar <onboarding@resend.dev>',
      to: receiverEmail,
      subject: `🚨 New Food Nearby: "${foodTitle}" — Claim It Now!`,
      html: htmlWrap(`
        <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">Food Detected Nearby! 🍽️</h2>
        <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6;">
          Hey <strong>${receiverName || 'there'}</strong>, a new donation was just posted <strong>within 5km of your location</strong>. Claim it fast before someone else does!
        </p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin:0 0 28px;">
          <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#166534;">🍱 ${foodTitle}</p>
          <p style="margin:0;font-size:14px;color:#166534;">Posted by <strong>${donorName || 'a local donor'}</strong></p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://foodmatch-six.vercel.app'}/dashboard"
           style="display:inline-block;background:linear-gradient(135deg,#40c057,#2f9e44);color:white;text-decoration:none;padding:14px 28px;border-radius:99px;font-weight:700;font-size:15px;">
          👉 Claim This Donation
        </a>
        <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;">You received this because you are within the 5km matching radius.</p>
      `),
    });

    if (error) {
      console.error('❌ Resend match email error:', error);
      return false;
    }

    console.log(`✅ Match email sent to: ${receiverEmail}`);
    return true;
  } catch (err) {
    console.error('❌ Unexpected match email error:', err);
    return false;
  }
}
