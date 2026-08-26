create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_id text not null unique check (certificate_id = upper(certificate_id)),
  learner_name text not null,
  course_name text not null,
  issued_at date not null,
  expires_at date,
  status text not null default 'valid' check (status in ('valid', 'revoked', 'expired')),
  created_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

-- Add certificates from the Supabase Table Editor or by SQL, for example:
-- insert into public.certificates (certificate_id, learner_name, course_name, issued_at)
-- values ('BRU-2026-48291', 'Learner Name', 'Full Stack Development', '2026-08-26');
