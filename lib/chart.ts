// Small helpers for the hand-built SVG charts. Every chart on the page is
// illustrative product UI, drawn from deterministic series so server and
// client renders match exactly.

export type Pt = { x: number; y: number };

/** Catmull-Rom spline through the points, emitted as cubic Béziers. */
export function smoothPath(pts: Pt[], tension = 0.5): string {
  if (pts.length < 2) return "";
  let d = `M ${r(pts[0].x)} ${r(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;
    d += ` C ${r(c1x)} ${r(c1y)}, ${r(c2x)} ${r(c2y)}, ${r(p2.x)} ${r(p2.y)}`;
  }
  return d;
}

/** Closed band between an upper and lower series. */
export function bandPath(upper: Pt[], lower: Pt[]): string {
  const top = smoothPath(upper);
  const rev = [...lower].reverse();
  const bottom = smoothPath(rev).replace(/^M/, "L");
  return `${top} ${bottom} Z`;
}

export const r = (n: number) => Math.round(n * 100) / 100;

/**
 * Deterministic pseudo-random in [0,1) from an integer seed. Integer-only
 * hashing, so server and browser agree to the last bit (no Math.sin drift).
 */
export function rand(seed: number) {
  let t = (Math.imul(seed | 0, 0x9e3779b1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return Math.round((((t ^ (t >>> 14)) >>> 0) / 4294967296) * 1e4) / 1e4;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Linear interpolation into a series at a fractional index. */
export function sampleAt(values: number[], f: number) {
  const i = Math.max(0, Math.min(values.length - 1, f));
  const lo = Math.floor(i);
  const hi = Math.min(values.length - 1, lo + 1);
  return lerp(values[lo], values[hi], i - lo);
}
