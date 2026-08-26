# Contact enquiry deployment

The website sends the contact form to a Supabase Edge Function. The function stores each enquiry in Supabase and then emails the notification through SMTP. SMTP credentials remain only in Supabase secrets.

1. Install and sign in to the Supabase CLI, then link this folder to your project:

   ```powershell
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

2. Apply the database migration and deploy the function:

   ```powershell
   supabase db push
   supabase functions deploy contact-enquiry
   supabase functions deploy certificate-verify
   ```

3. Set the production secrets. `ALLOWED_ORIGINS` is a comma-separated exact list of website origins, for example `https://brundasacademy.com,https://www.brundasacademy.com`.

   ```powershell
   supabase secrets set ALLOWED_ORIGINS="https://YOUR_DOMAIN" SMTP_HOST="smtp.your-provider.com" SMTP_PORT="587" SMTP_USER="YOUR_SMTP_USERNAME" SMTP_PASS="YOUR_SMTP_PASSWORD" SMTP_FROM="Brunda's Academy <noreply@YOUR_DOMAIN>" ENQUIRY_TO_EMAIL="admissions@YOUR_DOMAIN"
   ```

   Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to hosted Edge Functions. Do not put the service-role key, SMTP password, or any other secret in website files.

4. Copy `contact-config.example.js` to `contact-config.js`, replace `YOUR_PROJECT_REF`, and publish it with the site. This file is ignored by Git so each environment can point to its own Supabase project.

5. Submit a real test enquiry. Confirm a row appears in `contact_enquiries` and the notification arrives. Failed SMTP deliveries are retained in the table with `email_error` set.

The Edge Function only accepts requests from `ALLOWED_ORIGINS` and includes a honeypot field to reduce automated form submissions. For higher-volume public sites, also add a CAPTCHA or edge rate-limiting service.

## Certificate verification

Certificate records are managed in the `certificates` table. Add a record from the Supabase Table Editor, or run SQL such as:

```sql
insert into public.certificates (certificate_id, learner_name, course_name, issued_at)
values ('BRU-2026-48291', 'Learner Name', 'Full Stack Development', '2026-08-26');
```

The public `certificate-verify` function only returns credentials with a `valid` status and a non-expired date.
