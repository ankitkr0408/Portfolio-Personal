// All site content lives here. Later the admin/CMS will replace this file with DB reads.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const profile = {
  name: "Ankit Kumar",
  role: "Full-Stack AI Engineer",
  pitch:
    "I build it, ship it on AWS, and keep it running.",
  photo: "/ankit.jpg", // save your LinkedIn photo to public/ankit.jpg
  email: "ankit12kumar26it@gmail.com",
  phone: "+91 8917021433",
  location: "Navi Mumbai, India",
  github: "ankitkr0408",
  githubUrl: "https://github.com/ankitkr0408",
  linkedin: "https://www.linkedin.com/in/your-handle", // DEMO — replace
};

// DRAFT copy from your resume. Edit with real client details / numbers.
export const caseStudies = [
  {
    slug: "doum",
    highlight: "Two production apps live on Google Play",
    underline: "internal admin dashboards",
    client: "Doum — home services",
    before: "Bookings and service coordination handled by hand.",
    built: "Customer app + Partners app, auth, service-management APIs and internal admin dashboards.",
    outcome: "Two production apps live on Google Play; the team manages services from dashboards instead of chats.",
    tags: ["Node.js", "Mobile", "Admin dashboards"],
    href: "",
  },
  {
    slug: "onit",
    highlight: "Zero-downtime deployments",
    underline: "4-environment CI/CD",
    client: "OnIT — task marketplace",
    before: "Risky manual releases across environments.",
    built: "4-environment CI/CD (dev/QA/staging/prod) on GitHub Actions + AWS Lambda, Postgres migrations, two Play Store apps.",
    outcome: "Zero-downtime deployments and a repeatable release flow.",
    tags: ["AWS", "CI/CD", "PostgreSQL"],
    href: "https://onitindia.com",
  },
  {
    slug: "astrabite",
    highlight: "direct online channel for customers",
    underline: "full website",
    client: "Astrabite — astrabite.com",
    before: "No online presence for the business.",
    built: "Designed and developed the full website: UI/UX, backend integration, domain/DNS and deployment.",
    outcome: "Live brand site with a direct online channel for customers. First freelance client (Nov 2025).",
    tags: ["Next.js", "Vercel", "DNS"],
    href: "https://astrabite.com",
  },
  {
    slug: "streecare",
    highlight: "Discoverable online",
    underline: "enquiry flow",
    client: "StreeCare — streecare.in",
    before: "Offline-only, reachable by word of mouth and calls.",
    built: "End-to-end website with enquiry flow, domain setup and hosting.",
    outcome: "Discoverable online with a clear way for people to get in touch.",
    tags: ["Next.js", "Vercel", "SEO"],
    href: "https://streecare.in",
  },
  {
    slug: "dg-link",
    highlight: "always-on web presence",
    underline: "backend integration",
    client: "DG Link — dglink.co.in",
    before: "Manual, call-driven way of presenting the business.",
    built: "Production website with backend integration and deployment.",
    outcome: "A professional, always-on web presence.",
    tags: ["Web", "Backend", "Deployment"],
    href: "https://dglink.co.in",
  },
  {
    slug: "runeasy",
    highlight: "Live product site",
    underline: "domain and hosting",
    client: "RunEasy — runeasy.in",
    before: "No dedicated site for the service.",
    built: "Website built and deployed end to end, including domain and hosting.",
    outcome: "Live product site ready to take users and enquiries.",
    tags: ["Web", "Vercel", "DNS"],
    href: "https://runeasy.in",
  },
];

export const workflow = [
  { step: "01", title: "Audit", text: "I map how your business really runs and find where the hours leak." },
  { step: "02", title: "Automate", text: "Manual admin steps become dashboards, workflows and AI that never forget." },
  { step: "03", title: "Ship", text: "Live on web or mobile, with CI/CD, domain and hosting handled for you." },
  { step: "04", title: "Own it", text: "I monitor, fix and improve it. If it breaks, it's my problem, not yours." },
];

export type Job = {
  company: string;
  role: string;
  period: string;
  place: string;
  points: string[];
  current?: boolean;
};

