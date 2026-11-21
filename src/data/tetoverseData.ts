export type ProjectCategory = 'all' | 'math' | 'audio-web' | 'dev-tools';

export type AsciiPosterKind =
  | 'lattice'
  | 'waveform'
  | 'trace'
  | 'relay'
  | 'sieve'
  | 'lemniscate'
  | 'primes'
  | 'native';

export interface ProjectItem {
  id: string;
  repoName: string;
  title: string;
  category: Exclude<ProjectCategory, 'all'>;
  language: string;
  year: string;
  stars: number;
  forks: number;
  posterKind: AsciiPosterKind;
  techStack: string[];
  repoUrl: string;
  liveUrl?: string;
  doi?: string;
  tagline: string;
  summary: string;
  highlights: string[];
  keyMetric: { value: string; label: string };
}

export interface ResearchEngine {
  id: 'hyper-lll' | 'prime_hunter';
  index: string;
  title: string;
  repoUrl: string;
  doi?: string;
  formula: string;
  sceneMode: 1 | 2 | 3;
  scaleLabel: string;
  description: string;
  methodology: string;
}

export interface StackGroup {
  id: string;
  title: string;
  items: string[];
}

export interface ChapterNavItem {
  id: 'top' | 'works' | 'research' | 'about' | 'contact';
  scene: 0 | 1 | 2 | 3 | 4;
  label: string;
}

export const CHAPTERS: ChapterNavItem[] = [
  { id: 'top', scene: 0, label: 'Intro' },
  { id: 'about', scene: 1, label: 'About' },
  { id: 'works', scene: 2, label: 'Works' },
  { id: 'research', scene: 3, label: 'Math Lab' },
  { id: 'contact', scene: 4, label: 'Contact' },
];

export const PROFILE_SEED = {
  handle: 'tetoverse',
  shortHandle: 'teto',
  fullName: 'Hamza Mert Daşdemir',
  location: 'Türkiye',
  website: 'https://iloveteto.com',
  websiteDisplay: 'iloveteto.com',
  githubUrl: 'https://github.com/tetoverse',
  orcidId: '0009-0009-3681-1220',
  orcidUrl: 'https://orcid.org/0009-0009-3681-1220',
  zenodoUrl:
    'https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Hamza%20Mert%20Da%C5%9Fdemir%22&l=list&p=1&s=10&sort=bestmatch',
  discordHandle: 'g37w',
  discordUrl: 'https://discord.com/users/g37w',
  linkedinDisplay: 'in/hamza-mert-daşdemir',
  linkedinUrl: 'https://www.linkedin.com/in/hamza-mert-da%C5%9Fdemir-526834412/',
  tiktokHandle: '@snox.ies',
  tiktokUrl: 'https://tiktok.com/@snox.ies',
  publicRepos: 14,
  joinedYear: 2023,
};

export const PROJECTS_SEED: ProjectItem[] = [
  {
    id: 'Raser',
    repoName: 'Raser',
    title: 'Raser',
    category: 'audio-web',
    language: 'Rust / JS',
    year: '2026',
    stars: 3,
    forks: 2,
    posterKind: 'waveform',
    techStack: ['Rust', 'JavaScript', 'React', 'HTML'],
    repoUrl: 'https://github.com/tetoverse/Raser',
    liveUrl: 'https://app.raserapp.online',
    tagline: 'Fast, lightweight desktop music player for YouTube Music & SoundCloud',
    summary:
      'A native desktop player built with Rust and Tauri that brings YouTube Music and SoundCloud together in one clean, responsive app with a tiny memory footprint.',
    highlights: [
      'Built on Rust and Tauri v2 so it launches instantly and stays light on RAM',
      'Search, play, and organize YouTube Music and SoundCloud tracks in one place',
      'Connects directly to RaserWeb for instant song link sharing across devices',
    ],
    keyMetric: { value: 'Tauri v2', label: 'Native App' },
  },
  {
    id: 'hang-trace',
    repoName: 'hang-trace',
    title: 'hang-trace',
    category: 'dev-tools',
    language: 'TypeScript',
    year: '2026',
    stars: 2,
    forks: 0,
    posterKind: 'trace',
    techStack: ['TypeScript', 'Node.js', 'JavaScript'],
    repoUrl: 'https://github.com/tetoverse/hang-trace',
    tagline: 'Catches stuck async code with the exact file and line number',
    summary:
      'Automatically spots Promises that never finish during development and points you straight to the exact line that caused the hang, while adding zero cost in production.',
    highlights: [
      'Zero external packages and zero runtime cost when shipped to production',
      'Prints the exact source file and line number where an async call got stuck',
      'Available on npm for quick one-line setup in Node.js and TypeScript projects',
    ],
    keyMetric: { value: '0 B', label: 'Prod Cost' },
  },
  {
    id: 'RaserWeb',
    repoName: 'RaserWeb',
    title: 'RaserWeb',
    category: 'audio-web',
    language: 'JavaScript',
    year: '2026',
    stars: 2,
    forks: 0,
    posterKind: 'relay',
    techStack: ['Node.js', 'JavaScript', 'Cloudflare', 'Docker'],
    repoUrl: 'https://github.com/tetoverse/RaserWeb',
    liveUrl: 'https://app.raserapp.online',
    tagline: 'Streaming server, link sharing, and web player for Raser',
    summary:
      'The backend and browser player behind Raser—delivering fast audio playback, shareable track links, and a clean Material You interface right in the browser.',
    highlights: [
      'Fast Node.js streaming backend tuned for instant seeking and smooth playback',
      'Clean web player ready to use directly in any browser without installation',
      'Powers live track sharing and sync with the Raser desktop app at app.raserapp.online',
    ],
    keyMetric: { value: 'Node 18+', label: 'Stream Server' },
  },
];

