// The portfolio chat assistant's brain: free, no API key, runs in the browser.
// It matches a question to a topic (with typo and Hinglish tolerance) and builds
// the answer from lib/data.ts, so editing your data updates the bot too.
// Every answer ends with follow-up questions, so the chat keeps looping.
import {
  caseStudies,
  experience,
  freelanceFacts,
  hats,
  impact,
  profile,
  projects,
  services,
  sites,
  skills,
  workflow,
} from "./data";

export type BotReply = { id: string; text: string; chips: string[] };

/* ---------------- helpers ---------------- */

const mail = (subject = "Project inquiry") =>
  `[${profile.email}](mailto:${profile.email}?subject=${encodeURIComponent(subject)})`;
const tel = `[${profile.phone}](tel:${profile.phone.replace(/\s/g, "")})`;
const hasLinkedIn = !/your-handle/i.test(profile.linkedin);
const current = experience.find((j) => j.current) ?? experience[0];
const fact = (label: string) => freelanceFacts.find((f) => f.label === label)?.value ?? "";
const clientName = (c: (typeof caseStudies)[number]) => c.client.split(" — ")[0];
const external = (href: string) => /^https?:\/\//.test(href) && !/github\.com\/[^/]+\/?$/.test(href);

// Follow-up questions. Each one routes back to a topic (checked by the self-test).
export const Q = {
  about: "Who is Ankit?",
  projects: "Show me his projects",
  clients: "Client results",
  services: "What services does he offer?",
  skills: "What's his tech stack?",
  experience: "Where has he worked?",
  current: "What's his current job?",
  ai: "What AI work has he done?",
  devops: "Tell me about his DevOps work",
  hire: "How do I hire him?",
  pricing: "How much does he charge?",
  process: "How does he work?",
  available: "Is he available for freelance?",
  sites: "Which sites has he built?",
  impact: "Hackathons & mentoring",
  why: "Why should I hire him?",
  contact: "How do I contact him?",
  github: "Show me his GitHub",
  location: "Where is he based?",
};

export const STARTER_QUESTIONS = [Q.about, Q.projects, Q.services, Q.available, Q.contact];

/* ---------------- text matching ---------------- */

