"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE } from "@/components/fx/motion";
import { r, rand, smoothPath } from "@/lib/chart";

/* Six small scenes for the Why section, one per reason. Each mounts fresh
   when its reason becomes active, so its entrance plays every time. */

const VW = 420;
const VH = 300;

const draw = (delay = 0, duration = 1.4) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration, ease: EASE, delay },
});

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="block h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/* 1 — Model utilization, ROI and energy costs */
export function ModelScene() {
  const rows = [
    { k: "Utilization", c: "var(--accent)", pts: [12, 16, 22, 30, 38, 44, 52, 58, 61] },
    { k: "ROI", c: "var(--cobalt)", pts: [4, 6, 10, 16, 24, 33, 42, 50, 57] },
    { k: "Energy cost", c: "var(--signal)", pts: [40, 38, 41, 36, 35, 37, 33, 32, 31] },
  ];
  return (
    <Frame label="Three forecast series: utilization, ROI and energy cost.">
      {rows.map((r, i) => {
        const y0 = 30 + i * 90;
        const d = smoothPath(r.pts.map((v, j) => ({ x: 120 + j * 34, y: y0 + 64 - v })));
        return (
          <g key={r.k}>
            <motion.text x="20" y={y0 + 36} className="fill-ink text-[13px] font-semibold" {...pop(i * 0.15)}>
              {r.k}
            </motion.text>
            <line x1="120" x2="400" y1={y0 + 66} y2={y0 + 66} stroke="var(--line)" />
            <motion.path d={d} fill="none" stroke={r.c} strokeWidth="2.6" strokeLinecap="round" {...draw(0.2 + i * 0.2)} />
            <motion.circle cx={120 + 8 * 34} cy={y0 + 64 - r.pts[8]} r="4.5" fill="var(--surface-2)" stroke={r.c} strokeWidth="2.4" {...pop(1.2 + i * 0.2)} />
          </g>
        );
      })}
    </Frame>
  );
}

/* 2 — Forecast accuracy: actuals land inside the forecast band */
export function TargetScene() {
  const f = Array.from({ length: 12 }, (_, i) => r(60 + i * 13 - Math.sin(i * 0.9) * 6));
  const pts = f.map((v, i) => ({ x: 40 + i * 32, y: 260 - v }));
  const up = f.map((v, i) => ({ x: 40 + i * 32, y: 260 - v - 14 - i * 1.5 }));
  const lo = f.map((v, i) => ({ x: 40 + i * 32, y: 260 - v + 14 + i * 1.5 }));
  const band = `${smoothPath(up)} ${smoothPath([...lo].reverse()).replace(/^M/, "L")} Z`;
  return (
    <Frame label="Forecast range with actual results landing inside it.">
      <motion.path d={band} fill="var(--accent)" initial={{ opacity: 0 }} animate={{ opacity: 0.14 }} transition={{ duration: 0.8 }} />
      <motion.path d={smoothPath(pts)} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="5 5" {...draw(0.1, 1.2)} />
      {pts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y + (rand(i + 3) - 0.5) * 16}
          r="5"
          fill="var(--ink)"
          initial={{ opacity: 0, cy: p.y - 60 }}
          animate={{ opacity: 1, cy: p.y + (rand(i + 3) - 0.5) * 16 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.6 + i * 0.09 }}
        />
      ))}
      <motion.g {...pop(1.8)}>
        <rect x="40" y="24" width="190" height="30" rx="15" fill="var(--deep)" />
        <text x="56" y="43.5" className="font-mono text-[11px]" fill="var(--mint)" fontWeight="700">
          Forecast <tspan fill="var(--on-deep)" fontWeight="500">vs. actuals</tspan>
        </text>
      </motion.g>
    </Frame>
  );
}

/* 3 — Live monitoring: a streaming line */
export function PulseScene() {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setT((v) => v + 1), 700);
    return () => clearInterval(id);
  }, [reduce]);
  const N = 16;
  const vals = Array.from({ length: N }, (_, i) => 120 + 50 * Math.sin((i + t) * 0.55) + 30 * (rand(i + t * 3) - 0.5));
  const pts = vals.map((v, i) => ({ x: 30 + i * 24, y: 250 - v }));
  const last = vals[N - 1];
  return (
    <Frame label="A live utilization line updating in real time.">
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1="30" x2="400" y1={70 + k * 60} y2={70 + k * 60} stroke="var(--line)" strokeDasharray="3 5" />
      ))}
      <motion.path
        initial={false}
        animate={{ d: smoothPath(pts) }}
        transition={{ duration: 0.65, ease: "linear" }}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <motion.circle initial={false} animate={{ cy: 250 - last }} transition={{ duration: 0.65 }} cx={30 + (N - 1) * 24} r="10" fill="var(--accent)" className="pulse-ring" />
      <motion.circle initial={false} animate={{ cy: 250 - last }} transition={{ duration: 0.65 }} cx={30 + (N - 1) * 24} r="5" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2.4" />
      <g>
        <rect x="30" y="22" width="112" height="30" rx="15" fill="var(--surface-2)" stroke="var(--line-strong)" />
        <circle cx="48" cy="37" r="4" fill="var(--accent)" className="pulse-dot" />
        <text x="60" y="41.5" className="fill-ink font-mono text-[11px]" fontWeight="700">
          LIVE {(last / 10).toFixed(1)}%
        </text>
      </g>
    </Frame>
  );
}

