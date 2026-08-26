import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedOrigins = () => (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((origin) => origin.trim()).filter(Boolean);
const json = (body: Record<string, unknown>, status = 200, origin = '') => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  },
});

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') || '';
  const originAllowed = allowedOrigins().includes(origin);
  if (request.method === 'OPTIONS') return originAllowed ? json({ ok: true }, 200, origin) : json({ error: 'Origin not allowed.' }, 403);
  if (request.method !== 'POST' || !originAllowed) return json({ error: 'Not allowed.' }, 403);

  try {
    const payload = await request.json();
    const certificateId = typeof payload.certificate_id === 'string' ? payload.certificate_id.trim().toUpperCase().slice(0, 80) : '';
    if (!/^[A-Z0-9][A-Z0-9-]{2,79}$/.test(certificateId)) return json({ error: 'Enter a valid certificate ID.' }, 400, origin);

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select('certificate_id, learner_name, course_name, issued_at, expires_at, status')
      .eq('certificate_id', certificateId)
      .maybeSingle();
    if (error) throw error;
    if (!certificate || certificate.status !== 'valid' || (certificate.expires_at && certificate.expires_at < new Date().toISOString().slice(0, 10))) {
      return json({ error: 'We could not verify this certificate ID.' }, 404, origin);
    }
    return json({ ok: true, certificate }, 200, origin);
  } catch (error) {
    console.error('Certificate verification failed', error);
    return json({ error: 'We could not verify this certificate right now. Please try again.' }, 500, origin);
  }
});