// Mozomint intentionally omitted.
export const experience: Job[] = [
  {
    company: "Studio by RELABEL LLP",
    role: "Software Development Engineer",
    period: "Jan 2026 – Present",
    place: "Mumbai",
    current: true,
    points: [
      "Full-stack work across web and mobile: frontend, backend services, APIs and databases.",
      "Building role-based dashboards, real-time updates and secure workflows with product and UI/UX.",
    ],
  },
  {
    company: "Freelance — Astrabite & more",
    role: "Full-stack Developer",
    period: "Nov 2025 – Present",
    place: "Remote",
    points: [
      "Designed and shipped 9+ production sites, end to end: UI, backend, DNS and deployment.",
      "synloop.in, streecare.in, dglink.co.in, astrabite.com, runeasy.in.",
    ],
  },
  {
    company: "OnIT India",
    role: "AI Developer & DevOps (Contract)",
    period: "2026",
    place: "Remote",
    points: [
      "Deployed two live Flutter apps on Google Play for a task marketplace.",
      "Built a 4-environment CI/CD pipeline (dev/QA/staging/prod) on GitHub Actions + AWS Lambda, zero downtime.",
      "Owned PostgreSQL migrations, query optimisation and onitindia.com.",
    ],
  },
  {
    company: "Doum Private Limited",
    role: "Backend App Developer",
    period: "Dec 2024 – Aug 2025",
    place: "Kolkata",
    points: [
      "Built auth, service-management APIs and business logic for a home-services platform.",
      "Shipped two production apps to the Play Store: Doum and Doum Partners.",
    ],
  },
  {
    company: "Suvidha Foundation",
    role: "Backend Web Developer Intern",
    period: "Jun 2024 – Jul 2024",
    place: "Mumbai",
    points: ["First professional role at a women-focused NGO / EdTech: teamwork and workflow."],
  },
];

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  href: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "healthiq",
    title: "HealthIQ",
    blurb:
      "AI medical consultation: LLMs, OCR and a RAG chatbot that reads reports and recommends doctors.",
    tags: ["LLM", "RAG", "OCR", "Python"],
    href: "https://github.com/ankitkr0408",
    featured: true,
  },
  {
    slug: "doum-apps",
    title: "Doum & Doum Partners",
    blurb: "Two production home-services apps live on the Google Play Store.",
    tags: ["Node.js", "Mobile", "PostgreSQL"],
    href: "#",
    featured: true,
  },
  {
    slug: "onit-platform",
    title: "OnIT Platform",
    blurb: "Task marketplace with zero-downtime, 4-environment CI/CD on AWS.",
    tags: ["Flutter", "AWS Lambda", "GitHub Actions"],
    href: "https://onitindia.com",
    featured: true,
  },
  {
    slug: "autosage",
    title: "AutoSage",
    blurb: "Car price prediction (Random Forest) with a real-time Streamlit UI.",
    tags: ["ML", "Python", "Streamlit"],
    href: "https://github.com/ankitkr0408",
  },
  {
    slug: "serverless-feedback",
    title: "Serverless Feedback System",
    blurb: "Real-time feedback app on Lambda, API Gateway, DynamoDB and S3.",
    tags: ["AWS", "Serverless"],
    href: "https://github.com/ankitkr0408",
  },
];

export const sites = [
  "synloop.in",
  "streecare.in",
  "dglink.co.in",
  "astrabite.com",
  "gdgpce.vercel.app",
  "runeasy.in",
  "onitindia.com",
];

export const skills: Record<string, string[]> = {
  Languages: ["JavaScript", "TypeScript", "Python", "Go"],
  Frontend: ["React", "Next.js", "Tailwind CSS"],
  Backend: ["Node.js", "NestJS", "Express", "REST"],
  Mobile: ["React Native", "Flutter"],
  "AI / Automation": ["LLMs", "RAG", "OCR", "n8n"],
  Data: ["PostgreSQL", "MongoDB", "DynamoDB", "Supabase"],
  "Cloud & DevOps": ["AWS", "GitHub Actions", "Vercel", "Serverless"],
};

export type Impact = {
  tag: string;
  date: string;
  title: string;
  org: string;
  blurb: string;
  photo: string; // DEMO photos — swap with real ones in /public
};

