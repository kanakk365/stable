"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { bandPath, sampleAt, smoothPath, type Pt } from "@/lib/chart";
import { CANDIDATES, MONTHS, forecastSeries, marketSeries, type Candidate } from "@/lib/hero-data";

/*
 * The hero's product stage: Evaluate's site-forecast view. A dot-matrix map
 * of candidate sites on the left drives the 36-month forecast on the right.
 *
 * Kept deliberately spare: one map layer, one chart, three figures. The
 * panel rises once; afterwards the only change is the selected site, and
 * every part of that change moves on one shared ease-in-out curve.
 */

/** In-place data changes: symmetric ease, so nothing snaps or overshoots. */
const GLIDE = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };
const EASE_CSS = "cubic-bezier(0.65,0,0.35,1)";
const FIRST_CYCLE_MS = 4800;
const CYCLE_MS = 6500;

export function HeroStage() {
  const reduce = useReducedMotion();
  const [sel, setSel] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (pinned || reduce) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const first = setTimeout(() => {
      setSel((v) => (v + 1) % CANDIDATES.length);
      interval = setInterval(() => setSel((v) => (v + 1) % CANDIDATES.length), CYCLE_MS);
    }, FIRST_CYCLE_MS);
    return () => {
      clearTimeout(first);
      if (interval) clearInterval(interval);
    };
  }, [pinned, reduce]);

  const choose = (i: number) => {
    setSel(i);
    setPinned(true);
  };

  return (
    <div className="stage-in relative" style={{ ["--d" as string]: "550ms" }}>
      {/* Soft mint light under the panel */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-10 -bottom-16 top-16 -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_50%_60%,oklch(0.784_0.145_171/0.26),transparent_70%)] blur-2xl"
      />

      <figure className="relative overflow-hidden rounded-[24px] border border-line bg-surface-2 shadow-[var(--shadow-float)]">
        <WindowBar />
        <div className="grid lg:grid-cols-[1.08fr_1fr]">
          <SiteMap selected={sel} onSelect={choose} />
          <ForecastView c={CANDIDATES[sel]} />
        </div>
      </figure>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

function WindowBar() {
  return (
    <div className="flex items-center gap-4 border-b border-line px-4 py-3 sm:px-5">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
      </span>
      <div className="hidden items-center gap-1 text-[0.8rem] sm:flex" aria-hidden="true">
        <span className="rounded-md bg-ink/[0.06] px-2.5 py-1 font-semibold text-ink">Site forecast</span>
        <span className="px-2.5 py-1 text-mute">Portfolio</span>
        <span className="px-2.5 py-1 text-mute">Market</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <span className="data-label hidden md:inline">70+ variables</span>
        <span className="data-label flex items-center gap-2 !text-accent-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Model live
        </span>
      </div>
    </div>
  );
}

/* ---- Map ------------------------------------------------------------- */

const MAP_W = 560;
const MAP_H = 420;
/*
 * A light street map in the manner of a real basemap: land, a bay, a park,
 * a rotated street grid, one diagonal avenue and a highway. Demand reads as
 * a single soft glow that travels to whichever site is selected.
 */
const LAND = "oklch(0.958 0.005 160)";
const STREET = "oklch(0.995 0.002 160)";
const WATER = "oklch(0.905 0.028 225)";
const PARK = "oklch(0.93 0.035 155)";

const GRID_H = Array.from({ length: 20 }, (_, i) => -120 + i * 36);
const GRID_V = Array.from({ length: 20 }, (_, i) => -120 + i * 44);
const AVENUE = "M -40 396 L 600 52";
const HIGHWAY = "M 158 -20 C 176 96, 214 196, 196 300 S 168 400, 176 440";
const BAY = "M 478 -20 C 462 52, 508 104, 494 168 S 522 262, 600 286 L 600 -20 Z";
const PARK_SHAPE = "M 34 298 Q 36 286 48 284 L 124 276 Q 136 275 138 287 L 148 350 Q 150 362 138 364 L 58 374 Q 46 375 44 363 Z";

