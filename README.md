# Hypo

**Test the hype. Keep what works.**

Hypo is a personal experiment tracker for testing behavioral and lifestyle hypotheses. Define an experiment, log daily check-ins, and see the data on whether what you're doing is actually working.

## What it does

- **Create experiments** — give each one a hypothesis, an action you'll take, and a metric you'll track
- **Daily check-ins** — log whether you adhered to the action and record your metric value for the day
- **Analytics** — see your adherence rate and compare your average metric value on days you adhered vs. days you didn't
- **Experiment lifecycle** — pause, resume, or mark experiments complete

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | Auth.js (Next-Auth v5) + Google OAuth |

## Running locally

**Prerequisites:** Node.js 18+, a PostgreSQL database (e.g. [Neon](https://neon.tech)), and a Google OAuth app.

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd hypo
   npm install
   ```

2. **Set up environment variables**

   Create `.env.local`:

   ```env
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="your-secret-here"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   AUTH_TRUST_HOST="true"
   ```

3. **Push the database schema**

   ```bash
   npx prisma db push
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                        # Landing / login page
  dashboard/page.tsx              # Experiment dashboard
  experiments/
    new/page.tsx                  # Create experiment
    [id]/page.tsx                 # Experiment detail + check-ins
  api/
    experiments/route.ts          # GET list, POST create
    experiments/[id]/route.ts     # GET, PATCH, DELETE single experiment
    experiments/[id]/checkins/    # POST check-in
    experiments/[id]/summary/     # GET analytics summary
src/
  auth.ts                         # Auth.js config
  lib/prisma.ts                   # Prisma client singleton
  components/
    NewExperimentForm.tsx
    CheckInForm.tsx
    StatusButton.tsx
prisma/
  schema.prisma                   # User, Experiment, CheckIn models
```

## Database schema

```
User → Experiment (1:many)
Experiment → CheckIn (1:many, one per day enforced by DB constraint)

Experiment: title, hypothesis, action, metricName, startDate, endDate?, status (ACTIVE | PAUSED | COMPLETED)
CheckIn: date, adhered (bool), metricValue (float), note?
```

## Deploying

The easiest path is [Vercel](https://vercel.com) + [Neon](https://neon.tech):

1. Push to GitHub
2. Import the repo on Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy

---

*Built to learn full-stack development with Next.js, Prisma, and Auth.js.*
