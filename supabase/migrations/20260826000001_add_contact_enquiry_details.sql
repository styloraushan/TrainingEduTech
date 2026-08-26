alter table public.contact_enquiries
  add column if not exists phone text,
  add column if not exists message text;
