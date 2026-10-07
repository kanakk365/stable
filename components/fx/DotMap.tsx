"use client";

import { useEffect, useRef } from "react";

import { rand } from "@/lib/chart";

/*
 * DotMap — the contiguous US as a field of survey dots, drawn on a 2D
 * canvas. Three layers share the same dots:
 *   0 "evaluated"  — ringed sites scattered through demand centres
 *   1 "active"     — chargers twinkling, dense around metros
 *   2 "investment" — capital pooling as halos over the biggest markets
 * The parent sets `layer`; the canvas crossfades between them.
 */

// Simplified outline of the contiguous US (lon, lat).
const US: [number, number][] = [
  [-124.7, 48.4], [-123.0, 49.0], [-95.2, 49.0], [-95.2, 49.4], [-89.6, 48.0], [-84.8, 46.5],
  [-83.5, 46.1], [-82.4, 43.0], [-79.0, 43.3], [-76.5, 44.2], [-74.9, 45.0], [-71.5, 45.0],
  [-70.0, 46.7], [-67.8, 47.1], [-67.0, 44.8], [-70.2, 43.6], [-70.6, 42.0], [-71.9, 41.3],
  [-73.9, 40.5], [-74.0, 39.4], [-75.5, 38.5], [-76.0, 37.0], [-75.5, 35.2], [-77.9, 33.9],
  [-79.2, 33.2], [-80.9, 32.0], [-81.4, 30.5], [-80.0, 26.8], [-80.4, 25.2], [-81.8, 26.1],
  [-82.8, 27.9], [-82.7, 29.2], [-84.0, 30.1], [-85.5, 29.7], [-86.5, 30.4], [-88.0, 30.6],
  [-89.6, 30.2], [-89.4, 29.0], [-90.5, 29.1], [-92.0, 29.6], [-93.8, 29.7], [-94.8, 29.3],
  [-96.6, 28.0], [-97.4, 27.3], [-97.2, 25.9], [-99.1, 26.4], [-100.3, 28.2], [-101.4, 29.8],
  [-103.0, 29.0], [-104.5, 29.6], [-106.5, 31.8], [-108.2, 31.8], [-108.2, 31.3], [-111.1, 31.3],
  [-114.8, 32.5], [-117.1, 32.5], [-118.5, 34.0], [-120.6, 34.6], [-121.9, 36.6], [-122.5, 37.8],
  [-123.8, 39.8], [-124.2, 41.9], [-124.5, 43.0], [-123.9, 46.2], [-124.7, 48.4],
];

// Metro weights steer where chargers and capital concentrate.
const METROS: [number, number, number][] = [
  [-118.2, 34.05, 1.0], [-122.4, 37.8, 0.9], [-122.3, 47.6, 0.6], [-122.7, 45.5, 0.45],
  [-112.1, 33.4, 0.55], [-105.0, 39.7, 0.55], [-96.8, 32.8, 0.7], [-95.4, 29.8, 0.65],
  [-97.7, 30.3, 0.5], [-87.6, 41.9, 0.75], [-83.0, 42.3, 0.45], [-84.4, 33.7, 0.6],
  [-80.2, 25.8, 0.6], [-81.4, 28.5, 0.45], [-74.0, 40.7, 1.0], [-71.0, 42.4, 0.65],
  [-77.0, 38.9, 0.7], [-75.2, 40.0, 0.5], [-93.3, 45.0, 0.4], [-111.9, 40.8, 0.35],
  [-115.1, 36.2, 0.4], [-80.8, 35.2, 0.45], [-86.8, 36.2, 0.4], [-90.2, 38.6, 0.35],
  [-94.6, 39.1, 0.35], [-117.2, 32.8, 0.55], [-121.5, 38.6, 0.4],
];

const LON0 = -125.5;
const LON1 = -66.5;
const LAT0 = 24.3;
const LAT1 = 49.6;
const KX = Math.cos((37 * Math.PI) / 180);
export const MAP_ASPECT = ((LON1 - LON0) * KX) / (LAT1 - LAT0);

