import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import { COPY, type ProjectItem } from '../data/tetoverseData';
import { generateProjectAsciiPoster } from '../utils/asciiMath';

interface ProjectCinemaModalProps {
  project: ProjectItem | null;
  totalCount: number;
  currentIndex: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}

export function ProjectCinemaModal({
  project,
  totalCount,
  currentIndex,
  onClose,
  onStep,
}: ProjectCinemaModalProps) {
  const [phase, setPhase] = useState(0.7);
  const copy = COPY.modal;

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onStep(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onStep(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose, onStep]);

  useEffect(() => {
    if (!project) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setPhase((p) => p + 0.14);
    }, 85);
    return () => window.clearInterval(id);
  }, [project]);

  if (!project) return null;

  const widePoster = generateProjectAsciiPoster(project.posterKind, 66, 13, phase);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cinema-modal-title"
      className="modal-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-[#090709]/85 p-4 backdrop-blur-xl sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-sheet-in relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-[28px] border border-white/12 bg-[#0E0A0D] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
        {/* Top cinema ASCII stage banner */}
        <div className="relative flex min-h-[215px] items-center justify-center overflow-hidden border-b border-white/10 bg-[#090709] px-6 py-8">
          <div
            aria-hidden="true"
            className="halftone-dots-scrim pointer-events-none absolute inset-0 opacity-45"
            style={{
              maskImage: 'radial-gradient(circle at 80% 20%, rgba(0,0,0,0.9), transparent 66%)',
              WebkitMaskImage:
                'radial-gradient(circle at 80% 20%, rgba(0,0,0,0.9), transparent 66%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(225,29,72,0.2),transparent_60%)]"
          />

          <pre
            aria-hidden="true"
            className="relative z-10 overflow-hidden font-mono text-[9px] leading-[1.2] tracking-[0.06em] text-zinc-200/88 select-none sm:text-[11px]"
          >
            {widePoster.join('\n')}
          </pre>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0E0A0D] via-transparent to-[#090709]/45"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeAria}
            className="halftone-btn-ghost absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-wrap items-baseline justify-between gap-4">
            <div className="font-mono text-xs text-zinc-400 tabular-nums">
              <span className="text-zinc-200">{project.language}</span>
              <span aria-hidden="true"> · </span>
              <span>{project.year}</span>
              {project.stars > 0 && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span>{project.stars} ★</span>
                </>
              )}
              {project.doi && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="text-[#FDA4AF]">DOI {project.doi}</span>
                </>
              )}
            </div>
            <div className="font-mono text-xs text-zinc-400 tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Body content with smooth crossfade on project step */}
        <div key={project.id} className="modal-content-swap px-6 py-7 sm:px-9 sm:py-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <h2
                id="cinema-modal-title"
                className="font-editorial text-3xl leading-[1.08] text-[#F5F5F7] sm:text-4xl"
              >
                {project.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-300">
                {project.summary}
              </p>
            </div>

            <div className="shrink-0 md:text-right">
              <div className="font-mono text-2xl font-semibold text-[#FDA4AF] tabular-nums">
                {project.keyMetric.value}
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                {project.keyMetric.label}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 border-t border-white/10 pt-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="font-mono text-xs tracking-[0.12em] uppercase text-[#FDA4AF]">
                {copy.highlightsTitle}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-300">
                {project.highlights.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="font-mono text-[#E11D48]">
                      —
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs tracking-[0.12em] uppercase text-[#FDA4AF]">
                {copy.stackTitle}
              </h3>
              <p className="mt-4 font-mono text-xs leading-loose text-zinc-300">
                {project.techStack.join(' · ')}
              </p>
            </div>
          </div>

          {/* Actions & Apple TV remote-style stepping */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="halftone-btn-primary px-5 py-2.5 text-sm whitespace-nowrap shrink-0"
              >
                <span>{copy.viewRepo}</span>
                <ExternalLink className="btn-arrow h-4 w-4" aria-hidden="true" />
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="halftone-btn-ghost px-4 py-2.5 text-sm whitespace-nowrap shrink-0"
                >
                  <span>{copy.viewLive}</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}

              {project.doi && (
                <a
                  href={`https://doi.org/${project.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="halftone-btn-ghost px-4 py-2.5 text-sm whitespace-nowrap shrink-0"
                >
                  <span>{copy.viewDoi}</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>

            {totalCount > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onStep(-1)}
                  className="halftone-btn-ghost px-4 py-2 text-xs whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.prevProject}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onStep(1)}
                  className="halftone-btn-ghost px-4 py-2 text-xs whitespace-nowrap shrink-0"
                >
                  <span>{copy.nextProject}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
