import * as React from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface Ripple {
  id: number
  x: number
  y: number
}

const IHB_CSS = `
@property --ihb-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes ihb-orbit {
  from { --ihb-angle: 0deg; }
  to { --ihb-angle: 360deg; }
}

@keyframes ihb-shimmer {
  0% { transform: translateX(-140%) skewX(-22deg); }
  100% { transform: translateX(260%) skewX(-22deg); }
}

@keyframes ihb-ripple {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

.ihb-btn {
  --ihb-angle: 0deg;
  --ihb-mx: 50%;
  --ihb-my: 50%;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.5px;
  border-radius: 9999px;
  cursor: pointer;
  isolation: isolate;
  background: conic-gradient(
    from var(--ihb-angle),
    rgba(255, 255, 255, 0.14) 0deg,
    rgba(255, 255, 255, 0.14) 220deg,
    rgba(253, 164, 175, 0.75) 285deg,
    rgba(225, 29, 72, 0.98) 325deg,
    rgba(255, 255, 255, 0.85) 352deg,
    rgba(255, 255, 255, 0.14) 360deg
  );
  animation: ihb-orbit 4.2s linear infinite;
  box-shadow:
    0 16px 38px -14px rgba(0, 0, 0, 0.8),
    0 0 26px -10px rgba(225, 29, 72, 0.4);
  transition:
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 340ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ihb-btn:hover {
  animation-duration: 2.1s;
  box-shadow:
    0 20px 44px -14px rgba(0, 0, 0, 0.92),
    0 0 42px -6px rgba(225, 29, 72, 0.62),
    0 0 18px -6px rgba(253, 164, 175, 0.42);
}

.ihb-btn:active {
  transform: scale(0.97) !important;
}

.ihb-btn:focus-visible {
  outline: 2px solid #fda4af;
  outline-offset: 4px;
}

.ihb-shell {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  height: 52px;
  padding: 0 7px 0 26px;
  border-radius: 9999px;
  overflow: hidden;
  background: rgba(11, 7, 10, 0.9);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #f5f5f7;
  transition: background-color 300ms ease;
}

.ihb-btn:hover .ihb-shell {
  background: #090709;
}

.ihb-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    130px circle at var(--ihb-mx) var(--ihb-my),
    rgba(225, 29, 72, 0.34),
    rgba(253, 164, 175, 0.12) 45%,
    transparent 76%
  );
  transition: opacity 260ms ease;
}

.ihb-btn:hover .ihb-spotlight {
  opacity: 1;
}

.ihb-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.16;
  background-image: radial-gradient(rgba(253, 164, 175, 0.7) 1px, transparent 1px);
  background-size: 7px 7px;
  mask-image: linear-gradient(90deg, transparent 10%, rgba(0, 0, 0, 0.9) 60%, rgba(0, 0, 0, 1) 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 10%, rgba(0, 0, 0, 0.9) 60%, rgba(0, 0, 0, 1) 100%);
  transition: opacity 320ms ease;
}

.ihb-btn:hover .ihb-dots {
  opacity: 0.32;
}

.ihb-sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 44%;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.16),
    transparent
  );
  transform: translateX(-140%) skewX(-22deg);
}

.ihb-btn:hover .ihb-sheen {
  animation: ihb-shimmer 0.85s cubic-bezier(0.22, 1, 0.36, 1) 1;
}

.ihb-label-window {
  position: relative;
  z-index: 2;
  display: inline-grid;
  overflow: hidden;
  line-height: 1.15;
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: 0.015em;
}

.ihb-label-top,
.ihb-label-bot {
  grid-area: 1 / 1;
  display: inline-block;
  white-space: nowrap;
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 260ms ease;
}

.ihb-label-top {
  color: #f5f5f7;
  transform: translateY(0%);
  opacity: 1;
}

.ihb-label-bot {
  color: #ffffff;
  transform: translateY(120%);
  opacity: 0;
}

.ihb-btn:hover .ihb-label-top {
  transform: translateY(-120%);
  opacity: 0;
}

.ihb-btn:hover .ihb-label-bot {
  transform: translateY(0%);
  opacity: 1;
}

.ihb-orb {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #f5f5f7;
  transition:
    background-color 320ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 320ms ease,
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 320ms ease;
}

.ihb-btn:hover .ihb-orb {
  background: #e11d48;
  border-color: rgba(253, 164, 175, 0.55);
  color: #ffffff;
  transform: scale(1.06);
  box-shadow: 0 0 22px -2px rgba(225, 29, 72, 0.8);
}

.ihb-arrow-primary,
.ihb-arrow-secondary {
  position: absolute;
  width: 16px;
  height: 16px;
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 240ms ease;
}

.ihb-arrow-primary {
  transform: translateX(0px);
  opacity: 1;
}

.ihb-arrow-secondary {
  transform: translateX(-26px);
  opacity: 0;
}

.ihb-btn:hover .ihb-arrow-primary {
  transform: translateX(26px);
  opacity: 0;
}

.ihb-btn:hover .ihb-arrow-secondary {
  transform: translateX(0px);
  opacity: 1;
}

.ihb-ripple {
  position: absolute;
  z-index: 1;
  width: 240px;
  height: 240px;
  border-radius: 9999px;
  pointer-events: none;
  border: 1.5px solid rgba(253, 164, 175, 0.75);
  background: radial-gradient(circle, rgba(225, 29, 72, 0.35), transparent 68%);
  animation: ihb-ripple 620ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .ihb-btn {
    animation: none;
  }
  .ihb-btn,
  .ihb-label-top,
  .ihb-label-bot,
  .ihb-orb,
  .ihb-arrow-primary,
  .ihb-arrow-secondary,
  .ihb-sheen {
    transition: none;
    animation: none;
  }
}
`

