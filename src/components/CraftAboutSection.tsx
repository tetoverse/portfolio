import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { COPY, PROFILE_SEED } from '../data/tetoverseData';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface CraftAboutSectionProps {
  copiedDiscord: boolean;
  onCopyDiscord: () => void;
}

const CORE_TOOLS = [
  'TypeScript',
  'JavaScript',
  'React',
  'Node.js',
  'Rust',
  'Python',
  'PostgreSQL',
  'Docker',
  'Arch Linux',
];

const DISCIPLINES = [
  {
    index: '01',
    title: 'Websites & Frontend',
    detail:
      'Custom websites, interactive React & TypeScript interfaces, responsive layouts, and motion built with editorial restraint.',
  },
  {
    index: '02',
    title: 'Backend & APIs',
    detail:
      'Fast Node.js and Rust servers, audio streaming backends, REST APIs, databases, and clean self-hosted Docker deployments.',
  },
  {
    index: '03',
    title: 'Discord Bots',
    detail:
      'Custom Discord bots for servers and creators—automation commands, moderation, live integrations, webhooks, and web dashboards.',
  },
  {
    index: '04',
    title: 'Automations & Tooling',
    detail:
      'Workflow scripts, API pipelines, background jobs, and developer utilities that turn repetitive manual work into reliable systems.',
  },
];

export function CraftAboutSection({
  copiedDiscord,
  onCopyDiscord,
}: CraftAboutSectionProps) {
  const { ref: sectionRef, visible } = useScrollReveal<HTMLElement>(0.06);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-6 relative z-10 mx-auto max-w-[1380px] px-6 py-28 sm:px-10 lg:py-36"
    >
      {/* Top Row: Personal Introduction */}
      <div
        data-visible={visible ? 'true' : 'false'}
        className="reveal-block grid gap-12 lg:grid-cols-12 lg:gap-16"
      >
        <div className="lg:col-span-5">
          <p className="font-mono text-xs text-[#FDA4AF] tabular-nums">
            01. About
          </p>
          <h2
            id="about-heading"
            className="font-editorial mt-3 text-balance text-5xl leading-[1.0] text-[#F5F5F7] sm:text-6xl lg:text-7xl"
          >
            Hamza Mert <em>Daşdemir.</em>
          </h2>
          <p className="mt-5 font-mono text-xs text-zinc-500">
            {PROFILE_SEED.handle}
            <span aria-hidden="true" className="mx-2 text-zinc-700">
              ·
            </span>
            Full-Stack Developer
            <span aria-hidden="true" className="mx-2 text-zinc-700">
              ·
            </span>
            {PROFILE_SEED.location}
          </p>
        </div>

        <div className="space-y-6 lg:col-span-7 lg:pt-6">
          <p className="max-w-2xl text-xl leading-[1.52] text-zinc-100 sm:text-2xl">
            {COPY.about.bio}
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-[17px]">
            {COPY.about.bioSecondary}
          </p>
        </div>
      </div>

      {/* Middle Row: What I Build — Unboxed Hairline Editorial Index */}
      <div
        data-visible={visible ? 'true' : 'false'}
        style={{ transitionDelay: '90ms' }}
        className="reveal-block mt-20 border-t border-white/10 pt-12"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-8">
          <p className="font-mono text-xs text-[#FDA4AF]">What I build</p>
          <p className="font-mono text-xs text-zinc-500">
            Open for custom web, bot &amp; automation work
          </p>
        </div>

        <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
          {DISCIPLINES.map((item) => (
            <div
              key={item.index}
              className="border-t border-white/10 pt-6"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-[#FDA4AF] tabular-nums">
                  {item.index}
                </span>
                <h3 className="font-editorial text-3xl text-[#F5F5F7]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 max-w-lg pl-8 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Colophon: Core Stack & Direct Channels */}
      <div
        data-visible={visible ? 'true' : 'false'}
        style={{ transitionDelay: '150ms' }}
        className="reveal-block mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
          <span className="shrink-0 font-mono text-xs text-zinc-500">
            Core stack
          </span>
          <p className="font-mono text-xs leading-relaxed text-zinc-300">
            {CORE_TOOLS.join(' · ')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs">
          <a
            href={PROFILE_SEED.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-200 transition-colors hover:text-[#FDA4AF]"
          >
            <span>{PROFILE_SEED.websiteDisplay}</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <a
            href={PROFILE_SEED.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-200 transition-colors hover:text-[#FDA4AF]"
          >
            <span>GitHub</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={onCopyDiscord}
            className="inline-flex items-center gap-1.5 text-zinc-300 transition-colors hover:text-[#FDA4AF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60"
          >
            {copiedDiscord ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#FDA4AF]" aria-hidden="true" />
                <span className="text-[#FDA4AF]">
                  Discord copied ({PROFILE_SEED.discordHandle})
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Discord · {PROFILE_SEED.discordHandle}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
