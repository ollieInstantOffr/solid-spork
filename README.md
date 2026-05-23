# Luna — Cycle Tracker

A full-stack menstrual cycle tracking PWA with a "for men" partner view.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: Custom components + Radix UI primitives + Tailwind CSS
- **Database**: Prisma v7 + SQLite (via `better-sqlite3`)
- **Auth**: NextAuth v5 — magic link via Resend
- **Emails**: React Email + Resend
- **Deploy**: Docker Compose

## Getting Started (Local Dev)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env` and update the values:

```bash
cp .env .env.local
```

Required variables:
```
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="your-secret-at-least-32-chars"
RESEND_API_KEY="re_..."
RESEND_FROM="Luna <noreply@yourdomain.com>"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Generate Prisma client & migrate

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running with Docker

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The SQLite database is persisted in a Docker volume `luna-db`.

Set secrets in a `.env` file next to `docker-compose.yml`:

```env
AUTH_SECRET=your-32-char-secret
RESEND_API_KEY=re_...
RESEND_FROM=Luna <noreply@yourdomain.com>
NEXTAUTH_URL=http://localhost:3000
```

---

## Features

- **Cycle tracking** — Menstrual, Follicular, Ovulation, Luteal phases
- **Daily logging** — Flow, symptoms, mood, energy, BBT, cervical mucus, sexual activity, notes
- **Phase recommendations** — Personalised tips based on phase + pregnancy preference
- **Partner view** — Token-gated page for partners with plain-language phase info and tips
- **Magic link auth** — No passwords, sign in via email
- **PWA** — Installable on mobile home screen
- **Email notifications** — Period reminders, fertile window alerts, daily log reminders

## App Structure

```
app/
  (auth)/login/        — Magic link sign-in
  (app)/
    dashboard/         — Phase card, calendar, quick-log, recommendations
    log/               — Full daily log form
    profile/           — Pregnancy pref, cycle length, name
    partner/           — Partner invite management
  partner-view/[token] — Token-gated partner view (no login required)
  api/                 — REST endpoints

emails/                — React Email templates
lib/
  cycle/               — Phase calculation & recommendations engine
  email/               — Resend wrapper
```