function normalize(s: string): string {
  return ` ${s
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9.+#@/\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

function tokenize(text: string): string[] {
  return text
    .trim()
    .split(" ")
    .map((t) => t.replace(/^[.\-/]+|[.\-/?]+$/g, ""))
    .filter(Boolean);
}

function lev(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

// Common words that sit one typo away from a keyword ("still" ~ "skill").
const NO_FUZZY = new Set(["still", "where", "there", "their", "these", "those", "which", "would", "could", "should", "other", "while", "start", "state", "store", "stuff", "thing", "think", "place", "plans", "progress", "price", "studies", "done", "kaise", "kaisa"]);

function wordIndex(tokens: string[], key: string, fuzzy = true): number {
  return tokens.findIndex((t) => {
    if (t === key) return true;
    if (key.length >= 4 && t.startsWith(key) && t.length - key.length <= 3) return true; // plurals, -ing, -ed
    if (!fuzzy || key.length < 5 || NO_FUZZY.has(t) || Math.abs(t.length - key.length) > 2) return false;
    return lev(t, key) <= (key.length >= 8 ? 2 : 1); // typos
  });
}

const isPhrase = (key: string) => key.includes(" ") || /[.+#/]/.test(key);

function hit(text: string, tokens: string[], key: string, fuzzy = true): boolean {
  return isPhrase(key) ? text.includes(` ${key}`) : wordIndex(tokens, key, fuzzy) !== -1;
}

// Phrases add their weight; single words count once per word of the question,
// so "projects" doesn't score twice for matching both "project" and "projects".
function score(text: string, tokens: string[], t: Topic): number {
  const used = new Set<number>();
  let total = 0;
  const add = (key: string, weight: number) => {
    if (isPhrase(key)) {
      if (text.includes(` ${key}`)) total += weight;
      return;
    }
    const i = wordIndex(tokens, key);
    if (i !== -1 && !used.has(i)) {
      used.add(i);
      total += weight;
    }
  };
  t.strong.forEach((k) => add(k, 2));
  t.weak?.forEach((k) => add(k, 1));
  return total;
}


/* ---------------- entities: projects, clients, companies, tech ---------------- */

const PROJECT_ALIASES: Record<string, string[]> = {
  healthiq: ["healthiq", "health iq", "medical", "doctor"],
  autosage: ["autosage", "auto sage", "car price"],
  "serverless-feedback": ["serverless feedback", "feedback system", "feedback app"],
};

const CLIENT_ALIASES: Record<string, string[]> = {
  doum: ["doum"],
  onit: ["onit", "on it india", "onitindia"],
  astrabite: ["astrabite", "astra bite"],
  streecare: ["streecare", "stree care"],
  "dg-link": ["dglink", "dg link"],
  runeasy: ["runeasy", "run easy"],
};

const COMPANY_ALIASES: Record<string, string[]> = {
  relabel: ["relabel", "studio by relabel"],
  suvidha: ["suvidha"],
};

// Canonical skill name -> extra ways people type it.
const TECH_EXTRA: Record<string, string[]> = {
  "Next.js": ["nextjs", "next js", "next.js"],
  "Node.js": ["node", "nodejs", "node js", "node.js"],
  TypeScript: ["ts", "typescript"],
  JavaScript: ["js", "javascript"],
  Go: ["golang"],
  React: ["reactjs", "react.js"],
  "React Native": ["rn"],
  "Tailwind CSS": ["tailwind"],
  PostgreSQL: ["postgres", "psql", "sql"],
  MongoDB: ["mongo"],
  DynamoDB: ["dynamo"],
  NestJS: ["nest", "nest.js"],
  Express: ["expressjs", "express.js"],
  "GitHub Actions": ["gh actions", "github action"],
  AWS: ["amazon web services", "lambda", "s3", "api gateway", "aws lambda"],
  REST: ["rest api", "restful", "apis", "api"],
  LLMs: ["llm", "gpt", "openai", "large language model", "claude", "gemini"],
  Serverless: ["serverless"],
};

const TECH: { name: string; category: string; aliases: string[] }[] = Object.entries(skills)
  .flatMap(([category, list]) =>
    list.map((name) => ({
      name,
      category,
      // "go" alone is too common a word ("go ahead"); match "golang" instead.
      aliases: [...(name === "Go" ? [] : [name.toLowerCase()]), ...(TECH_EXTRA[name] ?? [])],
    })),
  )
  // longer aliases first so "react native" wins over "react"
  .sort((a, b) => Math.max(...b.aliases.map((x) => x.length)) - Math.max(...a.aliases.map((x) => x.length)));

const UNKNOWN_TECH = [
  "java", "kotlin", "swift", "php", "laravel", "django", "flask", "fastapi", "ruby", "rails", "rust", "c++", "c#",
  ".net", "dotnet", "angular", "vue", "svelte", "docker", "kubernetes", "k8s", "terraform", "gcp", "azure",
  "firebase", "graphql", "mysql", "redis", "wordpress", "shopify", "figma", "solidity", "blockchain", "unity",
  "webflow", "wix", "power bi", "tableau", "salesforce", "selenium",
];

const ASK_WORDS = [
  "know", "knows", "use", "uses", "used", "using", "experience", "experienced", "skill", "skilled", "familiar",
  "expert", "proficient", "good at", "work with", "worked with", "comfortable", "can he", "does he", "aata", "aati",
];

function findAlias(text: string, tokens: string[], map: Record<string, string[]>): string | null {
  for (const [key, aliases] of Object.entries(map)) {
    if (aliases.some((a) => hit(text, tokens, a, a.length >= 6))) return key;
  }
  return null;
}

function findTech(text: string, tokens: string[]) {
  for (const t of TECH) if (t.aliases.some((a) => hit(text, tokens, a, a.length >= 6))) return t;
  return null;
}

function techUsage(t: (typeof TECH)[number]): string[] {
  const has = (s: string) => t.aliases.some((a) => a.length > 2 && s.toLowerCase().includes(a));
  const out: string[] = [];
  for (const p of projects) if ([...p.tags, p.blurb].some(has)) out.push(`[${p.title}](/projects/${p.slug})`);
  for (const c of caseStudies) if ([...c.tags, c.built].some(has)) out.push(`[${clientName(c)}](/impact/${c.slug})`);
  for (const j of experience) if (j.points.some(has)) out.push(j.company.split(" — ")[0]);
  return Array.from(new Set(out)).slice(0, 5);
}

/* ---------------- answers ---------------- */

const r = (id: string, text: string, chips: string[]): BotReply => ({ id, text, chips });

const A = {
  greet: () =>
    r("greet", "Hey! 👋 What would you like to know about Ankit? Pick a question below or type your own.", STARTER_QUESTIONS),

  bot: () =>
    r(
      "bot",
      `I'm Ankit's portfolio assistant. I answer instantly from what's on this site: his projects, skills, experience and how to hire him.\n\nFor anything I can't answer, email him at ${mail("Question")}.`,
      [Q.about, Q.projects, Q.hire],
    ),

  about: () =>
    r(
      "about",
      `**${profile.name}** is a ${profile.role} based in ${profile.location}. ${profile.pitch}\n\n` +
        `- Currently **${current.role}** at ${current.company}\n` +
        hats.map((h) => `- **${h.hat}** (${h.verb.toLowerCase()}): ${h.proof}`).join("\n"),
      [Q.projects, Q.why, Q.hire],
    ),

  why: () =>
    r(
      "why",
      `Why clients pick Ankit:\n` +
        `- **One engineer for the whole job:** he builds it, automates it with AI and keeps it running\n` +
        `- **Proven in production:** ${hats[0].proof}; ${hats[2].proof}\n` +
        `- **He owns it after launch:** he monitors, fixes and improves what he ships\n` +
        `- **Real results:** ${clientName(caseStudies[1])} got ${caseStudies[1].highlight.toLowerCase()}, ${clientName(caseStudies[0])} got ${caseStudies[0].highlight.toLowerCase()}`,
      [Q.clients, Q.process, Q.hire],
    ),

  services: () =>
    r(
      "services",
      `Ankit offers:\n` + services.map((s) => `- **[${s.title}](/services/${s.slug})**: ${s.blurb}`).join("\n"),
      ["Web development", "Mobile apps", "AI & DevOps consulting"],
    ),

  service: (slug: string) => {
    const s = services.find((x) => x.slug === slug)!;
    return r(
      `service:${slug}`,
      `**${s.title}**: ${s.intro}\n\nWhat he offers:\n${s.offers.map((o) => `- ${o}`).join("\n")}\n\n**Proof:** ${s.proof}\n\n[More about ${s.title}](/services/${s.slug})`,
      [Q.hire, Q.pricing, Q.process],
    );
  },

  projects: () =>
    r(
      "projects",
      `Some of Ankit's projects:\n` +
        projects.map((p) => `- **[${p.title}](/projects/${p.slug})**: ${p.blurb}`).join("\n"),
      [`Tell me about ${projects[0].title}`, Q.clients, Q.sites],
    ),

  project: (slug: string) => {
    const p = projects.find((x) => x.slug === slug)!;
    const others = projects.filter((x) => x.slug !== slug).slice(0, 1);
    const links = [`[Project page](/projects/${p.slug})`];
    if (/github\.com/.test(p.href)) links.push(`[GitHub](${p.href})`);
    else if (external(p.href)) links.push(`[Live site](${p.href})`);
    return r(
      `project:${slug}`,
      `**${p.title}**: ${p.blurb}\n\n**Stack:** ${p.tags.join(", ")}\n\n${links.join(" · ")}`,
      [...others.map((o) => `Tell me about ${o.title}`), Q.projects, Q.hire].slice(0, 3),
    );
  },

  clients: () =>
    r(
      "clients",
      `Recent client results:\n` +
        caseStudies.map((c) => `- **[${clientName(c)}](/impact/${c.slug})**: ${c.outcome}`).join("\n"),
      [`Tell me about ${clientName(caseStudies[1])}`, Q.sites, Q.hire],
    ),

  client: (slug: string) => {
    const c = caseStudies.find((x) => x.slug === slug)!;
    const job = experience.find((j) => j.company.toLowerCase().includes(clientName(c).toLowerCase().split(" ")[0]));
    const links = [`[Full case study](/impact/${c.slug})`];
    if (external(c.href)) links.push(`[Live site](${c.href})`);
    return r(
      `client:${slug}`,
      `**${c.client}**${job ? `: Ankit worked here as **${job.role}** (${job.period})` : ""}\n\n` +
        `- **Before:** ${c.before}\n- **What he built:** ${c.built}\n- **Outcome:** ${c.outcome}\n\n` +
        `**Stack:** ${c.tags.join(", ")}\n\n${links.join(" · ")}`,
      [Q.clients, Q.hire, Q.why],
    );
  },

  job: (j: (typeof experience)[number], id: string) =>
    r(
      id,
      `**${j.role}** at **${j.company}** (${j.period}, ${j.place})${j.current ? ", his current role" : ""}\n\n${j.points.map((p) => `- ${p}`).join("\n")}`,
      [Q.experience, Q.skills, Q.hire],
    ),

  experience: () =>
    r(
      "experience",
      `Ankit's experience, newest first:\n` +
        experience
          .map((j) => `- **${j.role}**, ${j.company} · ${j.period}${j.current ? " (current)" : ""}`)
          .join("\n") +
        `\n\nMore on the [experience page](/experience).`,
      [Q.current, Q.clients, Q.skills],
    ),

  skills: () =>
    r(
      "skills",
      `Ankit's tech stack:\n` +
        Object.entries(skills)
          .map(([k, v]) => `- **${k}:** ${v.join(", ")}`)
          .join("\n") +
        `\n\nYou can ask about a specific tool, like "Does he know Next.js?"`,
      ["Does he know Next.js?", Q.ai, Q.projects],
    ),

  tech: (t: (typeof TECH)[number]) => {
    const used = techUsage(t);
    return r(
      `tech:${t.name}`,
      `**Yes, ${t.name}** is part of his ${t.category} toolkit.` +
        (used.length ? `\n\nWhere he's used it: ${used.join(", ")}.` : "") +
        `\n\nSee the full list on the [skills page](/skills).`,
      [Q.skills, Q.projects, Q.hire],
    );
  },

  unknownTech: (name: string) =>
    r(
      "tech:unknown",
      `**${name}** isn't in Ankit's listed stack. His core tools are ${skills.Frontend?.join(", ")}, ${skills.Backend?.slice(0, 3).join(", ")}, ${skills.Mobile?.join(" and ")}, and AWS.\n\nIf your project needs ${name}, email ${mail("Tech question")} to check the fit.`,
      [Q.skills, Q.services, Q.hire],
    ),

  ai: () => {
    const hq = projects.find((p) => p.slug === "healthiq");
    const consult = services.find((s) => s.slug === "consulting");
    return r(
      "ai",
      `${hats[1].text}\n\n` +
        (hq ? `- **[${hq.title}](/projects/${hq.slug})**: ${hq.blurb}\n` : "") +
        (consult ? `- **[${consult.title}](/services/${consult.slug})**: ${consult.offers.join("; ")}` : ""),
      [hq ? `Tell me about ${hq.title}` : Q.projects, Q.devops, Q.hire],
    );
  },

  devops: () => {
    const onit = caseStudies.find((c) => c.slug === "onit");
    return r(
      "devops",
      `${hats[2].text}\n\n` +
        (onit ? `**Example: ${clientName(onit)}.** ${onit.built} Result: ${onit.outcome} [Case study](/impact/${onit.slug})` : ""),
      [onit ? `Tell me about ${clientName(onit)}` : Q.clients, Q.ai, Q.hire],
    );
  },

  sites: () =>
    r(
      "sites",
      `Live sites Ankit has built:\n` + sites.map((s) => `- [${s}](https://${s})`).join("\n"),
      [Q.clients, "Web development", Q.hire],
    ),

  contact: () =>
    r(
      "contact",
      `Here's how to reach Ankit:\n` +
        `- **Email:** ${mail()}\n- **Phone:** ${tel}\n` +
        `- **Instagram:** [@${profile.instagramHandle}](${profile.instagram})\n` +
        `- **GitHub:** [${profile.github}](${profile.githubUrl})\n` +
        (hasLinkedIn ? `- **LinkedIn:** [Connect](${profile.linkedin})\n` : "") +
        `\nOr use the [contact page](/contact). He replies within 48 hours.`,
      [Q.hire, Q.pricing, Q.available],
    ),

  hire: () =>
    r(
      "hire",
      `Great! Start with an email to ${mail()}. Include:\n- What you need built, automated or fixed\n- Your rough timeline\n- Your budget range\n\nHe replies within 48 hours with a plan, not a pitch. Typical engagements run **${fact("Typical engagement")}**.`,
      [Q.process, Q.pricing, Q.clients],
    ),

  pricing: () =>
    r(
      "pricing",
      `Ankit doesn't publish fixed prices; every quote depends on scope. Email ${mail("Quote request")} with what you need, your timeline and budget range, and he'll reply within 48 hours with a plan and a quote.\n\nFor reference, typical engagements run **${fact("Typical engagement")}**.`,
      [Q.hire, Q.process, Q.services],
    ),

  available: () =>
    r(
      "available",
      `**Yes, he takes freelance projects**, alongside his role at ${current.company}. He keeps it to a small number each quarter so each one gets full attention.\n\n` +
        freelanceFacts.map((f) => `- **${f.label}:** ${f.value}`).join("\n") +
        `\n\nTo check current availability, email ${mail("Availability")}. [Freelance details](/freelance)`,
      [Q.hire, Q.pricing, Q.process],
    ),

  location: () =>
    r(
      "location",
      `Ankit is based in **${profile.location}** and works remotely with clients anywhere. Timezone: ${fact("Timezone")}.`,
      [Q.available, Q.hire, Q.about],
    ),

  process: () =>
    r(
      "process",
      `How a project with Ankit runs:\n` +
        workflow.map((w) => `- **${w.step}. ${w.title}:** ${w.text}`).join("\n") +
        `\n\n**Working style:** ${fact("Working style")} · **Typical length:** ${fact("Typical engagement")}`,
      [Q.hire, Q.pricing, Q.clients],
    ),

  impact: () =>
    r(
      "impact",
      `Beyond client work, Ankit gives back to the student community:\n` +
        impact.map((i) => `- **${i.title}** (${i.tag.toLowerCase()}, ${i.date}): ${i.blurb}`).join("\n") +
        `\n\nMore on the [mentoring page](/mentoring).`,
      [Q.about, Q.projects, Q.contact],
    ),

  github: () => {
    const onGh = projects.filter((p) => /github\.com/.test(p.href)).map((p) => `[${p.title}](/projects/${p.slug})`);
    return r(
      "github",
      `Ankit's code is on GitHub: [github.com/${profile.github}](${profile.githubUrl}).` +
        (onGh.length ? `\n\nProjects there include ${onGh.join(", ")}.` : "") +
        ` Live stats are on the [GitHub page](/github).`,
      [Q.projects, Q.skills, Q.contact],
    );
  },

  resume: () =>
    r(
      "resume",
      `There's no downloadable resume on the site yet. You can request it at ${mail("Resume request")}.\n\nMeanwhile, the [experience page](/experience) covers his work history.`,
      [Q.experience, Q.skills, Q.contact],
    ),

  education: () =>
    r(
      "education",
      `I don't have Ankit's education details. This assistant only knows about his work. You can ask him at ${mail("Question")}.`,
      [Q.experience, Q.skills, Q.about],
    ),

  personal: () =>
    r("personal", `I only know about Ankit's work, so I can't answer that one. Ask me about his projects, skills or how to hire him!`, [
      Q.about,
      Q.projects,
      Q.hire,
    ]),

  blog: () =>
    r(
      "blog",
      `Long-form posts are coming soon. For now Ankit shares what he's building and learning on Instagram: [@${profile.instagramHandle}](${profile.instagram}).`,
      [Q.projects, Q.ai, Q.contact],
    ),

  thanks: () => r("thanks", `Happy to help! Anything else you'd like to know?`, [Q.hire, Q.projects, Q.contact]),

  bye: () => r("bye", `Thanks for stopping by! 👋 If you'd like to work together, email ${mail()}.`, [Q.hire, Q.projects]),

  fallback: () =>
    r(
      "fallback",
      `I'm not sure about that one. I'm a simple assistant that knows about Ankit's work. Try one of these, or email him at ${mail("Question")}.`,
      [Q.about, Q.projects, Q.hire],
    ),
};

