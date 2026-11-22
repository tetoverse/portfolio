import type { AsciiPosterKind } from '../data/tetoverseData';

export type AsciiCharsetKey = 'classic' | 'blocks' | 'math';

export type BackdropSceneId = 0 | 1 | 2 | 3 | 4;

export const ASCII_CHARSETS: Record<AsciiCharsetKey, string> = {
  classic: ' .:-=+*#%@',
  blocks: ' ·░▒▓█',
  math: ' ·∙÷×±≈≡∑∞',
};

export interface ScrollSceneState {
  primaryScene: BackdropSceneId;
  secondaryScene: BackdropSceneId;
  blend: number;
  label: string;
}

const SCENE_LABELS: Record<BackdropSceneId, string> = {
  0: '01 · Harmonic Torus',
  1: '02 · Acoustic Ribbon',
  2: '03 · Gauss Lemniscate',
  3: '04 · Prime Constellation',
  4: '05 · Horizon Wave',
};

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function sampleGlyph(intensity: number, charset: AsciiCharsetKey = 'classic'): string {
  const ramp = ASCII_CHARSETS[charset];
  const clamped = clamp01(intensity);
  const idx = Math.min(ramp.length - 1, Math.floor(clamped * (ramp.length - 0.0001)));
  return ramp[idx];
}

/**
 * Maps a continuous section index (0.0 -> 4.0 across Hero, Works, Research, Stack, Contact)
 * into a crisp blended state between adjacent procedural ASCII sculptures.
 */
export function getSectionSceneState(sectionPosition: number): ScrollSceneState {
  const clamped = Math.max(0, Math.min(4, Number.isFinite(sectionPosition) ? sectionPosition : 0));
  const baseIdx = Math.min(4, Math.floor(clamped)) as BackdropSceneId;
  const nextIdx = Math.min(4, baseIdx + 1) as BackdropSceneId;
  const local = clamped - baseIdx;
  const blend = baseIdx === 4 ? 0 : smoothstep(0.18, 0.88, local);
  const activeIdx = blend > 0.5 ? nextIdx : baseIdx;

  return {
    primaryScene: baseIdx,
    secondaryScene: nextIdx,
    blend,
    label: SCENE_LABELS[activeIdx],
  };
}

/**
 * Convenience mapper from normalized 0..1 page scroll to the 5-chapter section state.
 */
export function getScrollSceneState(scrollProgress: number): ScrollSceneState {
  return getSectionSceneState(clamp01(scrollProgress) * 4);
}

/**
 * Pure field evaluator for each of the 5 distinct section ASCII scenes.
 * nx, ny are normalized coordinates in [-1, 1] (aspect-corrected).
 */
