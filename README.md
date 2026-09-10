# Prepvia Authentication Starter

Vite + Supabase authentication system for Vercel/GitHub.

Includes email/password, Google OAuth, email verification, password reset, student metadata, protected dashboard, logout, profile SQL and RLS.

1. Create `.env` from `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
2. Run `supabase-schema.sql` in Supabase SQL Editor.
3. Enable Email and Google providers in Supabase Authentication.
4. Configure Supabase Site URL and redirect URLs for your Vercel domain, `/dashboard.html`, and `/reset.html`.
5. Add the environment variables in Vercel Project Settings.
6. Run `npm install` then `npm run dev` locally, or deploy through GitHub/Vercel.

Never put a Supabase service-role/secret key in frontend code or GitHub.