/* ---------------- topics ---------------- */

type Topic = { id: string; strong: string[]; weak?: string[]; answer: () => BotReply };

const TOPICS: Topic[] = [
  { id: "bot", strong: ["are you a bot", "are you ai", "are you an ai", "who are you", "what are you", "are you real", "are you human", "your name", "who made you", "who built you", "who created you"], answer: A.bot },
  { id: "pricing", strong: ["price", "pricing", "cost", "charge", "rate", "rates", "fee", "fees", "budget", "quote", "how much", "kitna", "kitne", "paisa", "paise", "expensive", "cheap", "affordable", "hourly", "salary", "ctc", "package"], answer: A.pricing },
  { id: "hire", strong: ["hire", "hiring", "work with him", "work together", "start a project", "project inquiry", "proposal", "collaborate", "collaboration", "engage", "need a developer", "need a dev", "onboard", "book him"], answer: A.hire },
  { id: "available", strong: ["available", "availability", "freelance", "freelancing", "freelancer", "free to", "open to", "taking projects", "new projects", "accepting", "bandwidth", "capacity", "full time", "full-time", "part time", "part-time", "busy"], answer: A.available },
  { id: "contact", strong: ["contact", "email", "e-mail", "gmail", "mail", "reach", "phone", "number", "call", "whatsapp", "get in touch", "talk to", "connect", "message him", "dm", "socials", "social media", "instagram", "insta", "linkedin", "twitter", "sampark", "baat"], answer: A.contact },
  { id: "why", strong: ["why hire", "why should", "why ankit", "why him", "what makes", "different", "stand out", "unique", "best developer", "good developer", "trust", "convince"], weak: ["why", "strength", "strengths", "better"], answer: A.why },
  { id: "about", strong: ["who is", "about ankit", "about him", "introduce", "tell me about ankit", "tell me about him", "what does ankit do", "what does he do", "kaun", "kon hai", "overview", "summary", "bio"], weak: ["ankit", "about", "who", "profile", "himself"], answer: A.about },
  { id: "resume", strong: ["resume", "cv", "biodata", "curriculum"], answer: A.resume },
  { id: "education", strong: ["education", "college", "degree", "university", "studied", "study", "graduate", "graduation", "b.tech", "btech", "school", "qualification", "cgpa", "padhai"], answer: A.education },
  { id: "personal", strong: ["age", "how old", "married", "girlfriend", "wife", "hobby", "hobbies", "family", "religion", "birthday"], answer: A.personal },
  { id: "github", strong: ["github", "git hub", "repos", "repo", "repositories", "open source", "source code", "code samples"], answer: A.github },
  { id: "impact", strong: ["hackathon", "mentor", "mentoring", "mentorship", "judge", "judging", "workshop", "drone", "community", "teaching", "students", "speaker", "events", "volunteer"], answer: A.impact },
  { id: "blog", strong: ["blog", "articles", "article", "writing", "posts"], answer: A.blog },
  { id: "location", strong: ["location", "where is he", "where does he live", "based", "city", "country", "timezone", "time zone", "ist", "remote", "relocate", "mumbai", "india", "kahan", "kaha"], answer: A.location },
  { id: "process", strong: ["process", "how does he work", "how he works", "how do you work", "workflow", "approach", "steps", "methodology", "timeline", "how long", "duration", "communication", "how will it work"], answer: A.process },
  { id: "current", strong: ["current job", "currently", "right now", "working now", "present", "current role", "current company", "where does he work", "abhi"], answer: () => A.job(current, "current") },
  { id: "experience", strong: ["worked", "work history", "career", "job", "jobs", "companies", "company", "employer", "previous", "past roles", "internship", "intern", "naukri", "years"], weak: ["experience", "background", "roles", "role"], answer: A.experience },
  { id: "ai", strong: ["ai", "a.i", "artificial intelligence", "llm", "llms", "rag", "ocr", "machine learning", "ml", "chatbot", "automation", "automate", "n8n", "gpt", "genai", "gen ai", "consulting"], answer: A.ai },
  { id: "devops", strong: ["devops", "dev ops", "ci/cd", "cicd", "ci cd", "pipeline", "deployment", "deploy", "cloud", "infrastructure", "zero downtime", "hosting", "server"], answer: A.devops },
  { id: "clients", strong: ["client", "clients", "case study", "case studies", "results", "customers", "businesses", "outcomes", "success stories", "testimonials"], answer: A.clients },
  { id: "sites", strong: ["sites", "live sites", "websites he", "websites built", "built websites", "which websites", "live websites", "domains", "links"], answer: A.sites },
  { id: "skills", strong: ["skill", "skills", "stack", "tech stack", "technologies", "technology", "tech", "tools", "languages", "frameworks", "expertise", "good at"], weak: ["know", "knows"], answer: A.skills },
  { id: "services", strong: ["services", "service", "offer", "offering", "what can he do", "what can he build", "help me", "help with", "provide"], weak: ["need", "can he build", "can he make"], answer: A.services },
  { id: "web", strong: ["website", "web app", "web development", "web dev", "webapp", "landing page", "dashboard", "ecommerce", "e-commerce", "frontend", "full stack", "full-stack", "fullstack"], weak: ["web", "site"], answer: () => A.service("web-development") },
  { id: "mobile", strong: ["mobile", "app", "apps", "android", "ios", "play store", "playstore", "mobile app", "application"], answer: () => A.service("mobile-apps") },
  { id: "branding", strong: ["branding", "brand", "logo", "identity", "visual identity"], weak: ["design", "ui", "ux", "seo"], answer: () => A.service("branding") },
  { id: "projects", strong: ["project", "projects", "portfolio", "best work", "showcase", "examples", "samples"], weak: ["work", "built", "build", "made", "created", "kaam"], answer: A.projects },
  { id: "greet", strong: [], weak: ["hi", "hello", "hey", "hii", "hiii", "heyy", "namaste", "yo", "sup", "good morning", "good evening", "good afternoon", "hola"], answer: A.greet },
  { id: "thanks", strong: [], weak: ["thanks", "thank you", "thx", "ty", "shukriya", "dhanyavad", "great", "awesome", "cool", "nice", "perfect", "helpful"], answer: A.thanks },
  { id: "bye", strong: [], weak: ["bye", "goodbye", "see you", "cya", "alvida"], answer: A.bye },
];

