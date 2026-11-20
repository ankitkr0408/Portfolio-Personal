# Portfolio — Personal

Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Information architecture

- **Services I offer** — the four offerings I sells.
- **Experience** — the roles I've held (internships + full-time jobs).
- **Freelance** — separate, since it's about availability, not a service or a past role.

## Routes

- `/` — Home
- `/projects` — Projects
- `/services` — Services hub
  - `/services/web-development`
  - `/services/mobile-apps`
  - `/services/consulting`
  - `/services/branding`
- `/experience` — Experience hub
  - `/experience/internship`
  - `/experience/job`
- `/freelance` — Freelance availability
- `/blog` — Newsletter / Blog
- `/impact` — Impact
- `/contact` — Contact (ankit75kumar3e@gmail.com)

## Admin portal (`/admin`)

A password-protected CMS for everything on the site: profile, projects, case studies, experience, services, skills, impact and more. Edits are saved to MongoDB and go live immediately (no redeploy). `lib/data.ts` stays as the built-in default/seed, so the site still works if MongoDB is unavailable.

Setup:

1. Create a free MongoDB Atlas cluster and copy its connection string.
2. Copy `.env.example` to `.env.local` and fill in `MONGODB_URI`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (`openssl rand -hex 32`).
3. Add the same variables in Vercel → Project Settings → Environment Variables, then redeploy.
4. Open `/admin` and sign in.

What it does:

- Form editors per section: add, edit, duplicate, delete and reorder items; validation (slugs, URLs, required fields) before saving.
- **Needs attention** on the dashboard flags placeholders (demo LinkedIn URL, demo photos, missing links).
- Every save snapshots the previous version: restore any of the last 10 revisions, or reset a section to the defaults.
- The chat bot, sitemap, SEO metadata and all pages read the same edited content.

Security: signed httpOnly cookie (7 days), middleware plus per-action auth checks, login attempt limiting, `noindex` and `Disallow: /admin`. Use a long random `ADMIN_PASSWORD`.

## Getting started

```bash
npm install
npm run dev
```

App runs at http://localhost:3000.

## Project structure

```
app/
  layout.tsx              Root layout (Navbar + Footer)
  page.tsx                Home
  globals.css             Tailwind + CSS variables
  projects/page.tsx
  services/
    page.tsx              4-service hub
    web-development/page.tsx
    mobile-apps/page.tsx
    consulting/page.tsx
    branding/page.tsx
  experience/
    page.tsx              Experience hub
    internship/page.tsx
    job/page.tsx
  freelance/page.tsx      Standalone availability page
  blog/page.tsx
  impact/page.tsx
  contact/page.tsx
components/
  Navbar.tsx              Sticky nav with active-link highlighting
  Footer.tsx
public/                   Static assets
```


## Feature to work on personal level
1. resume creator for the jd
2. freelance bill genrator
3. same admin panel to manage the leads and all overall to get the insights of the works.
4. something products to acknowledge my knowloedge and business pov to the different users for thier mindset and belonginess check this out also and fig out 