export function evaluateSceneField(
  scene: BackdropSceneId,
  nx: number,
  ny: number,
  time: number,
  pointerX = 0,
  pointerY = 0
): number {
  const x = nx - pointerX * 0.14;
  const y = ny - pointerY * 0.14;

  switch (scene) {
    case 0: {
      // Chapter 01 (Hero): Sculptural 3D-like Rotating Torus Ring + Harmonic Ripple
      const r = Math.hypot(x * 0.92, y * 1.08);
      const angle = Math.atan2(y, x);
      const ringRadius = 0.56 + 0.09 * Math.sin(angle * 3 + time * 0.85);
      const torusDist = Math.abs(r - ringRadius);
      const torusCore = Math.exp(-torusDist * torusDist * 34);
      const twist = 0.5 + 0.5 * Math.cos(angle * 5 - time * 1.2 + r * 6.5);
      const ripple = 0.5 + 0.5 * Math.sin(r * 11 - time * 1.4 + Math.cos(x * 3.5) * 1.2);
      return clamp01(torusCore * (0.58 + 0.42 * twist) + ripple * 0.24 * Math.exp(-r * 0.82));
    }

    case 1: {
      // Chapter 02 (Works): Flowing Acoustic Ribbon & Stereo Wavefield (Raser + Systems)
      const waveA = Math.sin(x * 3.2 + time * 1.1) * 0.34 + Math.sin(x * 6.4 - time * 0.7) * 0.12;
      const waveB = Math.cos(x * 2.5 - time * 0.9) * 0.28 - 0.18;
      const waveC = Math.sin(x * 4.6 + time * 1.45) * 0.22 + 0.22;
      const ribbonA = Math.exp(-Math.pow(ny - waveA, 2) * 32);
      const ribbonB = Math.exp(-Math.pow(ny - waveB, 2) * 26) * 0.72;
      const ribbonC = Math.exp(-Math.pow(ny - waveC, 2) * 24) * 0.65;
      const pulse = 0.65 + 0.35 * Math.sin(x * 8 - time * 2.2);
      const envelope = Math.exp(-x * x * 0.28);
      return clamp01((ribbonA + ribbonB + ribbonC) * pulse * envelope);
    }

    case 2: {
      // Chapter 03 (Math Lab): Luminous Bernoulli / Gauss Lemniscate + Lattice Grid
      const rot = Math.sin(time * 0.35) * 0.22;
      const rx = x * Math.cos(rot) - y * Math.sin(rot);
      const ry = x * Math.sin(rot) + y * Math.cos(rot);
      const a = 0.68;
      const r2 = rx * rx + ry * ry;
      const implicit = Math.abs(r2 * r2 - 2 * a * a * (rx * rx - ry * ry));
      const curve = Math.exp(-implicit * 20);
      const harmonic = 0.55 + 0.45 * Math.sin(Math.atan2(ry, rx) * 4 - time * 1.6 + r2 * 8);
      const grid =
        Math.pow(1 - Math.abs(Math.sin(rx * 5.2 + time * 0.25)), 10) * 0.25 +
        Math.pow(1 - Math.abs(Math.sin(ry * 5.2 - time * 0.25)), 10) * 0.25;
      const vignette = Math.exp(-r2 * 0.6);
      return clamp01(curve * harmonic + grid * vignette);
    }

    case 3: {
      // Chapter 04 (Stack): Rotating Prime Constellation & Spiral Architecture
      const r = Math.hypot(x, y);
      const theta = Math.atan2(y, x);
      const arms = 0.5 + 0.5 * Math.cos(theta * 5 - r * 11 + time * 1.1);
      const rings = 0.5 + 0.5 * Math.sin(r * 14 - time * 1.35);
      const knots = Math.pow(arms * rings, 2.2);
      const centerGlow = Math.exp(-r * r * 2.4) * 0.45;
      const falloff = Math.exp(-r * r * 0.58);
      return clamp01((knots * 1.15 + centerGlow) * falloff);
    }

    case 4: {
      // Chapter 05 (Contact): Calm Architectural Horizon Scanwaves
      const horizonY = y + 0.08 * Math.sin(x * 2.4 + time * 0.65);
      const band = Math.exp(-horizonY * horizonY * 8.5);
      const scan = 0.5 + 0.5 * Math.sin(y * 18 - time * 1.4 + Math.cos(x * 3) * 1.4);
      const shimmer = 0.55 + 0.45 * Math.cos(x * 4.5 - time * 0.9);
      const fadeX = Math.exp(-x * x * 0.35);
      return clamp01(band * (0.45 + 0.55 * scan) * shimmer * fadeX);
    }
  }
}

export function evaluateBlendedField(
  state: ScrollSceneState,
  nx: number,
  ny: number,
  time: number,
  pointerX = 0,
  pointerY = 0
): number {
  const v1 = evaluateSceneField(state.primaryScene, nx, ny, time, pointerX, pointerY);
  if (state.blend <= 0.001 || state.primaryScene === state.secondaryScene) {
    return v1;
  }
  const v2 = evaluateSceneField(state.secondaryScene, nx, ny, time, pointerX, pointerY);
  return clamp01(v1 * (1 - state.blend) + v2 * state.blend);
}

/**
 * Evaluates a dedicated field for the interactive Research Lab visualizer (modes 1, 2, 3).
 */
