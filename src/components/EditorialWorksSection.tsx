import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  COPY,
  type ProjectCategory,
  type ProjectItem,
} from '../data/tetoverseData';
import { generateProjectAsciiPoster } from '../utils/asciiMath';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface EditorialWorksSectionProps {
  projects: ProjectItem[];
  totalCount: number;
  activeCategory: ProjectCategory;
  onSelectCategory: (cat: ProjectCategory) => void;
  onResetFilters: () => void;
  onInspectProject: (project: ProjectItem) => void;
}

const CATEGORIES: ProjectCategory[] = ['all', 'audio-web', 'dev-tools'];

interface CinematicProjectStripProps {
  project: ProjectItem;
  index: number;
  phase: number;
  isHovered: boolean;
  onHoverChange: (id: string | null) => void;
  onInspect: (project: ProjectItem) => void;
}

function CinematicProjectStrip({
  project,
  index,
  phase,
  isHovered,
  onHoverChange,
  onInspect,
}: CinematicProjectStripProps) {
  // Subtle individual phase offset so adjacent strips move organically without clashing
  const stripLines = useMemo(
    () =>
      generateProjectAsciiPoster(
        project.posterKind,
        52,
        13,
        phase + index * 0.65
      ),
    [project.posterKind, phase, index]
  );

  const metaParts: string[] = [
    String(index + 1).padStart(2, '0'),
    project.language,
    `${project.keyMetric.value} ${project.keyMetric.label}`,
  ];
  if (project.stars > 0) {
    metaParts.push(`${project.stars} ★`);
  }
  metaParts.push(project.year);

  return (
    <article
      onMouseEnter={() => onHoverChange(project.id)}
      onMouseLeave={() => onHoverChange(null)}
      className="group relative border-b border-white/10 transition-colors duration-300"
    >
      {/* Subtle atmospheric radial crimson glow on strip hover (compositor opacity only) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-x-6 inset-y-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(ellipse 68% 90% at 80% 50%, rgba(225, 29, 72, 0.11), rgba(225, 29, 72, 0.02) 52%, transparent 78%)',
        }}
      />

      <div className="relative z-10 grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
        {/* Left 7 cols: Monumental Editorial Typography & Clean Unboxed Metadata */}
        <div className="lg:col-span-7">
          {/* Unboxed metadata line — zero pills */}
          <p className="font-mono text-xs tracking-[0.06em] text-zinc-400 tabular-nums">
            {metaParts.map((part, i) => (
              <span key={part}>
                {i > 0 && (
                  <span aria-hidden="true" className="mx-2.5 text-zinc-700">
                    ·
                  </span>
                )}
                <span className={i === 0 ? 'text-[#FDA4AF]' : undefined}>
                  {part}
                </span>
              </span>
            ))}
          </p>

          {/* Giant clickable serif headline opening the full-screen Cinema Modal */}
          <h3 className="mt-4">
            <button
              type="button"
              onClick={() => onInspect(project)}
              onFocus={() => onHoverChange(project.id)}
              onBlur={() => onHoverChange(null)}
              aria-label={`Inspect ${project.title} — ${project.tagline}`}
              className="font-editorial block text-left text-5xl leading-[0.98] tracking-[-0.02em] text-[#F5F5F7] transition-transform duration-300 ease-out hover:translate-x-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60 sm:text-6xl lg:text-[68px]"
            >
              <span
                className={`transition-colors duration-300 ${
                  isHovered
                    ? 'italic text-[#FDA4AF]'
                    : 'text-[#F5F5F7] group-hover:italic group-hover:text-[#FDA4AF]'
                }`}
              >
                {project.title}
              </span>
            </button>
          </h3>

          {/* Concise editorial description */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300/90 sm:text-lg">
            {project.tagline}
          </p>

          {/* Quiet unboxed tech stack colophon */}
          <p className="mt-3.5 font-mono text-xs text-zinc-500">
            {project.techStack.join(' · ')}
          </p>

          {/* Clean understated inline actions — zero heavy buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <button
              type="button"
              onClick={() => onInspect(project)}
              className="inline-flex items-center gap-2 font-medium text-[#F5F5F7] transition-colors duration-200 hover:text-[#FDA4AF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60 whitespace-nowrap"
            >
              <span>Inspect details</span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 transition-colors duration-200 hover:text-[#F5F5F7] whitespace-nowrap"
            >
              <span>GitHub</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 transition-colors duration-200 hover:text-[#FDA4AF] whitespace-nowrap"
              >
                <span>Live app</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Right 5 cols: Unboxed Atmospheric Live ASCII Visual Strip */}
        <div className="lg:col-span-5">
          <button
            type="button"
            onClick={() => onInspect(project)}
            tabIndex={-1}
            aria-hidden="true"
            className="relative flex h-[196px] w-full items-center justify-center overflow-hidden text-left focus:outline-none sm:h-[220px]"
          >
            {/* Feathered mask so the live ASCII scene floats directly inside the editorial strip without a box */}
            <pre
              className={`relative z-10 font-mono text-[9px] leading-[1.16] tracking-[0.04em] select-none transition-all duration-500 sm:text-[10px] ${
                isHovered
                  ? 'scale-[1.03] text-[#F5F5F7]/95'
                  : 'scale-100 text-zinc-400/55 group-hover:scale-[1.03] group-hover:text-[#F5F5F7]/90'
              }`}
              style={{
                maskImage:
                  'radial-gradient(ellipse 84% 86% at 50% 50%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 84% 86% at 50% 50%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 100%)',
              }}
            >
              {stripLines.join('\n')}
            </pre>
          </button>
        </div>
      </div>
    </article>
  );
}

export function EditorialWorksSection({
  projects,
  totalCount,
  activeCategory,
  onSelectCategory,
  onResetFilters,
  onInspectProject,
}: EditorialWorksSectionProps) {
  const { ref: sectionRef, visible } = useScrollReveal<HTMLElement>(0.04);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [phase, setPhase] = useState(0.8);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setPhase((p) => p + 0.11);
    }, 95);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="works"
      aria-labelledby="works-heading"
      className="scroll-mt-6 relative z-10 mx-auto max-w-[1380px] px-6 py-28 sm:px-10 lg:py-36"
    >
      {/* Ultra-minimalist editorial chapter header */}
      <div
        data-visible={visible ? 'true' : 'false'}
        className="reveal-block flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="font-mono text-xs text-[#FDA4AF] tabular-nums">
            02. Selected Works
          </p>
          <h2
            id="works-heading"
            className="font-editorial mt-3 text-balance text-5xl leading-[1.0] text-[#F5F5F7] sm:text-6xl lg:text-7xl"
          >
            Selected <em>works.</em>
          </h2>
        </div>

        {/* Clean single-line underlined category tabs + quiet count */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div
            role="group"
            aria-label="Project categories"
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  aria-pressed={isActive}
                  className={`relative pb-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60 ${
                    isActive
                      ? 'text-[#F5F5F7]'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {COPY.works.categories[category]}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-[1.5px] bg-[#E11D48] transition-transform duration-300 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="border-l border-white/10 pl-6 font-mono text-xs text-zinc-500 tabular-nums whitespace-nowrap">
            {String(projects.length).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Full-Width Individual Cinematic Project Strips */}
      {projects.length > 0 ? (
        <div
          data-testid="editorial-works-list"
          data-visible={visible ? 'true' : 'false'}
          style={{ transitionDelay: '90ms' }}
          className="reveal-block"
        >
          {projects.map((project, idx) => (
            <CinematicProjectStrip
              key={project.id}
              project={project}
              index={idx}
              phase={phase}
              isHovered={hoveredId === project.id}
              onHoverChange={setHoveredId}
              onInspect={onInspectProject}
            />
          ))}
        </div>
      ) : (
        <div className="border-b border-white/10 py-24 text-center">
          <p className="text-base text-zinc-400">{COPY.works.emptyFilter}</p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-6 inline-flex items-center gap-2 border-b border-[#E11D48] pb-1 text-sm font-medium text-[#F5F5F7] transition-colors hover:text-[#FDA4AF]"
          >
            {COPY.works.resetFilter}
          </button>
        </div>
      )}
    </section>
  );
}
