import { ArrowUpRight } from 'lucide-react';
import {
  COPY,
  STACK_GROUPS,
  type ProjectItem,
} from '../data/tetoverseData';
import { countProjectsForTech } from '../utils/portfolioLogic';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface StackMatrixSectionProps {
  projects: ProjectItem[];
  activeTech: string | null;
  onSelectTech: (tech: string | null) => void;
  onOpenProject: (project: ProjectItem) => void;
}

export function StackMatrixSection({
  projects,
  activeTech,
  onSelectTech,
  onOpenProject,
}: StackMatrixSectionProps) {
  const { ref: sectionRef, visible } = useScrollReveal<HTMLElement>(0.1);
  const copy = COPY.stack;
  const matchedProjects = activeTech
    ? projects.filter((p) =>
        p.techStack.some((t) => t.toLowerCase() === activeTech.toLowerCase())
      )
    : [];

  return (
    <section
      ref={sectionRef}
      id="stack"
      aria-labelledby="stack-heading"
      className="scroll-mt-6 relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32"
    >
      <div
        data-visible={visible ? 'true' : 'false'}
        className="reveal-block flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#FDA4AF]">
            {copy.kicker}
          </p>
          <h2
            id="stack-heading"
            className="font-editorial mt-3 text-4xl leading-[1.06] text-[#F5F5F7] sm:text-5xl"
          >
            Languages, runtimes <em>&amp; tools.</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            {copy.subtitle}
          </p>
        </div>

        {activeTech && (
          <button
            type="button"
            onClick={() => onSelectTech(null)}
            className="halftone-btn-ghost self-start px-4 py-2 text-xs md:self-auto whitespace-nowrap shrink-0"
          >
            {copy.clearSelection} ({activeTech})
          </button>
        )}
      </div>

      {/* Sculpted hero-matched obsidian 3-column editorial matrix */}
      <div
        data-visible={visible ? 'true' : 'false'}
        style={{ transitionDelay: '100ms' }}
        className="reveal-block halftone-surface mt-12 overflow-hidden rounded-[28px] px-6 py-8 sm:px-9 sm:py-10"
      >
        <div className="relative z-10 grid gap-10 md:grid-cols-3">
          {STACK_GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className="font-editorial text-2xl text-[#F5F5F7]">
                {group.title}
              </h3>
              <ul className="mt-5 divide-y divide-white/8 border-y border-white/8">
                {group.items.map((tech) => {
                  const count = countProjectsForTech(projects, tech);
                  const selected = activeTech?.toLowerCase() === tech.toLowerCase();
                  return (
                    <li key={tech}>
                      <button
                        type="button"
                        onClick={() => onSelectTech(selected ? null : tech)}
                        aria-pressed={selected}
                        className={`group flex w-full items-center justify-between py-3.5 text-left transition-colors ${
                          selected
                            ? 'text-[#FDA4AF]'
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <span className="text-sm font-medium transition-transform duration-150 group-hover:translate-x-1">
                          {tech}
                        </span>
                        <span
                          className={`font-mono text-xs tabular-nums ${
                            selected ? 'text-[#FDA4AF]' : 'text-zinc-500'
                          }`}
                        >
                          {count > 0 ? String(count).padStart(2, '0') : '—'}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Interactive cross-reference footer bar inside the sculpted frame */}
        <div className="relative z-10 mt-8 border-t border-white/10 pt-6">
          {activeTech ? (
            <div className="modal-content-swap flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-xs text-zinc-400 tabular-nums">
                <span className="text-[#FDA4AF]">{activeTech}</span>
                <span aria-hidden="true"> · </span>
                <span>
                  {matchedProjects.length} {copy.matchedProjects}
                </span>
              </p>
              {matchedProjects.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {matchedProjects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => onOpenProject(project)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#F5F5F7] transition-colors hover:text-[#FDA4AF] whitespace-nowrap shrink-0"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-zinc-400">{copy.allProjectsHint}</p>
          )}
        </div>
      </div>
    </section>
  );
}