export function evaluateResearchField(
  mode: 1 | 2 | 3,
  nx: number,
  ny: number,
  time: number
): number {
  switch (mode) {
    case 1: {
      // LLL Lattice Basis Grid
      const cosA = Math.cos(time * 0.26);
      const sinA = Math.sin(time * 0.26);
      const rx = nx * cosA - ny * sinA;
      const ry = nx * sinA + ny * cosA;
      const shearX = rx + 0.36 * ry;
      const shearY = ry - 0.18 * rx;
      const gx = Math.abs(Math.sin(shearX * 6.2 + time * 0.4));
      const gy = Math.abs(Math.sin(shearY * 6.2 - time * 0.3));
      const lineX = Math.pow(1 - gx, 7);
      const lineY = Math.pow(1 - gy, 7);
      const node = Math.pow(Math.max(0, 1 - Math.hypot(gx, gy) * 1.1), 4);
      const falloff = Math.exp(-(nx * nx + ny * ny) * 0.72);
      return clamp01((lineX * 0.58 + lineY * 0.58 + node * 0.88) * falloff);
    }
    case 2: {
      // Modular Prime Sieve
      const ix = Math.floor((nx + 1.5) * 14);
      const iy = Math.floor((ny + 1.5) * 14);
      const n = Math.abs(ix * 31 + iy * 17 + Math.floor(time * 4));
      const hitMod3 = n % 3 === 0 ? 0.22 : 0;
      const hitMod5 = n % 5 === 0 ? 0.32 : 0;
      const hitMod7 = n % 7 === 0 ? 0.42 : 0;
      const primePulse =
        n % 2 !== 0 && n % 3 !== 0 && n % 5 !== 0 && n % 7 !== 0 ? 0.92 : 0.08;
      const wave = 0.5 + 0.5 * Math.sin(Math.hypot(nx, ny) * 9 - time * 1.4);
      const vignette = Math.exp(-(nx * nx + ny * ny) * 0.65);
      return clamp01(
        (primePulse * 0.65 + (hitMod3 + hitMod5 + hitMod7) * 0.32 + wave * 0.22) * vignette
      );
    }
    case 3: {
      return evaluateSceneField(2, nx, ny, time);
    }
  }
}

/**
 * Generates a deterministic crisp ASCII art frame tailored to each project's domain.
 */
