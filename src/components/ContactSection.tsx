import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { PROFILE_SEED } from '../data/tetoverseData';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ContactSectionProps {
  copiedDiscord: boolean;
  onCopyDiscord: () => void;
}

interface ContactLinkItem {
  label: string;
  href: string;
}

interface ContactChannel {
  index: string;
  label: string;
  value?: string;
  href?: string;
  links?: ContactLinkItem[];
  action?: 'copy-discord';
}

const CONTACT_CHANNELS: ContactChannel[] = [
  {
    index: '01',
    label: 'Email',
    value: PROFILE_SEED.email,
    href: `mailto:${PROFILE_SEED.email}`,
  },
  {
    index: '02',
    label: 'Discord',
    value: PROFILE_SEED.discordHandle,
    action: 'copy-discord',
  },
  {
    index: '03',
    label: 'GitHub',
    value: 'github.com/tetoverse',
    href: PROFILE_SEED.githubUrl,
  },
  {
    index: '04',
    label: 'LinkedIn',
    value: PROFILE_SEED.linkedinDisplay,
    href: PROFILE_SEED.linkedinUrl,
  },
  {
    index: '05',
    label: 'Websites',
    links: [
      { label: 'iloveteto.com', href: 'https://iloveteto.com' },
      { label: 'pirishop.store', href: 'https://pirishop.store' },
      { label: 'tetoverse.is-a.dev', href: 'https://tetoverse.is-a.dev' },
      { label: 'tetoverse.the-dev.xyz', href: 'https://tetoverse.the-dev.xyz/' },
      { label: 'raseplus.com', href: 'https://raseplus.com' },
      { label: 'app.raserapp.online', href: 'https://app.raserapp.online' },
    ],
  },
  {
    index: '06',
    label: 'TikTok',
    value: PROFILE_SEED.tiktokHandle,
    href: PROFILE_SEED.tiktokUrl,
  },
  {
    index: '07',
    label: 'ORCID',
    value: PROFILE_SEED.orcidId,
    href: PROFILE_SEED.orcidUrl,
  },
];

export function ContactSection({
  copiedDiscord,
  onCopyDiscord,
}: ContactSectionProps) {
  const { ref: sectionRef, visible } = useScrollReveal<HTMLElement>(0.08);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-6 relative z-10 mx-auto max-w-[1380px] px-6 pt-28 pb-14 sm:px-10 lg:pt-36 lg:pb-20"
    >
      <div
        data-visible={visible ? 'true' : 'false'}
        className="reveal-block grid gap-14 border-t border-white/10 pt-16 lg:grid-cols-12 lg:gap-16 lg:pt-20"
      >
        {/* Left 5 cols: Editorial Heading & Short Availability Note */}
        <div className="flex flex-col justify-between gap-8 lg:col-span-5">
          <div>
            <p className="font-mono text-xs text-[#FDA4AF] tabular-nums">
              04. Contact
            </p>
            <h2
              id="contact-heading"
              className="font-editorial mt-3 text-balance text-5xl leading-[1.0] text-[#F5F5F7] sm:text-6xl lg:text-7xl"
            >
              Get in <em>touch.</em>
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-zinc-400">
              Available for custom websites, Discord bots, workflow automations,
              and full-stack projects. Reach out directly on any channel.
            </p>
          </div>
        </div>

        {/* Right 7 cols: Full-Span Unboxed Editorial Contact Ledger */}
        <div className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7">
          {CONTACT_CHANNELS.map((channel) => {
            if (channel.action === 'copy-discord') {
              return (
                <button
                  key={channel.index}
                  type="button"
                  onClick={onCopyDiscord}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60 sm:py-6"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-xs text-zinc-600 tabular-nums transition-colors group-hover:text-[#FDA4AF]">
                      {channel.index}
                    </span>
                    <span className="font-editorial text-2xl text-[#F5F5F7] transition-all duration-200 group-hover:translate-x-1.5 group-hover:italic group-hover:text-[#FDA4AF] sm:text-3xl">
                      {channel.label}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-2.5 font-mono text-xs text-zinc-400 transition-colors group-hover:text-[#F5F5F7] sm:text-sm">
                    {copiedDiscord ? (
                      <>
                        <span className="text-[#FDA4AF]">Copied {channel.value}</span>
                        <Check className="h-4 w-4 text-[#FDA4AF]" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        <span>{channel.value}</span>
                        <Copy className="h-3.5 w-3.5 text-zinc-500 transition-colors group-hover:text-[#FDA4AF]" aria-hidden="true" />
                      </>
                    )}
                  </span>
                </button>
              );
            }

            if (channel.links) {
              return (
                <div
                  key={channel.index}
                  className="group flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-start sm:gap-8 sm:py-6"
                >
                  <div className="flex shrink-0 items-baseline gap-5">
                    <span className="font-mono text-xs text-zinc-600 tabular-nums transition-colors group-hover:text-[#FDA4AF]">
                      {channel.index}
                    </span>
                    <span className="font-editorial text-2xl text-[#F5F5F7] transition-colors duration-200 group-hover:italic group-hover:text-[#FDA4AF] sm:text-3xl">
                      {channel.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pl-9 font-mono text-xs sm:justify-end sm:pl-0 sm:pt-1.5 sm:text-[13px]">
                    {channel.links.map((site) => (
                      <a
                        key={site.label}
                        href={site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/site inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-[#FDA4AF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60 whitespace-nowrap"
                      >
                        <span>{site.label}</span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-zinc-600 transition-transform duration-200 group-hover/site:translate-x-0.5 group-hover/site:-translate-y-0.5 group-hover/site:text-[#FDA4AF]"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            const isExternal = Boolean(channel.href && !channel.href.startsWith('mailto:'));

            return (
              <a
                key={channel.index}
                href={channel.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60 sm:py-6"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-xs text-zinc-600 tabular-nums transition-colors group-hover:text-[#FDA4AF]">
                    {channel.index}
                  </span>
                  <span className="font-editorial text-2xl text-[#F5F5F7] transition-all duration-200 group-hover:translate-x-1.5 group-hover:italic group-hover:text-[#FDA4AF] sm:text-3xl">
                    {channel.label}
                  </span>
                </div>

                <span className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 transition-colors group-hover:text-[#F5F5F7] sm:text-sm">
                  <span>{channel.value}</span>
                  <ArrowUpRight
                    className="h-4 w-4 text-zinc-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FDA4AF]"
                    aria-hidden="true"
                  />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
