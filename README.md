# EthioConnect 🇪🇹

**Find trusted local services in Ethiopia** — plumbers, electricians, mechanics, tutors, hair salons, cleaners, freelancers and more.

Live demo: http://localhost:3000

## Features

- **Homepage** — hero search (keyword + city), popular service categories (with Amharic names), top-rated providers, how-it-works
- **Browse & Search** (`/providers`) — real-time filters: keyword, category, city, Addis Ababa subcity, minimum rating; sort by recommended / top rated / lowest price / newest; pagination
- **Provider profiles** (`/providers/[id]`) — bio, portfolio-ready layout, pricing (hourly/fixed/negotiable, ETB), location down to woreda, rating breakdown chart, verified badge
- **Direct contact** — Call (`tel:`), Telegram (`t.me/`), WhatsApp (`wa.me/`) — the channels people actually use in Ethiopia
- **Reviews & ratings** — clients can rate 1–5★ and comment; one review per client per provider; star breakdown
- **Provider registration** (`/register`) — 3-step wizard: account → business & categories → location & contact
- **Admin dashboard** (`/admin`) — platform stats, verification queue (approve / deactivate / delete), latest reviews
- **Auth** — email + password (bcrypt), HMAC-signed session cookies, roles: `CLIENT`, `PROVIDER`, `ADMIN`
- **Bilingual data** — every category has English + Amharic names

## Tech stack

- **Next.js 16** (App Router, React 19, Server Components + client islands)
- **TypeScript**, **Tailwind CSS 4**
- **PostgreSQL** (Supabase) + **Prisma 5** ORM
- **lucide-react** icons

## Quick start

```bash
npm install
npx prisma generate
npx prisma db push        # create tables
npm run db:seed           # load demo data
npm run dev               # http://localhost:3000
```

### Environment (`.env`)

```
DATABASE_URL="postgresql://..."   # Supabase connection string
SESSION_SECRET="..."              # any long random string
COOKIE_SECURE="true"              # set true when deploying behind HTTPS
```

## Demo accounts

| Role     | Email                  | Password   |
| -------- | ---------------------- | ---------- |
| Admin    | admin@ethioconnect.et  | admin123   |
| Client   | client@ethioconnect.et | client123  |
| Provider | abraham@boleplumbing.et| provider123|

## Project structure

```
prisma/schema.prisma        # User, Category, ProviderProfile, Review
prisma/seed.js              # demo data (6 Ethiopian providers + reviews)
src/lib/
  prisma.ts                 # Prisma singleton
  dbRetry.ts                # retries transient Supabase cold-start errors
  auth.ts                   # sessions, bcrypt, cookies
  queries.ts                # search/filter/aggregation queries
  constants.ts              # categories (EN/AM), cities, Addis subcities
src/app/
  page.tsx                  # homepage
  providers/page.tsx        # browse + search/filter
  providers/[id]/page.tsx   # provider profile
  register/page.tsx         # provider registration wizard
  login/page.tsx            # login
  admin/page.tsx            # admin dashboard
  api/                      # REST API (auth, providers, reviews, admin)
src/components/             # Navbar, Footer, ProviderCard, Stars,
                            # SearchFilters, ReviewForm, ReviewList, ...
```

## API

| Method | Route                          | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | `/api/providers?q=&city=&category=&minRating=&sort=&page=` | search providers |
| GET    | `/api/providers/[id]`          | provider detail + reviews      |
| POST   | `/api/reviews`                 | create review (auth: client)   |
| POST   | `/api/auth/register`           | register (client or provider)  |
| POST   | `/api/auth/login`              | login → sets session cookie    |
| POST   | `/api/auth/logout`             | clear session                  |
| GET    | `/api/auth/me`                 | current session user           |
| GET    | `/api/admin/stats`             | dashboard stats (admin only)   |
| PATCH  | `/api/admin/providers/[id]`    | approve / reject / deactivate  |