export function InteractiveHoverButton({
  children,
  className,
  onClick,
  onPointerMove,
  onPointerLeave,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const btnRef = React.useRef<HTMLButtonElement | null>(null)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [ripples, setRipples] = React.useState<Ripple[]>([])

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = btnRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      const rx = e.clientX - rect.left
      const ry = e.clientY - rect.top
      el.style.setProperty("--ihb-mx", `${rx.toFixed(1)}px`)
      el.style.setProperty("--ihb-my", `${ry.toFixed(1)}px`)

      const nx = (rx / rect.width - 0.5) * 2
      const ny = (ry / rect.height - 0.5) * 2
      setOffset({ x: nx * 7, y: ny * 4.5 })
    }
    onPointerMove?.(e)
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    setOffset({ x: 0, y: 0 })
    onPointerLeave?.(e)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      const id = Date.now() + Math.random()
      const x = e.clientX > 0 ? e.clientX - rect.left : rect.width / 2
      const y = e.clientY > 0 ? e.clientY - rect.top : rect.height / 2
      setRipples((prev) => [...prev.slice(-2), { id, x, y }])
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 650)
    }
    onClick?.(e)
  }

  return (
    <>
      <style>{IHB_CSS}</style>
      <button
        ref={btnRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        style={{
          ...style,
          transform:
            offset.x !== 0 || offset.y !== 0
              ? `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`
              : undefined,
        }}
        className={cn("ihb-btn", className)}
        {...props}
      >
        <span className="ihb-shell">
          <span className="ihb-spotlight" aria-hidden="true" />
          <span className="ihb-dots" aria-hidden="true" />
          <span className="ihb-sheen" aria-hidden="true" />
          {ripples.map((r) => (
            <span
              key={r.id}
              aria-hidden="true"
              className="ihb-ripple"
              style={{ left: `${r.x}px`, top: `${r.y}px` }}
            />
          ))}

          <span className="ihb-label-window">
            <span className="ihb-label-top">{children}</span>
            <span className="ihb-label-bot" aria-hidden="true">
              {children}
            </span>
          </span>

          <span className="ihb-orb" aria-hidden="true">
            <ArrowRight className="ihb-arrow-primary" />
            <ArrowRight className="ihb-arrow-secondary" />
          </span>
        </span>
      </button>
    </>
  )
}
