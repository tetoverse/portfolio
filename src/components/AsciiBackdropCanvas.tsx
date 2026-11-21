import { useEffect, useRef } from 'react';
import {
  evaluateBlendedField,
  getSectionSceneState,
  sampleGlyph,
} from '../utils/asciiMath';

interface AsciiBackdropCanvasProps {
  sectionPosition: number;
  scrollProgress: number;
}

export function AsciiBackdropCanvas({
  sectionPosition,
  scrollProgress,
}: AsciiBackdropCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionPosRef = useRef(sectionPosition);
  const scrollRef = useRef(scrollProgress);
  const lastScrollRef = useRef(scrollProgress);
  const velocityRef = useRef(0);
  const smoothPosRef = useRef(sectionPosition);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const delta = Math.abs(scrollProgress - lastScrollRef.current);
  if (delta > 0.0005) {
    velocityRef.current = Math.min(0.8, velocityRef.current + delta * 10);
  }
  lastScrollRef.current = scrollProgress;
  sectionPosRef.current = sectionPosition;
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    const cellW = 13;
    const cellH = 20;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cellW);
      rows = Math.ceil(height / cellH);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.targetX = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      pointerRef.current.targetY = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let rafId = 0;
    let lastDraw = 0;
    let simTime = 1.2;
    const frameInterval = 72; // calm, meditative ambient drift

    const drawFrame = (now: number) => {
      if (!prefersReduced && now - lastDraw < frameInterval) {
        rafId = window.requestAnimationFrame(drawFrame);
        return;
      }
      lastDraw = now;

      // Gentle spring-damped section morphing & very slow ambient time flow
      velocityRef.current *= 0.9;
      smoothPosRef.current += (sectionPosRef.current - smoothPosRef.current) * 0.08;
      if (!prefersReduced) {
        simTime += 0.0075 + velocityRef.current * 0.007;
      }

      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.04;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);
      ctx.font = '500 13px "JetBrains Mono", monospace';
      ctx.textBaseline = 'top';

      const aspect = width / Math.max(1, height);
      const sceneState = getSectionSceneState(smoothPosRef.current);

      // Gentle breathing scale & scroll depth parallax
      const scrollParallaxY = (scrollRef.current - 0.5) * 0.34;
      const desktopOffsetX =
        width >= 1024 ? 0.32 * Math.max(0, 1 - smoothPosRef.current * 1.15) : 0;
      const scaleZoom = 1 + velocityRef.current * 0.035;

      for (let r = 0; r < rows; r++) {
        const ny = ((r / Math.max(1, rows - 1)) * 2 - 1) * scaleZoom + scrollParallaxY;
        const yPos = r * cellH;
        for (let c = 0; c < cols; c++) {
          const nx =
            (((c / Math.max(1, cols - 1)) * 2 - 1) * Math.min(aspect, 1.85) -
              desktopOffsetX) *
            scaleZoom;

          const intensity = evaluateBlendedField(
            sceneState,
            nx,
            ny,
            simTime,
            pointerRef.current.x,
            pointerRef.current.y
          );

          if (intensity < 0.12) continue;
          const glyph = sampleGlyph(intensity, 'classic');
          if (glyph === ' ') continue;

          if (intensity > 0.87) {
            ctx.fillStyle = `rgba(253, 164, 175, ${Math.min(0.86, (intensity - 0.16) * 0.96).toFixed(3)})`;
          } else if (intensity > 0.76) {
            ctx.fillStyle = `rgba(225, 29, 72, ${Math.min(0.88, (intensity - 0.22) * 0.98).toFixed(3)})`;
          } else {
            const alpha = 0.13 + intensity * 0.46;
            ctx.fillStyle = `rgba(245, 245, 247, ${alpha.toFixed(3)})`;
          }
          ctx.fillText(glyph, c * cellW, yPos);
        }
      }

      if (!prefersReduced) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    rafId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  const currentSceneState = getSectionSceneState(sectionPosition);
  const activeScene =
    currentSceneState.blend > 0.5
      ? currentSceneState.secondaryScene
      : currentSceneState.primaryScene;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        data-testid="hero-ascii-canvas"
        data-scene={String(activeScene)}
        className="block h-full w-full opacity-95"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#090709]/76 via-[#090709]/44 to-[#090709]/96" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,transparent_16%,rgba(9,7,9,0.84)_88%)]" />
    </div>
  );
}