export function generateProjectAsciiPoster(
  kind: AsciiPosterKind,
  cols = 38,
  rows = 12,
  phase = 0
): string[] {
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = '';
    const ny = (r / Math.max(1, rows - 1)) * 2 - 1;
    for (let c = 0; c < cols; c++) {
      const nx = ((c / Math.max(1, cols - 1)) * 2 - 1) * 1.45;
      let val = 0;

      switch (kind) {
        case 'lattice': {
          val = evaluateResearchField(1, nx * 0.85, ny * 0.85, phase + 0.8);
          break;
        }
        case 'waveform': {
          const wave1 = Math.sin(nx * 4.5 + phase) * 0.42;
          const wave2 = Math.sin(nx * 9.0 - phase * 1.3) * 0.18;
          const envelope = Math.exp(-nx * nx * 0.35);
          const dist = Math.abs(ny - (wave1 + wave2) * envelope);
          const bar = Math.abs(ny) < Math.abs(wave1 + wave2) * envelope ? 0.35 : 0;
          val = clamp01(Math.exp(-dist * 12) + bar * (c % 2 === 0 ? 1 : 0.3));
          break;
        }
        case 'trace': {
          const branch = Math.abs(ny - Math.tanh(nx * 1.8) * 0.55);
          const fork = Math.abs(ny + Math.sin(nx * 2.2 + phase) * 0.45);
          const pulse = Math.exp(-Math.pow(nx - Math.sin(phase) * 0.9, 2) * 8);
          val = clamp01(Math.exp(-branch * 14) * 0.75 + Math.exp(-fork * 14) * 0.55 + pulse * 0.25);
          break;
        }
        case 'relay': {
          const d1 = Math.hypot(nx + 0.72, ny);
          const d2 = Math.hypot(nx - 0.72, ny);
          const rings =
            (0.5 + 0.5 * Math.sin(d1 * 12 - phase * 1.5)) * Math.exp(-d1 * 1.4) +
            (0.5 + 0.5 * Math.sin(d2 * 12 - phase * 1.5)) * Math.exp(-d2 * 1.4);
          val = clamp01(rings * 0.95);
          break;
        }
        case 'sieve': {
          val = evaluateResearchField(2, nx * 0.8, ny * 0.8, phase + 1.2);
          break;
        }
        case 'lemniscate': {
          val = evaluateResearchField(3, nx * 0.82, ny * 0.92, phase + 0.4);
          break;
        }
        case 'primes': {
          const dist = Math.hypot(nx, ny);
          const theta = Math.atan2(ny, nx);
          const spiral = Math.abs(Math.sin(dist * 11 - theta * 3 - phase));
          const cubic = Math.exp(-Math.abs(ny - (nx * nx * nx * 0.35 - nx * 0.4)) * 10);
          val = clamp01(Math.pow(spiral, 5) * Math.exp(-dist * 0.7) * 0.75 + cubic * 0.72);
          break;
        }
        case 'native': {
          const frame = Math.max(Math.abs(nx) / 0.85, Math.abs(ny) / 0.78);
          const border = Math.exp(-Math.abs(frame - 0.85) * 18);
          const eq = Math.exp(-Math.abs(ny - Math.sin(nx * 6 + phase) * 0.28) * 12) * (frame < 0.8 ? 1 : 0);
          val = clamp01(border * 0.8 + eq * 0.9);
          break;
        }
        case 'dns': {
          // 3D spinning wireframe domain globe + outbound *.the-dev.xyz DNS routing traces & nodes
          const gx = nx * 1.38;
          const gy = ny * 1.02;
          const R = 0.78;
          const r = Math.hypot(gx, gy);

          let globeVal = 0;
          if (r <= R) {
            const z = Math.sqrt(Math.max(0, R * R - r * r)) / R;
            const lon = Math.atan2(gx / R, z) + phase * 0.48;
            const lat = Math.asin(Math.max(-1, Math.min(1, gy / R)));

            // Rotating longitude meridians & latitude parallels
            const meridians = Math.pow(Math.abs(Math.cos(lon * 4)), 14);
            const parallels = Math.pow(Math.abs(Math.cos(lat * 4)), 14);
            const equator = Math.exp(-Math.abs(lat) * 16) * 0.65;
            const depthShade = 0.32 + 0.68 * z;
            globeVal = (meridians * 0.85 + parallels * 0.75 + equator * 0.5) * depthShade;
          }
          // Crisp spherical rim
          const rim = Math.exp(-Math.abs(r - R) * 18) * 0.9;

          // 4 outbound subdomain endpoint nodes flanking the globe
          const nodes: ReadonlyArray<[number, number]> = [
            [-1.16, -0.52],
            [-1.18, 0.52],
            [1.16, -0.52],
            [1.18, 0.52],
          ];
          let netVal = 0;
          for (let i = 0; i < nodes.length; i++) {
            const [tx, ty] = nodes[i];
            const nd = Math.hypot((nx - tx) * 1.35, ny - ty);
            const beaconPulse = 0.72 + 0.28 * Math.sin(phase * 2.1 + i * 1.6);
            netVal = Math.max(netVal, Math.exp(-nd * 9.5) * 0.95 * beaconPulse);

            // Curved routing link from globe limb to endpoint node
            const sameSide = nx * tx > 0 && Math.abs(nx) >= 0.45 && Math.abs(nx) <= Math.abs(tx);
            if (sameSide) {
              const t = (Math.abs(nx) - 0.45) / Math.max(0.01, Math.abs(tx) - 0.45);
              const curveY = ty * Math.sin(t * Math.PI * 0.5);
              const lineDist = Math.abs(ny - curveY);
              const trace = Math.exp(-lineDist * 22);
              const packet = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(t * 10 - phase * 2.6 + i * 1.3), 4);
              netVal = Math.max(netVal, trace * packet * 0.82);
            }
          }

          val = clamp01(Math.max(globeVal, rim, netVal));
          break;
        }
      }

      line += sampleGlyph(val, kind === 'sieve' || kind === 'primes' ? 'math' : 'classic');
    }
    lines.push(line);
  }
  return lines;
}

export const TETOVERSE_ASCII_WORDMARK = [
  '████████╗███████╗████████╗ ██████╗ ██╗   ██╗███████╗██████╗ ███████╗███████╗',
  '╚══██╔══╝██╔════╝╚══██╔══╝██╔═══██╗██║   ██║██╔════╝██╔══██╗██╔════╝██╔════╝',
  '   ██║   █████╗     ██║   ██║   ██║██║   ██║█████╗  ██████╔╝███████╗█████╗  ',
  '   ██║   ██╔══╝     ██║   ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║██╔══╝  ',
  '   ██║   ███████╗   ██║   ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║███████║███████╗',
  '   ╚═╝   ╚══════╝   ╚═╝    ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝',
];
