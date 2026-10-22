# CyberLab — Download Tracking & Security Awareness

A small Next.js project for a transparent, educational demo of HTTP access logging. It logs page views and download requests, then shows the latest events in a password-protected admin dashboard.

## Features
- Downloadable harmless text file (no executable payload)
- Access event logging: timestamp, server-visible IP, User-Agent, referrer, path
- Password-protected dashboard with an HttpOnly, SameSite=Strict signed session cookie
- Supabase Postgres persistence, suitable for Vercel serverless deployment

## 1. Requirements
- Node.js 20.9+ recommended
- A Supabase project
- A GitHub account and Vercel account for deployment

## 2. Set up the database
1. Create a project at https://supabase.com/.
2. Open **SQL Editor** in the Supabase dashboard.
3. Paste and run `supabase-schema.sql`.
4. In Project Settings > API (or Connect), copy the project URL and service-role key. The service-role key is secret and must remain server-side.

## 3. Configure environment variables
1. Copy `.env.example` to `.env.local`.
2. Fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Set `ADMIN_PASSWORD` to a unique password.
4. Set `SESSION_SECRET` to a random secret of at least 32 characters. For example, generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
5. Never commit `.env.local` or publish these secrets.

## 4. Run locally (Windows PowerShell)
```powershell
npm install
Copy-Item .env.example .env.local
# Edit .env.local with your actual values
npm run dev
```
Open http://localhost:3000. Click the download button, then visit http://localhost:3000/admin and enter the admin password.

If environment variables are missing or the database schema has not been applied, logging/download will return an error rather than silently pretending it succeeded.

## 5. Deploy to Vercel
1. Create a new GitHub repository and upload/push this project. Do not include `.env.local`.
2. In Vercel, choose **Add New > Project**, import that GitHub repository, and keep the detected Next.js settings.
3. In Project Settings > Environment Variables, add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `SESSION_SECRET` for Production (and Preview if you need it there).
4. Deploy. If you added environment variables after a deployment, redeploy so the new values apply.
5. Open the deployed URL, test a download, then visit `/admin`.

## Notes on data and privacy
- The site tells visitors that access metadata is recorded.
- IP addresses are personal data in many contexts. Use this only for an authorized class demonstration, limit who can access the dashboard, and delete logs when no longer needed.
- IP geolocation is not included. IP addresses can represent VPNs, proxies, mobile gateways, or shared networks and do not identify a person's exact location.
- User-Agent strings are self-reported by browsers and may be incomplete or spoofed.
- This project does not attempt to collect passwords, contacts, IMEI, precise location, camera data, or files from visitors.
- Page views are sent from the browser to `/api/track`; download events are recorded by the download endpoint. React development mode may re-run effects in some setups, so treat local event counts as demonstration data rather than audited analytics.
- Basic demo only: before a public or high-traffic deployment, add rate limiting, retention/deletion controls, and stronger admin account management.