const MORE = ["yes", "yeah", "yep", "sure", "ok", "okay", "more", "tell me more", "go on", "continue", "haan", "ha", "hmm", "and"];

/* ---------------- main entry ---------------- */

export function answer(question: string, lastChips: string[] = STARTER_QUESTIONS): BotReply {
  const text = normalize(question);
  const tokens = tokenize(text);
  if (!tokens.length) return A.greet();

  // "yes / tell me more" keeps the loop going with the previous follow-ups.
  if (MORE.includes(text.trim())) return r("more", "Sure! Here's where we can go next:", lastChips);

  const asking = ASK_WORDS.some((w) => hit(text, tokens, w, false));
  const short = tokens.length <= 4;

  // 1. Named things: a project, a client, a company.
  const project = findAlias(text, tokens, PROJECT_ALIASES);
  if (project) return A.project(project);
  const client = findAlias(text, tokens, CLIENT_ALIASES);
  if (client) return A.client(client);
  const company = findAlias(text, tokens, COMPANY_ALIASES);
  if (company) {
    const j = experience.find((x) => x.company.toLowerCase().includes(company));
    if (j) return A.job(j, `company:${company}`);
  }

  // 2. A specific technology ("does he know React?", "flutter").
  const tech = findTech(text, tokens);
  if (tech && (asking || short) && !["LLMs", "RAG", "OCR", "n8n"].includes(tech.name)) return A.tech(tech);
  const unknown = UNKNOWN_TECH.find((u) => hit(text, tokens, u, false));
  if (unknown && (asking || short)) return A.unknownTech(unknown.replace(/^./, (c) => c.toUpperCase()));

  // 3. Best-scoring topic.
  let best: Topic | null = null;
  let bestScore = 0;
  for (const t of TOPICS) {
    const s = score(text, tokens, t);
    if (s > bestScore) {
      best = t;
      bestScore = s;
    }
  }
  if (best) return best.answer();

  if (tech) return A.tech(tech);
  return A.fallback();
}