export const impact: Impact[] = [
  {
    tag: "JUDGE",
    date: "MAR 2026",
    title: "PCE Hackathon 2026",
    org: "Pillai College of Engineering",
    blurb:
      "Judged innovative student projects across web, AI and mobile tracks. Interacted with amazing builders and ideas.",
    photo: "https://picsum.photos/seed/hackathon/800/500",
  },
  {
    tag: "MENTOR",
    date: "2026",
    title: "National-level Hackathon",
    org: "Mentor",
    blurb: "Mentored teams from idea to working demo.",
    photo: "https://picsum.photos/seed/mentor/800/500",
  },
  {
    tag: "WORKSHOP",
    date: "2025",
    title: "Drone Workshop",
    org: "Hands-on session",
    blurb: "Led a hands-on drone workshop for students.",
    photo: "https://picsum.photos/seed/drone/800/500",
  },
];

// DEMO: replace with real LinkedIn post URLs from students.
export const linkedinPosts = [
  { author: "Student One", text: "Thank you Ankit for the amazing mentorship at the hackathon!", url: "https://www.linkedin.com" },
  { author: "Student Two", text: "Learned so much from the drone workshop. Great session!", url: "https://www.linkedin.com" },
  { author: "Student Three", text: "Ankit's feedback on our project changed how we think about shipping.", url: "https://www.linkedin.com" },
  { author: "Student Four", text: "Best judge panel moment: practical, honest, encouraging.", url: "https://www.linkedin.com" },
];

export const services = [
  {
    slug: "web-development",
    title: "Web Development",
    blurb: "Marketing sites, dashboards and full-stack web apps built to ship.",
    intro: "From a landing page that converts to a full-stack product with auth, dashboards and real-time updates.",
    offers: ["Marketing & landing pages", "Role-based dashboards & internal tools", "Full-stack apps (Next.js, Node, Postgres)", "Domain, DNS & Vercel/AWS deployment"],
    proof: "9+ production sites shipped: synloop.in, streecare.in, astrabite.com, runeasy.in and more.",
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    blurb: "Cross-platform apps from prototype to Play Store.",
    intro: "React Native and Flutter apps with a solid backend behind them.",
    offers: ["React Native / Flutter apps", "Backend APIs & auth", "Play Store release & CI/CD", "Maintenance & updates"],
    proof: "Shipped Doum, Doum Partners, OnIT and OnIT Consumer to Google Play.",
  },
  {
    slug: "consulting",
    title: "AI & DevOps Consulting",
    blurb: "AI automation, RAG pipelines and CI/CD set-up.",
    intro: "Practical AI and delivery-pipeline work that saves your team time.",
    offers: ["LLM / RAG / OCR features", "n8n workflow automation", "Multi-environment CI/CD (GitHub Actions, AWS Lambda)", "Postgres schema & query optimisation"],
    proof: "Built a 4-environment zero-downtime pipeline for OnIT and the HealthIQ AI system.",
  },
  {
    slug: "branding",
    title: "Branding & Landing Pages",
    blurb: "Visual identity and product-led landing pages.",
    intro: "Sharp, memorable web presence for studios and early-stage products.",
    offers: ["Landing pages with strong visual identity", "UI/UX implementation from design", "SEO & performance basics"],
    proof: "Brand and business sites like astrabite.com.",
  },
];

export const hats = [
  {
    hat: "SDE",
    verb: "Build it",
    text: "Full-stack web and mobile products: Next.js, Node, NestJS, Postgres. Auth, dashboards, real-time and APIs that hold up under real users.",
    proof: "4 apps on Google Play, 9+ sites live",
  },
  {
    hat: "AI Engineer",
    verb: "Automate it",
    text: "LLMs, RAG pipelines, OCR and n8n workflows that take repetitive admin work off your team and never get tired.",
    proof: "HealthIQ: AI that reads medical reports",
  },
  {
    hat: "DevOps",
    verb: "Keep it running",
    text: "CI/CD, AWS and serverless, multi-environment releases. Deployments your team doesn't have to fear.",
    proof: "4-environment, zero-downtime pipeline",
  },
];
