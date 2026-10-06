"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { EASE } from "@/components/fx/motion";
import { r, rand, smoothPath } from "@/lib/chart";

/*
 * Product visuals, drawn from the vocabulary of Stable's own interface:
 * a site's charger mix, historical vs. forecast power demand, typical
 * weekday and weekend load, and the summary figures from its demo site.
 * Both share one skeleton (header · chart · three-cell strip) so the two
 * product panels carry identical weight.
 */

const VW = 520;
const VH = 210;

function Shell({
  header,
  chart,
  strip,
}: {
  header: React.ReactNode;
  chart: React.ReactNode;
  strip: { k: string; v: string }[];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-[3.25rem] flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">{header}</div>
      <div className="flex-1 px-3 pt-3 sm:px-4">{chart}</div>
      <dl className="grid grid-cols-3 divide-x divide-line border-t border-line">
        {strip.map((s) => (
          <div key={s.k} className="min-w-0 px-3 py-3.5 sm:px-6">
            <dt className="truncate text-[0.74rem] text-mute">{s.k}</dt>
            <dd className="tabular mt-0.5 whitespace-nowrap text-[0.92rem] font-bold tracking-[-0.01em] text-ink sm:text-[1.15rem]">{s.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Chip({ children, icon }: { children: React.ReactNode; icon: "dc" | "l2" }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 py-1 pl-1.5 pr-3 text-[0.8rem] font-semibold text-ink">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-deep text-mint">
        {icon === "dc" ? (
          <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden="true">
            <path d="M9.2 1 3 9h4.2L6.6 15 13 7H8.8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="4" y="2" width="8" height="12" rx="1.5" />
            <path d="M6.5 6h3" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {children}
    </span>
  );
}

/* =========================================================================
   Evaluate — site demand forecast. History in ink, forecast in green with a
   widening range, revealed left to right.
   ========================================================================= */

const N = 120;
const TODAY = 0.3;
const PX = (t: number) => 34 + t * (VW - 34 - 12);
const PY = (kw: number) => VH - 24 - (kw / 600) * (VH - 36);

const DEMAND = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  const trend = 70 + 330 * (1 / (1 + Math.exp(-(t - 0.42) * 7)));
  const weekly = (rand(i * 17 + 5) - 0.5) * (40 + t * 70);
  const season = Math.sin(t * Math.PI * 10) * 18 * t;
  return r(Math.max(20, trend + weekly + season));
});
const cut = Math.round(TODAY * (N - 1));
const histPts = DEMAND.slice(0, cut + 1).map((v, i) => ({ x: PX(i / (N - 1)), y: PY(v) }));
const fcPts = DEMAND.slice(cut).map((v, j) => ({ x: PX((j + cut) / (N - 1)), y: PY(v) }));
const fcUp = DEMAND.slice(cut).map((v, j) => ({ x: PX((j + cut) / (N - 1)), y: PY(v + 12 + j * 1.2) }));
const fcLo = DEMAND.slice(cut).map((v, j) => ({ x: PX((j + cut) / (N - 1)), y: PY(Math.max(0, v - 12 - j * 1.2)) }));
const HIST = smoothPath(histPts, 0.2);
const FC = smoothPath(fcPts, 0.2);
const BASE = PY(0);
const HIST_AREA = `${HIST} L ${r(PX(TODAY))} ${BASE} L ${PX(0)} ${BASE} Z`;
const FC_AREA = `${FC} L ${PX(1)} ${BASE} L ${r(PX(TODAY))} ${BASE} Z`;
const FC_BAND = `${smoothPath(fcUp, 0.2)} ${smoothPath([...fcLo].reverse(), 0.2).replace(/^M/, "L")} Z`;

export function EvaluateVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const clip = useId().replace(/:/g, "");
  const show = inView || !!reduce;

  return (
    <div ref={ref} className="h-full">
      <Shell
        header={
          <>
            <div className="flex flex-wrap gap-2">
              <Chip icon="dc">4 × 150 kW</Chip>
              <Chip icon="l2">2 × 22 kW</Chip>
            </div>
            <span className="flex items-center gap-4 text-[0.74rem] text-mute">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-ink-2" /> History
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" /> Forecast
              </span>
            </span>
          </>
        }
        chart={
          <svg viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full" role="img" aria-label="Site power demand: two years of history, then a five-year forecast rising with a widening confidence range.">
            <defs>
              <clipPath id={clip}>
                <motion.rect
                  x="0"
                  y="0"
                  height={VH}
                  initial={{ width: reduce ? VW : 0 }}
                  animate={show ? { width: VW } : {}}
                  transition={{ duration: 2.2, ease: EASE, delay: 0.2 }}
                />
              </clipPath>
              <linearGradient id={`${clip}-fc`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {[0, 200, 400, 600].map((kw) => (
              <g key={kw}>
                <line x1="34" x2={VW - 12} y1={PY(kw)} y2={PY(kw)} stroke="var(--line)" strokeDasharray={kw ? "2 4" : undefined} />
                <text x="26" y={PY(kw) + 3.5} textAnchor="end" className="fill-mute font-mono text-[9px]">
                  {kw}
                </text>
              </g>
            ))}
            <text x="34" y="10" className="fill-mute font-mono text-[9px]">kW</text>

            <g clipPath={`url(#${clip})`}>
              <path d={HIST_AREA} fill="var(--ink-2)" fillOpacity="0.12" />
              <path d={HIST} fill="none" stroke="var(--ink-2)" strokeWidth="1.6" strokeOpacity="0.8" />
              <path d={FC_BAND} fill="var(--accent)" fillOpacity="0.14" />
              <path d={FC_AREA} fill={`url(#${clip}-fc)`} />
              <path d={FC} fill="none" stroke="var(--accent)" strokeWidth="2" />
            </g>

            <motion.g initial={{ opacity: reduce ? 1 : 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: 0.9, duration: 0.5 }}>
              <line x1={PX(TODAY)} x2={PX(TODAY)} y1="16" y2={BASE} stroke="var(--ink)" strokeOpacity="0.45" strokeDasharray="3 3" />
              <rect x={PX(TODAY) - 24} y="14" width="48" height="18" rx="9" fill="var(--deep)" />
              <text x={PX(TODAY)} y="26.5" textAnchor="middle" className="font-mono text-[9px]" fill="var(--mint)" fontWeight="700">
                TODAY
              </text>
            </motion.g>

            <text x={PX(0)} y={VH - 6} className="fill-mute font-mono text-[9px]">−2 yrs</text>
            <text x={PX(1)} y={VH - 6} textAnchor="end" className="fill-mute font-mono text-[9px]">+5 yrs</text>
          </svg>
        }
        strip={[
          { k: "Energy, yr 3", v: "57,821 kWh" },
          { k: "Peak demand", v: "429 kW" },
          { k: "Avg. demand", v: "72 kW" },
        ]}
      />
    </div>
  );
}

/* =========================================================================
   Operate — typical weekday and weekend load across 24 hours, with a live
   cursor sweeping the day.
   ========================================================================= */

const H24 = 48;
const LX = (h: number) => 34 + (h / 24) * (VW - 34 - 12);
const LY = (kw: number) => VH - 24 - (kw / 450) * (VH - 36);

const gauss = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s));
const WEEKDAY = Array.from({ length: H24 + 1 }, (_, i) => {
  const h = (i / H24) * 24;
  return r(18 + 210 * gauss(h, 8.5, 1.6) + 250 * gauss(h, 17.8, 2.1) + 90 * gauss(h, 12.5, 2.4) + (rand(i + 11) - 0.5) * 14);
});
const WEEKEND = Array.from({ length: H24 + 1 }, (_, i) => {
  const h = (i / H24) * 24;
  return r(14 + 230 * gauss(h, 13.2, 3.2) + 60 * gauss(h, 19, 1.8) + (rand(i + 71) - 0.5) * 14);
});
const wdPts = WEEKDAY.map((v, i) => ({ x: LX((i / H24) * 24), y: LY(v) }));
const wePts = WEEKEND.map((v, i) => ({ x: LX((i / H24) * 24), y: LY(v) }));
const WD = smoothPath(wdPts, 0.4);
const WE = smoothPath(wePts, 0.4);
const LBASE = LY(0);
const WD_AREA = `${WD} L ${LX(24)} ${LBASE} L ${LX(0)} ${LBASE} Z`;
const WE_AREA = `${WE} L ${LX(24)} ${LBASE} L ${LX(0)} ${LBASE} Z`;

const fmtHour = (h: number) => {
  const hh = Math.floor(h) % 24;
  const mm = Math.floor((h % 1) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export function OperateVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15%" });
  const drawn = useInView(ref, { once: true, margin: "-15%" });
  const [hour, setHour] = useState(17.8);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setHour((h) => (h + ((now - last) / 1000) * 1.6) % 24);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  const idx = (hour / 24) * H24;
  const lo = Math.floor(idx);
  const f = idx - lo;
  const at = (arr: number[]) => arr[lo] + (arr[Math.min(H24, lo + 1)] - arr[lo]) * f;
  const wd = at(WEEKDAY);
  const we = at(WEEKEND);

  return (
    <div ref={ref} className="h-full">
      <Shell
        header={
          <>
            <span className="flex items-center gap-4 text-[0.8rem] font-semibold text-ink">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cobalt" /> Typical weekday
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Typical weekend
              </span>
            </span>
            <span className="data-label flex items-center gap-2 rounded-full border border-line bg-surface-2 px-2.5 py-1 !text-ink">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="tabular">{fmtHour(hour)}</span>
            </span>
          </>
        }
        chart={
          <svg viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full" role="img" aria-label="Typical weekday load peaks in the morning and early evening; typical weekend load peaks around midday.">
            {[0, 150, 300, 450].map((kw) => (
              <g key={kw}>
                <line x1="34" x2={VW - 12} y1={LY(kw)} y2={LY(kw)} stroke="var(--line)" strokeDasharray={kw ? "2 4" : undefined} />
                <text x="26" y={LY(kw) + 3.5} textAnchor="end" className="fill-mute font-mono text-[9px]">
                  {kw}
                </text>
              </g>
            ))}
            <text x="34" y="10" className="fill-mute font-mono text-[9px]">kW</text>
            {[0, 6, 12, 18, 24].map((h) => (
              <text key={h} x={LX(h)} y={VH - 6} textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"} className="fill-mute font-mono text-[9px]">
                {h === 24 ? "24h" : `${String(h).padStart(2, "0")}:00`}
              </text>
            ))}

            {[
              { area: WD_AREA, line: WD, c: "var(--cobalt)", o: 0.1 },
              { area: WE_AREA, line: WE, c: "var(--accent)", o: 0.16 },
            ].map((s, k) => (
              <g key={k}>
                <motion.path
                  d={s.area}
                  fill={s.c}
                  initial={{ opacity: 0 }}
                  animate={drawn ? { opacity: s.o } : {}}
                  transition={{ duration: 1, delay: 0.6 + k * 0.2 }}
                />
                <motion.path
                  d={s.line}
                  fill="none"
                  stroke={s.c}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={drawn ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.8, ease: EASE, delay: 0.2 + k * 0.2 }}
                />
              </g>
            ))}

            <g style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.6s 1.4s" }}>
              <line x1={LX(hour)} x2={LX(hour)} y1="14" y2={LBASE} stroke="var(--ink)" strokeOpacity="0.35" strokeDasharray="3 3" />
              <circle cx={LX(hour)} cy={LY(wd)} r="4.5" fill="var(--surface-2)" stroke="var(--cobalt)" strokeWidth="2.2" />
              <circle cx={LX(hour)} cy={LY(we)} r="4.5" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2.2" />
            </g>
          </svg>
        }
        strip={[
          { k: "Weekday, now", v: `${Math.round(wd)} kW` },
          { k: "Weekend, now", v: `${Math.round(we)} kW` },
          { k: "Avg. demand", v: "72 kW" },
        ]}
      />
    </div>
  );
}
