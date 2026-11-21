import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectItem } from '../data/tetoverseData';
import { generateProjectAsciiPoster } from '../utils/asciiMath';

interface AppleTvProjectCardProps {
  project: ProjectItem;
  isHighlighted?: boolean;
  onSelect: (project: ProjectItem) => void;
}

export function AppleTvProjectCard({
  project,
  isHighlighted = false,
  onSelect,
}: AppleTvProjectCardProps) {
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });
  const [phase, setPhase] = useState(0.7);

  // Live animated ASCII artwork when hovered or keyboard-focused
  useEffect(() => {
    if (!tilt.active) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setPhase((p) => p + 0.16);
    }, 80);
    return () => window.clearInterval(id);
  }, [tilt.active]);

  const posterLines = useMemo(
    () => generateProjectAsciiPoster(project.posterKind, 42, 13, phase),
    [project.posterKind, phase]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / Math.max(1, rect.width);
    const py = (e.clientY - rect.top) / Math.max(1, rect.height);
    const rx = (0.5 - py) * 11;
    const ry = (px - 0.5) * 12;
    setTilt({ rx, ry, active: true });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, active: false });
  };

  const starsMeta =
    project.stars > 0 ? `${project.stars} ★` : project.keyMetric.value;

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onSelect(project)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setTilt((prev) => ({ ...prev, active: true }))}
      onBlur={handlePointerLeave}
      aria-label={`${project.title} — ${project.tagline}`}
      style={{
        transform: tilt.active
          ? `perspective(950px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translate3d(0, -4px, 0) scale(1.035)`
          : 'perspective(950px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)',
      }}
      className={`apple-tv-card group relative flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border text-left backdrop-blur-md hover:z-20 focus-visible:z-20 sm:w-[376px] ${
        isHighlighted
          ? 'border-[#FDA4AF]/60 bg-[#150E12]/92'
          : 'border-white/10 bg-[#0E0A0D]/90 hover:border-[#FDA4AF]/35'
      }`}
    >
      {/* 16:10 Cinema ASCII Poster Frame */}
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#090709] px-4 py-4">
        {/* Whisper-subtle radial halftone corner glow echoing the hero shader */}
        <div
          aria-hidden="true"
          className="halftone-dots-scrim pointer-events-none absolute inset-0 opacity-35 transition-opacity duration-300 group-hover:opacity-60"
          style={{
            maskImage: 'radial-gradient(circle at 82% 18%, rgba(0,0,0,0.85), transparent 65%)',
            WebkitMaskImage:
              'radial-gradient(circle at 82% 18%, rgba(0,0,0,0.85), transparent 65%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(225,29,72,0.16),transparent_58%)]"
        />

        <pre
          aria-hidden="true"
          style={{
            transform: tilt.active
              ? `translate3d(${(tilt.ry * -0.75).toFixed(1)}px, ${(tilt.rx * 0.75).toFixed(1)}px, 0) scale(1.03)`
              : 'translate3d(0,0,0) scale(1)',
          }}
          className="relative z-10 font-mono text-[10px] leading-[1.22] tracking-[0.04em] text-zinc-200/85 transition-transform duration-200 select-none group-hover:text-white sm:text-[11px]"
        >
          {posterLines.join('\n')}
        </pre>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0E0A0D] via-transparent to-[#090709]/35"
        />

        <div
          style={{
            transform: tilt.active
              ? `translate3d(${(tilt.ry * 0.35).toFixed(1)}px, ${(tilt.rx * -0.25).toFixed(1)}px, 0)`
              : 'translate3d(0,0,0)',
          }}
          className="pointer-events-none absolute bottom-3 left-5 right-5 z-20 flex items-baseline justify-between transition-transform duration-200"
        >
          <span className="font-mono text-xs font-medium tracking-wide text-[#FDA4AF] tabular-nums">
            {project.keyMetric.value}
          </span>
          <span className="text-xs text-zinc-400">
            {project.keyMetric.label}
          </span>
        </div>
      </div>

      {/* Clean unboxed editorial metadata & serif title */}
      <div className="flex flex-1 flex-col justify-between px-6 pt-4 pb-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-editorial text-[22px] leading-snug text-[#F5F5F7] transition-colors group-hover:text-white">
              {project.title}
            </h3>
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-all duration-200 group-hover:border-[#FDA4AF]/40 group-hover:bg-[#F5F5F7] group-hover:text-[#090709]">
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {project.tagline}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-white/8 pt-3.5 font-mono text-xs text-zinc-400 tabular-nums">
          <span className="text-zinc-300">{project.language}</span>
          <span aria-hidden="true" className="text-zinc-600">
            ·
          </span>
          <span>{project.year}</span>
          <span aria-hidden="true" className="text-zinc-600">
            ·
          </span>
          <span>{starsMeta}</span>
        </div>
      </div>
    </button>
  );
}
