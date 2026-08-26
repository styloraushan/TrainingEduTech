import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer@6.9.16';

const allowedOrigins = () => (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((origin) => origin.trim()).filter(Boolean);
const json = (body: Record<string, unknown>, status = 200, origin = '') => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' } });
const clean = (value: unknown, limit: number) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));
const emailLayout = (title: string, content: string) => `<!doctype html><html><body style="margin:0;background:#f3f6f2;font-family:Arial,sans-serif;color:#17313a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden"><tr><td style="padding:28px 36px;background:#17313a;color:#ffffff"><div style="font-size:22px;font-weight:700">Brunda's Academy</div><div style="margin-top:5px;color:#c8e2b4;font-size:13px">Skills for today. Careers for tomorrow.</div></td></tr><tr><td style="padding:32px 36px"><h1 style="margin:0 0 16px;font-size:24px;color:#17313a">${title}</h1>${content}</td></tr><tr><td style="padding:20px 36px;background:#f3f6f2;color:#64757a;font-size:12px;line-height:18px">Brunda's Academy · We’ll be happy to help with your next step.</td></tr></table></td></tr></table></body></html>`;

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') || '';
  const originAllowed = allowedOrigins().includes(origin);
  if (request.method === 'OPTIONS') return originAllowed ? json({ ok: true }, 200, origin) : json({ error: 'Origin not allowed.' }, 403);
  if (request.method !== 'POST' || !originAllowed) return json({ error: 'Not allowed.' }, 403);
  try {
    const payload = await request.json();
    const name = clean(payload.name, 120), email = clean(payload.email, 320).toLowerCase(), phone = clean(payload.phone, 40), message = clean(payload.message, 2000), interest = clean(payload.interest, 120);
    if (clean(payload.website, 200)) return json({ ok: true }, 200, origin);
    if (name.length < 2 || !isEmail(email)) return json({ error: 'Please enter a valid name and email address.' }, 400, origin);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: enquiry, error: insertError } = await supabase.from('contact_enquiries').insert({ name, email, phone: phone || null, message: message || null, interest: interest || null }).select('id, created_at').single();
    if (insertError) throw insertError;
    try {
      const smtpPort = Number(Deno.env.get('SMTP_PORT') || '587');
      const transporter = nodemailer.createTransport({ host: Deno.env.get('SMTP_HOST'), port: smtpPort, secure: smtpPort === 465, auth: { user: Deno.env.get('SMTP_USER'), pass: Deno.env.get('SMTP_PASS') } });
      const from = Deno.env.get('SMTP_FROM');
      const enquiryTo = Deno.env.get('ENQUIRY_TO_EMAIL');
      const safeName = escapeHtml(name), safeEmail = escapeHtml(email), safePhone = escapeHtml(phone || 'Not specified'), safeInterest = escapeHtml(interest || 'Not specified'), safeMessage = escapeHtml(message || 'Not specified');
      await transporter.sendMail({
        from,
        to: enquiryTo,
        replyTo: email,
        subject: `New website enquiry from ${name}`,
        text: `New website enquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not specified'}\nInterest: ${interest || 'Not specified'}\nMessage: ${message || 'Not specified'}\nReceived: ${enquiry.created_at}`,
        html: emailLayout('New website enquiry', `<p style="margin:0 0 24px;line-height:24px">A new enquiry has been received. Reply directly to this email to contact <strong>${safeName}</strong>.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px"><tr><td style="padding:10px 0;border-top:1px solid #dce5df;color:#64757a;width:120px">Name</td><td style="padding:10px 0;border-top:1px solid #dce5df;font-weight:600">${safeName}</td></tr><tr><td style="padding:10px 0;border-top:1px solid #dce5df;color:#64757a">Email</td><td style="padding:10px 0;border-top:1px solid #dce5df"><a href="mailto:${safeEmail}" style="color:#2c6d49">${safeEmail}</a></td></tr><tr><td style="padding:10px 0;border-top:1px solid #dce5df;color:#64757a">Phone</td><td style="padding:10px 0;border-top:1px solid #dce5df">${safePhone}</td></tr><tr><td style="padding:10px 0;border-top:1px solid #dce5df;color:#64757a">Interest</td><td style="padding:10px 0;border-top:1px solid #dce5df">${safeInterest}</td></tr><tr><td style="padding:10px 0;border-top:1px solid #dce5df;color:#64757a;vertical-align:top">Message</td><td style="padding:10px 0;border-top:1px solid #dce5df;white-space:pre-wrap">${safeMessage}</td></tr></table>`)
      });
      await transporter.sendMail({
        from,
        to: email,
        replyTo: enquiryTo,
        subject: `We received your enquiry | Brunda's Academy`,
        text: `Hi ${name},\n\nThank you for contacting Brunda's Academy. We have received your enquiry and an advisor will get back to you within one business day.\n\nYour interest: ${interest || 'Not specified'}\n\nBrunda's Academy`,
        html: emailLayout(`Thanks, ${safeName}!`, `<p style="margin:0 0 16px;line-height:24px">Thank you for contacting Brunda's Academy. We’ve received your enquiry and an advisor will get back to you within one business day.</p><div style="padding:16px 18px;background:#f3f6f2;border-radius:10px"><div style="font-size:12px;color:#64757a;margin-bottom:5px">YOUR INTEREST</div><div style="font-weight:600">${safeInterest}</div></div><p style="margin:24px 0 0;line-height:24px">If you have anything else to add, simply reply to this email.</p>`)
      });
      await supabase.from('contact_enquiries').update({ email_sent_at: new Date().toISOString() }).eq('id', enquiry.id);
    } catch (mailError) {
      console.error('SMTP delivery failed', mailError);
      await supabase.from('contact_enquiries').update({ email_error: 'SMTP delivery failed' }).eq('id', enquiry.id);
      return json({ error: 'Your enquiry was saved, but the email notification could not be sent. Please try again shortly.' }, 502, origin);
    }
    return json({ ok: true }, 200, origin);
  } catch (error) {
    console.error('Contact enquiry failed', error);
    return json({ error: 'We could not send your enquiry. Please try again.' }, 500, origin);
  }
});
