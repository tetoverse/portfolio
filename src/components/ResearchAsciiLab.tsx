import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import {
  COPY,
  PROFILE_SEED,
  RESEARCH_ENGINES,
  type ResearchEngine,
} from '../data/tetoverseData';
import {
  type AsciiCharsetKey,
  evaluateResearchField,
  sampleGlyph,
} from '../utils/asciiMath';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CHARSET_CYCLE: AsciiCharsetKey[] = ['classic', 'blocks', 'math'];

export function ResearchAsciiLab() {
  const [activeId, setActiveId] = useState<ResearchEngine['id']>('hyper-lll');
  const [paused, setPaused] = useState(false);

  const { ref: sectionRef, visible } = useScrollReveal<HTMLElement>(0.06);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeEngine =
    RESEARCH_ENGINES.find((e) => e.id === activeId) ?? RESEARCH_ENGINES[0];

  const sceneModeRef = useRef<1 | 2 | 3>(activeEngine.sceneMode);
  const pausedRef = useRef(paused);

  sceneModeRef.current = activeEngine.sceneMode;
  pausedRef.current = paused;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let pixelW = 0;
    let pixelH = 0;
    let cols = 0;
    let rows = 0;
    const cellW = 10;
    const cellH = 16;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.max(300, Math.floor(rect.width));
      const nextHeight = Math.max(300, Math.floor(rect.height));
      const nextPixelW = Math.floor(nextWidth * dpr);
      const nextPixelH = Math.floor(nextHeight * dpr);

      if (nextPixelW === pixelW && nextPixelH === pixelH) return;

      width = nextWidth;
      height = nextHeight;
      pixelW = nextPixelW;
      pixelH = nextPixelH;
      canvas.width = pixelW;
      canvas.height = pixelH;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(width / cellW);
      rows = Math.floor(height / cellH);
    };

    resize();

    let resizeRafId = 0;
    const ro = new ResizeObserver(() => {
      if (resizeRafId) window.cancelAnimationFrame(resizeRafId);
      resizeRafId = window.requestAnimationFrame(() => {
        resizeRafId = 0;
        resize();
      });
    });
    ro.observe(container);

    let rafId = 0;
    let lastDraw = 0;
    let simTime = 1.4;
    let cycleClock = 0;
    const cycleDuration = 4.6;

    const draw = (now: number) => {
      if (now - lastDraw >= 45) {
        const dt = lastDraw === 0 ? 0.045 : Math.min(0.12, (now - lastDraw) / 1000);
        lastDraw = now;

        if (!pausedRef.current && !prefersReduced) {
          simTime += 0.055;
          cycleClock += dt;
        }

        const totalCycles = cycleClock / cycleDuration;
        const currIndex = Math.floor(totalCycles) % CHARSET_CYCLE.length;
        const nextIndex = (currIndex + 1) % CHARSET_CYCLE.length;
        const localPhase = totalCycles - Math.floor(totalCycles);
        const sweep = localPhase > 0.76 ? (localPhase - 0.76) / 0.24 : 0;

        const currentCharset = CHARSET_CYCLE[currIndex];
        const nextCharset = CHARSET_CYCLE[nextIndex];
        canvas.dataset.charset = sweep > 0.5 ? nextCharset : currentCharset;

        ctx.fillStyle = '#090709';
        ctx.fillRect(0, 0, width, height);
        ctx.font = '500 12px "JetBrains Mono", monospace';
        ctx.textBaseline = 'top';

        const aspect = width / Math.max(1, height);
        const mode = sceneModeRef.current;

        for (let r = 0; r < rows; r++) {
          const ny = (r / Math.max(1, rows - 1)) * 2 - 1;
          const yPos = r * cellH;
          for (let c = 0; c < cols; c++) {
            const nx = ((c / Math.max(1, cols - 1)) * 2 - 1) * Math.min(aspect, 1.9);
            const intensity = evaluateResearchField(mode, nx, ny, simTime);
            if (intensity < 0.12) continue;

            const colNorm = c / Math.max(1, cols - 1);
            const waveEdge = sweep * 1.18 - Math.sin(r * 0.22) * 0.08;
            const activeCharset =
              sweep > 0 && colNorm < waveEdge ? nextCharset : currentCharset;

            const glyph = sampleGlyph(intensity, activeCharset);
            if (glyph === ' ') continue;

            if (intensity > 0.88) {
              ctx.fillStyle = `rgba(253, 164, 175, ${Math.min(1, intensity + 0.08).toFixed(2)})`;
            } else if (intensity > 0.76) {
              ctx.fillStyle = `rgba(225, 29, 72, ${Math.min(1, intensity + 0.1).toFixed(2)})`;
            } else {
              ctx.fillStyle = `rgba(245, 245, 247, ${(0.16 + intensity * 0.72).toFixed(2)})`;
            }
            ctx.fillText(glyph, c * cellW, yPos);
          }
        }
      }
      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(rafId);
      if (resizeRafId) window.cancelAnimationFrame(resizeRafId);
      ro.disconnect();
    };
  }, []);

  const copy = COPY.research;

  return (
    <section
      ref={sectionRef}
      id="research"
      aria-labelledby="research-heading"
      className="scroll-mt-6 relative z-10 mx-auto max-w-[1380px] px-6 py-28 sm:px-10 lg:py-40"
    >
      {/* Ultra-minimalist Editorial Header — zero heavy card shell */}
      <div
        data-visible={visible ? 'true' : 'false'}
        className="reveal-block flex flex-col gap-10 pb-10 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="font-mono text-xs text-[#FDA4AF] tabular-nums">
            03. Computational Math Lab
          </p>
          <h2
            id="research-heading"
            className="font-editorial mt-3 text-balance text-5xl leading-[1.0] text-[#F5F5F7] sm:text-6xl lg:text-7xl"
          >
            Fast search engines <em>in Rust.</em>
          </h2>
        </div>

        {/* Clean inline engine selector tabs + understated pause control */}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <div
            role="group"
            aria-label="Math engines"
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {RESEARCH_ENGINES.map((engine) => {
              const selected = engine.id === activeEngine.id;
              return (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => setActiveId(engine.id)}
                  aria-pressed={selected}
                  className={`relative pb-2 font-mono text-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60 ${
                    selected
                      ? 'text-[#F5F5F7]'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <span className="mr-1.5 text-zinc-600 tabular-nums">{engine.index}</span>
                  {engine.title}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-[1.5px] bg-[#E11D48] transition-transform duration-300 origin-left ${
                      selected ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? copy.play : copy.pause}
            className="inline-flex items-center gap-1.5 border-l border-white/10 pl-6 pb-2 font-mono text-xs text-zinc-400 transition-colors hover:text-[#F5F5F7] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FDA4AF]/60"
          >
            {paused ? (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.play}</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.pause}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Single-Stage Unboxed Full-Width Live Auto-Sweeping ASCII Canvas */}
      <div
        data-visible={visible ? 'true' : 'false'}
        style={{ transitionDelay: '80ms' }}
        className="reveal-block"
      >
        <div
          ref={containerRef}
          className="relative h-[340px] w-full overflow-hidden border-y border-white/10 bg-[#090709] sm:h-[440px]"
        >
          <canvas
            ref={canvasRef}
            data-testid="research-ascii-canvas"
            data-engine={activeEngine.id}
            data-charset="classic"
            data-paused={String(paused)}
            className="absolute inset-0 block h-full w-full"
          />

          {/* Soft vertical edge fades so the live math field breathes inside the hairlines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#090709]/85 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#090709] to-transparent"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-zinc-400">
            <span className="text-zinc-200">{activeEngine.formula}</span>
            <span className="text-[#FDA4AF]">{activeEngine.scaleLabel}</span>
          </div>
        </div>

        {/* Calm 3-Column Editorial Monograph Colophon */}
        <div
          key={activeEngine.id}
          className="modal-content-swap grid gap-10 pt-10 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <h3 className="font-editorial text-3xl text-[#F5F5F7]">
              {activeEngine.title}
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-300">
              {activeEngine.description}
            </p>
          </div>

          <div className="lg:col-span-4">
            <p className="font-mono text-xs text-[#FDA4AF]">
              {copy.methodologyTitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {activeEngine.methodology}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:col-span-3 lg:items-end lg:text-right">
            <div className="flex flex-col gap-2.5 font-mono text-xs">
              {activeEngine.doi && (
                <a
                  href={`https://doi.org/${activeEngine.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FDA4AF] transition-colors hover:text-white lg:justify-end"
                >
                  <span>DOI {activeEngine.doi}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
              )}
              <a
                href={activeEngine.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-200 transition-colors hover:text-[#FDA4AF] lg:justify-end"
              >
                <span>Source on GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500">
              <a
                href={PROFILE_SEED.orcidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-200"
              >
                ORCID ↗
              </a>
              <span aria-hidden="true" className="text-zinc-700">
                ·
              </span>
              <a
                href={PROFILE_SEED.zenodoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-200"
              >
                Zenodo ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