/* 4 — Independent, investment-grade: a report with a seal */
export function ShieldScene() {
  return (
    <Frame label="An independent forecast report marked investment grade.">
      <motion.g {...pop(0)}>
        <rect x="90" y="24" width="240" height="252" rx="12" fill="var(--surface-2)" stroke="var(--line-strong)" />
        <rect x="112" y="48" width="120" height="10" rx="5" fill="var(--ink)" />
        <rect x="112" y="66" width="170" height="6" rx="3" fill="var(--mist-2)" />
        <rect x="112" y="78" width="150" height="6" rx="3" fill="var(--mist-2)" />
      </motion.g>
      <motion.path d={smoothPath([{ x: 116, y: 180 }, { x: 150, y: 168 }, { x: 186, y: 150 }, { x: 222, y: 146 }, { x: 258, y: 124 }, { x: 304, y: 112 }])} fill="none" stroke="var(--accent)" strokeWidth="2.6" {...draw(0.4)} />
      <line x1="112" x2="308" y1="196" y2="196" stroke="var(--line)" />
      {[0, 1, 2].map((k) => (
        <motion.rect key={k} x="112" y={212 + k * 14} width={[180, 150, 120][k]} height="6" rx="3" fill="var(--mist-2)" {...pop(0.5 + k * 0.1)} />
      ))}
      <motion.g
        initial={{ opacity: 0, scale: 1.6, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={{ duration: 0.7, ease: EASE, delay: 1.1 }}
        style={{ transformOrigin: "318px 226px" }}
      >
        <circle cx="318" cy="226" r="44" fill="var(--deep)" />
        <circle cx="318" cy="226" r="37" fill="none" stroke="var(--mint)" strokeWidth="1.2" strokeDasharray="3 3" />
        <path d="m302 226 11 11 21-23" fill="none" stroke="var(--mint)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </Frame>
  );
}

/* 5 — Connect your own data */
export function LinkScene() {
  const sources = ["CSV", "API", "OCPP"];
  return (
    <Frame label="Your data sources flowing into Stable.">
      {sources.map((s, i) => {
        const y = 70 + i * 80;
        return (
          <g key={s}>
            <motion.g {...pop(i * 0.12)}>
              <rect x="24" y={y - 22} width="92" height="44" rx="12" fill="var(--surface-2)" stroke="var(--line-strong)" />
              <text x="70" y={y + 5} textAnchor="middle" className="fill-ink font-mono text-[12px]" fontWeight="700">
                {s}
              </text>
            </motion.g>
            <motion.path
              d={`M 116 ${y} C 190 ${y}, 200 150, 262 150`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.8"
              strokeDasharray="5 6"
              className="dash-flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.15 }}
            />
          </g>
        );
      })}
      <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.8 }} style={{ transformOrigin: "300px 150px" }}>
        <circle cx="300" cy="150" r="46" fill="var(--accent)" fillOpacity="0.12" />
        <circle cx="300" cy="150" r="34" fill="var(--deep)" />
        <path d="M286 142h28M286 150h22M286 158h16" stroke="var(--mint)" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
      <motion.path d="M 346 150 L 396 150" stroke="var(--accent)" strokeWidth="2" {...draw(1.2, 0.6)} />
      <motion.path d="m388 143 8 7-8 7" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" {...pop(1.6)} />
    </Frame>
  );
}

/* 6 — Partner with Stable experts */
export function PeopleScene() {
  return (
    <Frame label="A Stable analyst sharing a pricing recommendation.">
      <motion.g {...pop(0.1)}>
        <circle cx="54" cy="70" r="22" fill="var(--deep)" />
        <text x="54" y="75" textAnchor="middle" className="text-[13px] font-bold" fill="var(--mint)">
          SA
        </text>
        <rect x="88" y="44" width="300" height="70" rx="16" fill="var(--surface-2)" stroke="var(--line-strong)" />
        <text x="106" y="72" className="fill-ink text-[13px] font-semibold">Pricing guidance · 4 sites</text>
        <text x="106" y="94" className="fill-mute text-[12px]">Time-of-day rates where demand peaks</text>
      </motion.g>
      <motion.g {...pop(0.6)}>
        <rect x="88" y="134" width="300" height="122" rx="16" fill="var(--surface-2)" stroke="var(--line-strong)" />
        {[0.55, 0.8, 0.45, 0.95, 0.7, 0.5].map((h, i) => (
          <motion.rect
            key={i}
            x={110 + i * 44}
            width="26"
            rx="4"
            fill={i === 3 ? "var(--accent)" : "var(--mist-2)"}
            initial={{ height: 0, y: 236 }}
            animate={{ height: h * 80, y: 236 - h * 80 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 + i * 0.07 }}
          />
        ))}
      </motion.g>
    </Frame>
  );
}

export const scenes = [ModelScene, TargetScene, PulseScene, ShieldScene, LinkScene, PeopleScene];