function inside(lon: number, lat: number) {
  let c = false;
  for (let i = 0, j = US.length - 1; i < US.length; j = i++) {
    const [xi, yi] = US[i];
    const [xj, yj] = US[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

type Dot = { u: number; v: number; w: number; r1: number; r2: number; r3: number };

function buildDots(cols: number): Dot[] {
  const rows = Math.round(cols / MAP_ASPECT);
  const out: Dot[] = [];
  let k = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      k++;
      const u = (i + 0.5) / cols;
      const v = (j + 0.5) / rows;
      const lon = LON0 + u * (LON1 - LON0);
      const lat = LAT1 - v * (LAT1 - LAT0);
      if (!inside(lon, lat)) continue;
      let w = 0;
      for (const [mx, my, mw] of METROS) {
        const dx = (lon - mx) * KX;
        const dy = lat - my;
        w += mw * Math.exp(-(dx * dx + dy * dy) / 5.5);
      }
      out.push({ u, v, w: Math.min(1, w), r1: rand(k), r2: rand(k + 7919), r3: rand(k + 104729) });
    }
  }
  return out;
}

export function DotMap({ layer, className }: { layer: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef(layer);
  layerRef.current = layer;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = buildDots(92);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e?.isIntersecting ?? true));
    io.observe(canvas);

    // Layer mix eases toward the selected layer.
    const mix = [0, 0, 0];
    let intro = reduced ? 1 : 0;
    let introStart = 0;
    const start = performance.now();
    let raf = 0;

    const metroPx = METROS.map(([lon, lat, w]) => ({
      u: (lon - LON0) / (LON1 - LON0),
      v: (LAT1 - lat) / (LAT1 - LAT0),
      w,
    }));

    const draw = () => {
      const t = reduced ? 3 : (performance.now() - start) / 1000;
      for (let i = 0; i < 3; i++) mix[i] += ((i === layerRef.current ? 1 : 0) - mix[i]) * 0.08;
      if (intro < 1) {
        if (!introStart) introStart = performance.now();
        intro = Math.min(1, (performance.now() - introStart) / 1800);
      }

      ctx.clearRect(0, 0, W, H);
      const cell = W / 92;
      const base = Math.max(1.2, cell * 0.24);

      for (const d of dots) {
        const x = d.u * W;
        const y = d.v * H;
        // Sweep the map in from west to east on first view.
        const reveal = Math.min(1, Math.max(0, (intro * 1.4 - d.u) * 4));
        if (reveal <= 0) continue;

        // Base survey dot
        ctx.fillStyle = `rgba(169, 214, 206, ${(0.22 + d.w * 0.2) * reveal})`;
        ctx.beginPath();
        ctx.arc(x, y, base, 0, Math.PI * 2);
        ctx.fill();

        // Layer 1 — active chargers twinkling
        const isCharger = d.r1 < 0.08 + d.w * 0.85;
        if (isCharger && mix[1] > 0.01) {
          const tw = 0.55 + 0.45 * Math.sin(t * (1.2 + d.r2 * 2.4) + d.r3 * 6.28);
          const a = mix[1] * reveal * (0.35 + 0.65 * tw) * (0.5 + d.w * 0.5);
          ctx.fillStyle = `rgba(43, 214, 173, ${a})`;
          ctx.beginPath();
          ctx.arc(x, y, base * (1.15 + d.w * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }

        // Layer 0 — evaluated sites: rings that pulse outward
        if (d.r2 < 0.05 + d.w * 0.35 && mix[0] > 0.01) {
          const ph = (t * 0.45 + d.r3) % 1;
          ctx.strokeStyle = `rgba(43, 214, 173, ${mix[0] * reveal * (1 - ph) * 0.9})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, base + ph * cell * 1.4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(240, 255, 250, ${mix[0] * reveal * 0.9})`;
          ctx.beginPath();
          ctx.arc(x, y, base * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Layer 2 — capital pooling over the largest markets
      if (mix[2] > 0.01) {
        for (const m of metroPx) {
          const x = m.u * W;
          const y = m.v * H;
          const breathe = 1 + 0.08 * Math.sin(t * 1.3 + m.u * 9);
          const r = cell * (2 + m.w * 5.5) * breathe;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `rgba(43, 214, 173, ${0.55 * mix[2] * intro})`);
          g.addColorStop(1, "rgba(43, 214, 173, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(240, 255, 250, ${0.95 * mix[2] * intro})`;
          ctx.beginPath();
          ctx.arc(x, y, base * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