export const RESEARCH_ENGINES: ResearchEngine[] = [
  {
    id: 'hyper-lll',
    index: '01',
    title: 'hyper-lll',
    repoUrl: 'https://github.com/tetoverse/hyper-lll',
    doi: '10.5281/zenodo.23425304',
    formula: '225 digits  ·  pure Rust  ·  exact integer relations',
    sceneMode: 1,
    scaleLabel: '225-digit precision · Constant discovery',
    description:
      'A pure Rust search engine built to uncover simple, exact equations hidden inside long decimal expansions of mathematical constants.',
    methodology:
      'Represents constants as high-precision integer vectors and compresses them step by step until clean mathematical relationships pop out.',
  },
  {
    id: 'prime_hunter',
    index: '02',
    title: 'prime_hunter',
    repoUrl: 'https://github.com/tetoverse/prime_hunter',
    formula: 'P(n) = an³ + bn² + cn + d  ·  Rayon parallel Rust',
    sceneMode: 3,
    scaleLabel: 'Multi-core Rust · Prime streak search',
    description:
      'A parallel Rust search tool hunting for simple cubic formulas that produce unusually long uninterrupted streaks of prime numbers.',
    methodology:
      'Spreads candidate spaces across all CPU cores with Rayon and skips weak polynomials early using fast modular shortcuts.',
  },
];

export const STACK_GROUPS: StackGroup[] = [
  {
    id: 'core',
    title: 'Languages & Core',
    items: ['Rust', 'TypeScript', 'JavaScript', 'Python', 'LaTeX'],
  },
  {
    id: 'runtime',
    title: 'Web & Apps',
    items: ['Node.js', 'React', 'HTML'],
  },
  {
    id: 'infra',
    title: 'Infrastructure & Tools',
    items: ['Arch Linux', 'Docker', 'PostgreSQL', 'Cloudflare', 'Git', 'GitHub Actions'],
  },
];

export const COPY = {
  hero: {
    kicker: 'tetoverse · Hamza Mert Daşdemir · Türkiye',
    headline: 'Systems, audio, and number theory.',
    lead: 'Websites, Discord bots, automations, and fast systems.',
    primaryCta: 'Explore Works',
    secondaryCta: 'GitHub Profile',
    scrollHint: 'Scroll to explore',
    metrics: [
      { value: '14', label: 'Public Repositories' },
      { value: '225', label: 'Decimal Precision' },
      { value: '0', label: 'hang-trace Dependencies' },
    ],
  },
  works: {
    kicker: '01. Selected Works',
    title: 'Engineering & product showcase',
    subtitle:
      'Hover any poster for spatial depth, or click to inspect highlights, tech stack, and source links.',
    categories: {
      all: 'All',
      math: 'Math Engines',
      'audio-web': 'Audio & Web',
      'dev-tools': 'Dev Tools',
    },
    emptyFilter: 'No projects match this filter.',
    resetFilter: 'Reset Filter',
    prevAria: 'Scroll shelf left',
    nextAria: 'Scroll shelf right',
  },
  modal: {
    highlightsTitle: 'Highlights',
    stackTitle: 'Built With',
    viewRepo: 'Open GitHub Repo',
    viewLive: 'Open Live App',
    viewDoi: 'Zenodo Record',
    prevProject: 'Previous',
    nextProject: 'Next',
    closeAria: 'Close project details',
  },
  research: {
    kicker: '02. Computational Math Lab',
    title: 'Fast search engines in Rust',
    subtitle:
      'Experimental math tools written from scratch in Rust to test big ideas, verify prime patterns, and uncover clean formulas.',
    pause: 'Pause',
    play: 'Play',
    proofLabel: 'Published Profiles',
    methodologyTitle: 'How it works',
  },
  stack: {
    kicker: '03. Technical Stack',
    title: 'Languages, runtimes & tools',
    subtitle: 'Select any technology below to highlight the repositories built with it.',
    clearSelection: 'Clear Selection',
    matchedProjects: 'matched projects',
    allProjectsHint: 'Click any technology to filter matching repositories.',
  },
  about: {
    kicker: '01. About',
    title: 'Hamza Mert Daşdemir',
    bio: "I'm Hamza, an independent full-stack developer and designer from Türkiye. I build custom websites, backend services, Discord bots, and workflow automations—alongside fast Rust tools and computational math projects.",
    bioSecondary:
      'Whether it is crafting a sharp frontend from scratch, wiring up an API and database, automating repetitive work, or shipping a custom Discord bot, I focus on clean interfaces, measurable speed, and software that stays lean and reliable.',
    linksTitle: 'Direct Channels',
    copyDiscord: 'Copy',
    copiedDiscord: 'Copied',
    backToTop: 'Back to Top',
    copyright: '© 2026 Hamza Mert Daşdemir · tetoverse',
  },
} as const;