function SiteMap({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const c = CANDIDATES[selected];
  return (
    <div className="relative hidden border-line sm:block lg:border-r">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="block h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`Map of candidate sites; site ${c.id} selected, forecast utilization ${c.util}%.`}
      >
        <defs>
          <radialGradient id="sel-glow">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={MAP_W} height={MAP_H} fill={LAND} />

        {/* street grid, slightly rotated like a real city plan */}
        <g transform={`rotate(-9 ${MAP_W / 2} ${MAP_H / 2})`} stroke={STREET} strokeWidth="2.6">
          {GRID_H.map((y) => (
            <line key={`h${y}`} x1="-160" x2={MAP_W + 160} y1={y} y2={y} />
          ))}
          {GRID_V.map((x) => (
            <line key={`v${x}`} x1={x} x2={x} y1="-160" y2={MAP_H + 160} />
          ))}
        </g>
        <path d={AVENUE} stroke={STREET} strokeWidth="6" fill="none" />

        {/* highway with a quiet outline and shield */}
        <path d={HIGHWAY} stroke="oklch(0.86 0.04 85)" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d={HIGHWAY} stroke="oklch(0.95 0.035 88)" strokeWidth="7" fill="none" strokeLinecap="round" />
        <g transform="translate(176 236)">
          <rect x="-13" y="-8" width="26" height="16" rx="5" fill="var(--surface-2)" stroke="oklch(0.86 0.04 85)" />
          <text y="4" textAnchor="middle" className="font-mono text-[9px]" fill="var(--ink-2)" fontWeight="700">
            101
          </text>
        </g>

        <path d={BAY} fill={WATER} />
        <path d={PARK_SHAPE} fill={PARK} />

        {/* demand glow follows the selection */}
        <motion.circle
          initial={false}
          animate={{ cx: c.x, cy: c.y }}
          transition={GLIDE}
          r="90"
          fill="url(#sel-glow)"
          className="fade-in"
          style={{ ["--d" as string]: "1600ms" }}
        />

        {CANDIDATES.map((s, i) => {
          const on = i === selected;
          return (
            <g
              key={s.id}
              role="button"
              tabIndex={0}
              aria-label={`Select site ${s.id}, forecast utilization ${s.util}%`}
              aria-pressed={on}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(i))}
              className="fade-in cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-ink"
              style={{ ["--d" as string]: `${1200 + i * 110}ms` }}
            >
              <circle cx={s.x} cy={s.y} r="20" fill="transparent" stroke="transparent" strokeWidth="2" />
              {/* the ring animates its own opacity, so the crossfade lives on a wrapper */}
              <g style={{ opacity: on ? 1 : 0, transition: `opacity 0.9s ${EASE_CSS}` }}>
                <circle cx={s.x} cy={s.y} r="10" fill="var(--accent)" className="pulse-ring" />
              </g>
              <circle
                cx={s.x}
                cy={s.y}
                r={on ? 7 : 5}
                fill={on ? "var(--deep)" : "var(--surface-2)"}
                stroke={on ? "var(--mint)" : "var(--accent)"}
                strokeWidth={on ? 2.5 : 2}
                style={{ transition: `r 0.9s ${EASE_CSS}, fill 0.9s ${EASE_CSS}, stroke 0.9s ${EASE_CSS}` }}
              />
              {/* only the selected site carries a label */}
              <g
                transform={`translate(${s.x + 14} ${s.y - 32})`}
                style={{ opacity: on ? 1 : 0, transition: `opacity 0.9s ${EASE_CSS}` }}
              >
                <rect width="92" height="24" rx="12" fill="var(--deep)" />
                <text x="12" y="16" className="text-[11px]" fill="var(--on-deep)" fontWeight="600">
                  Site {s.id}
                  <tspan fill="var(--mint)" fontWeight="700" className="font-mono">{`  ${s.util.toFixed(0)}%`}</tspan>
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full border border-line bg-surface-2/90 px-3 py-1.5 text-[0.78rem] text-ink-2 backdrop-blur">
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" strokeLinecap="round" />
        </svg>
        1999 Bryant St, San Francisco
      </div>
    </div>
  );
}

/* ---- Forecast -------------------------------------------------------- */

const W = 520;
const H = 220;
const PAD = { l: 34, r: 16, t: 14, b: 26 };
const Y_MAX = 24;
const sx = (m: number) => PAD.l + (m / (MONTHS - 1)) * (W - PAD.l - PAD.r);
const sy = (v: number) => H - PAD.b - (v / Y_MAX) * (H - PAD.t - PAD.b);

const MARKET = marketSeries();
const M_PATH = smoothPath(MARKET.map((v, m) => ({ x: sx(m), y: sy(v) })));
const MARKET_END = MARKET[MONTHS - 1];

function buildPaths(c: Candidate, i: number) {
  const f = forecastSeries(c.util, 0.4 + i * 0.5);
  const line: Pt[] = f.map((v, m) => ({ x: sx(m), y: sy(v) }));
  const up: Pt[] = f.map((v, m) => ({ x: sx(m), y: sy(v + 0.7 + m * 0.08) }));
  const lo: Pt[] = f.map((v, m) => ({ x: sx(m), y: sy(Math.max(0.3, v - 0.7 - m * 0.08)) }));
  const linePath = smoothPath(line);
  return {
    series: f,
    line: linePath,
    band: bandPath(up, lo),
    area: `${linePath} L ${sx(MONTHS - 1)} ${H - PAD.b} L ${sx(0)} ${H - PAD.b} Z`,
  };
}

const PATHS = CANDIDATES.map(buildPaths);

function ForecastView({ c }: { c: Candidate }) {
  const i = CANDIDATES.indexOf(c);
  const p = PATHS[i];
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const m = Math.round(((x - PAD.l) / (W - PAD.l - PAD.r)) * (MONTHS - 1));
    setHover(Math.max(0, Math.min(MONTHS - 1, m)));
  };

  const month = hover ?? MONTHS - 1;
  const v = hover === null ? c.util : sampleAt(p.series, month);
  const bench = hover === null ? MARKET_END : sampleAt(MARKET, month);
  const delta = v - bench;

  return (
    <div className="flex flex-col">
      <div className="px-5 pb-1 pt-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="relative min-w-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.6, ease: GLIDE.ease }}
              >
                <p className="truncate text-[0.98rem] font-semibold text-ink">Site {c.id}</p>
                <p className="text-[0.84rem] text-mute">{c.mix}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="shrink-0 text-right">
            <p className="tabular text-[2.5rem] font-[760] leading-none tracking-[-0.03em] text-ink [font-variation-settings:'wdth'_108]">
              <Ticker value={v} instant={hover !== null} />%
            </p>
            <p className="mt-1 text-[0.78rem] text-mute">
              Utilization ·{" "}
              <span className="tabular text-ink-2">
                {hover === null ? "Year 3" : `Y${Math.floor(month / 12) + 1} M${(month % 12) + 1}`}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.76rem] text-mute">
          <span className="flex items-center gap-2">
            <span className="h-[2px] w-4 rounded bg-accent" /> Forecast
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 border-t-[1.5px] border-dashed border-ink-2/50" /> Market
          </span>
          <span className="tabular ml-auto font-mono text-[0.72rem] font-medium text-accent-ink">
            {delta >= 0 ? "+" : "−"}
            <Ticker value={Math.abs(delta)} instant={hover !== null} /> pts vs. market
          </span>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="mt-3 block w-full touch-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`Forecast utilization for site ${c.id} reaching ${c.util}% by year 3, against a market benchmark of 12.2%.`}
        >
          <defs>
            <linearGradient id="hs-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 12, 24].map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={sy(t)} y2={sy(t)} stroke="var(--line)" strokeDasharray={t === 0 ? undefined : "2 5"} />
              <text x={PAD.l - 8} y={sy(t) + 3.5} textAnchor="end" className="fill-mute font-mono text-[9px]">
                {t}%
              </text>
            </g>
          ))}
          {["Y1", "Y2", "Y3"].map((label, k) => (
            <text key={label} x={sx(k * 12 + 6)} y={H - 7} textAnchor="middle" className="fill-mute font-mono text-[9px]">
              {label}
            </text>
          ))}

          <g className="fade-in" style={{ ["--d" as string]: "2000ms" }}>
            <motion.path initial={false} animate={{ d: p.band }} transition={GLIDE} fill="var(--accent)" fillOpacity="0.08" />
            <motion.path initial={false} animate={{ d: p.area }} transition={GLIDE} fill="url(#hs-area)" />
          </g>
          <path
            d={M_PATH}
            fill="none"
            stroke="var(--ink-2)"
            strokeOpacity="0.45"
            strokeWidth="1.3"
            strokeDasharray="4 4"
            className="fade-in"
            style={{ ["--d" as string]: "1300ms" }}
          />
          <motion.path
            initial={false}
            animate={{ d: p.line }}
            transition={GLIDE}
            pathLength={1}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="draw-in"
            style={{ ["--d" as string]: "1300ms" }}
          />

          {hover !== null ? (
            <g>
              <line x1={sx(month)} x2={sx(month)} y1={PAD.t} y2={H - PAD.b} stroke="var(--accent)" strokeOpacity="0.45" strokeDasharray="3 3" />
              <circle cx={sx(month)} cy={sy(v)} r="4.5" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2.2" />
            </g>
          ) : (
            <g className="fade-in" style={{ ["--d" as string]: "2600ms" }}>
              <motion.g initial={false} animate={{ y: sy(c.util) - sy(CANDIDATES[0].util) }} transition={GLIDE}>
                <circle cx={sx(MONTHS - 1)} cy={sy(CANDIDATES[0].util)} r="4.5" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2.2" />
              </motion.g>
            </g>
          )}
        </svg>
      </div>

      <dl className="fade-in mt-auto grid grid-cols-3 divide-x divide-line border-t border-line" style={{ ["--d" as string]: "2200ms" }}>
        {[
          { k: "Energy, yr 3", v: c.energy, unit: " kWh" },
          { k: "Peak demand", v: c.peak, unit: " kW" },
          { k: "Avg. demand", v: c.avg, unit: " kW" },
        ].map((s) => (
          <div key={s.k} className="min-w-0 px-3 py-4 sm:px-6">
            <dt className="truncate text-[0.74rem] text-mute">{s.k}</dt>
            <dd className="tabular mt-0.5 whitespace-nowrap text-[0.92rem] font-bold tracking-[-0.01em] text-ink sm:text-[1.15rem]">
              <Ticker value={s.v} decimals={0} />
              {s.unit}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Counts a figure to its new value on the shared curve. */
function Ticker({
  value,
  decimals = 1,
  instant = false,
}: {
  value: number;
  decimals?: number;
  instant?: boolean;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const [n, setN] = useState(value);

  useEffect(() => {
    if (reduce || instant) {
      mv.set(value);
      setN(value);
      return;
    }
    const ctl = animate(mv, value, { ...GLIDE, onUpdate: setN });
    return () => ctl.stop();
  }, [value, mv, reduce, instant]);

  return <>{n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}
