import { useEffect, useState } from 'react';
import { TETOVERSE_ASCII_WORDMARK } from '../utils/asciiMath';

const TOTAL_COLS = TETOVERSE_ASCII_WORDMARK[0]?.length ?? 77;

export function AsciiWordmarkBanner() {
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [ambientCol, setAmbientCol] = useState(0);

  // Subtle ambient sweeping light ribbon across the ASCII wordmark when idle
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setAmbientCol((prev) => (prev + 1) % (TOTAL_COLS + 16));
    }, 65);
    return () => window.clearInterval(id);
  }, []);

  const focalCol = hoverCol !== null ? hoverCol : ambientCol - 8;

  return (
    <div
      onPointerLeave={() => setHoverCol(null)}
      aria-label="TETOVERSE ASCII wordmark"
      className="halftone-surface overflow-x-auto rounded-[28px] px-6 py-9 sm:px-10 sm:py-12"
    >
      <div
        aria-hidden="true"
        className="relative z-10 mx-auto w-fit font-mono text-[7px] leading-[1.16] tracking-[0.04em] select-none sm:text-[10px] md:text-[12px]"
      >
        {TETOVERSE_ASCII_WORDMARK.map((row, rowIndex) => (
          <div key={rowIndex} className="whitespace-pre">
            {Array.from(row).map((char, colIndex) => {
              const dist = Math.abs(colIndex - focalCol);
              const isCore = dist <= 1;
              const isPeak = dist > 1 && dist <= 4;
              const isNear = dist > 4 && dist <= 10;
              const colorClass =
                char === ' '
                  ? 'text-transparent'
                  : isCore
                    ? 'text-[#FDA4AF]'
                    : isPeak
                      ? 'text-[#E11D48]'
                      : isNear
                        ? 'text-white'
                        : 'text-zinc-400/75';

              return (
                <span
                  key={colIndex}
                  onPointerEnter={() => setHoverCol(colIndex)}
                  className={`transition-colors duration-150 ${colorClass}`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
