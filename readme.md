# Portfolio — Personal

Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Information architecture

- **Services I offer** — the four offerings I sell.
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
