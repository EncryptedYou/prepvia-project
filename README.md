# Prepvia Authentication Starter

This is a Vite + Supabase authentication system designed for Vercel/GitHub.

## Included

- Responsive sign in / sign up UI
- Email + password authentication
- Google OAuth button
- Email verification support
- Forgot password + reset password
- Password strength indicator
- Student name + JEE/NEET/Both metadata
- Protected dashboard
- Logout
- Supabase profile table + RLS SQL
- Vercel-ready Vite project

## 1. Create Supabase project

Create a Supabase project and copy:
- Project URL
- Publishable key

Create `.env` from `.env.example`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_SITE_URL=https://YOUR-DOMAIN.vercel.app
```

Never put a Supabase service-role/secret key in frontend code.

## 2. Create profile table

Open Supabase SQL Editor and run `supabase-schema.sql`.

## 3. Email authentication

Supabase Auth supports email/password authentication. For production, keep email confirmation enabled and configure a real SMTP provider when you are ready to scale email sending.

Set the allowed Site URL and Redirect URLs in Supabase Auth settings:
- `http://localhost:5173`
- `http://localhost:5173/dashboard.html`
- `http://localhost:5173/reset.html`
- your production Vercel URL and the corresponding dashboard/reset paths

## 4. Google login

In Supabase:
Authentication -> Providers -> Google -> enable it.

Create a Google OAuth Web Client in Google Cloud and add:
- Your production site as an authorized JavaScript origin.
- Your Supabase Auth callback URL as an authorized redirect URI.

Copy the Google Client ID and Client Secret into the Supabase Google provider configuration.

The app uses `signInWithOAuth({ provider: "google" })`.

## 5. Run locally

```bash
npm install
npm run dev
```

Open:
`http://localhost:5173/auth.html`

## 6. Deploy to Vercel

Push this folder to GitHub, import the repository into Vercel, and add the same environment variables in Vercel Project Settings -> Environment Variables.

Then redeploy.

## Important

The Google button cannot actually authenticate until the Google provider is enabled in Supabase and Google OAuth is configured. The email/password flow works after the Supabase environment variables and database setup are completed.
