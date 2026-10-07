"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

import { EASE, Reveal, SplitHeadline } from "@/components/fx/motion";
import { ArrowUpRight } from "@/components/ui/icons";
import { insights } from "@/lib/content";
import { smoothPath } from "@/lib/chart";

/* Utilization series read off Stable's published Utilization Trends chart
   (Jan–Aug 2023; June 2023 tooltip: L2 6.5%, DCFC 18%). */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const DCFC = [11.1, 13.6, 15.9, 15.9, 15.5, 18.0, 20.1, 21.6];
const L2 = [3.6, 5.2, 6.3, 6.3, 9.0, 6.5, 7.1, 8.6];

export function Insights() {
  const byId = (id: string) => insights.items.find((i) => i.id === id)!;
  const [util, pricing, gas] = [byId("utilization"), byId("pricing"), byId("gas")];
  return (
    <section id="insights" className="section scroll-mt-20 bg-mist-2/60">
      <div className="shell">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 text-center">
          <SplitHeadline className="h2" words={insights.headline.split(" ")} emphasis={["data"]} />
          <Reveal delay={0.15}>
            <a href="https://stable.auto/resources" className="link-arrow group">
              <span className="border-b border-accent/50 pb-0.5 group-hover:border-accent">Articles &amp; Webinars</span>
              <ArrowUpRight className="arr text-accent-ink" />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-6">
          <Reveal className="h-full">
            <InsightCard item={pricing}>
              <PricingViz />
            </InsightCard>
          </Reveal>
          <Reveal className="h-full" delay={0.1}>
            <InsightCard item={util}>
              <UtilizationChart />
            </InsightCard>
          </Reveal>
          <Reveal className="h-full" delay={0.2}>
            <InsightCard item={gas}>
              <GasViz />
            </InsightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InsightCard({
  item,
  children,
}: {
  item: (typeof insights.items)[number];
  children: React.ReactNode;
}) {
  return (
    <a
      href={item.href}
      className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-surface-2 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-float)]"
    >
      <div className="relative flex h-[260px] flex-col justify-center px-5 py-6 sm:px-6">{children}</div>
      <div className="flex flex-1 items-end justify-between gap-6 border-t border-line p-5 sm:p-6">
        <div>
          <span className="tag">{item.badge}</span>
          <h3 className="mt-3 font-display text-[1.4rem] font-bold tracking-[-0.02em] text-ink [font-variation-settings:'wdth'_104]">
            {item.title}
          </h3>
          <p className="mt-1 text-mute">{item.body}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-all duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-mint">
          <ArrowUpRight />
        </span>
      </div>
    </a>
  );
}

/* ---- Utilization (interactive) ---------------------------------------- */

const UW = 400;
const UH = 230;
const UP = { l: 30, r: 10, t: 12, b: 24 };
const ux = (i: number) => UP.l + (i / (MONTHS.length - 1)) * (UW - UP.l - UP.r);
const uy = (v: number) => UH - UP.b - (v / 24) * (UH - UP.t - UP.b);
const DCFC_PATH = smoothPath(DCFC.map((v, i) => ({ x: ux(i), y: uy(v) })), 0.35);
const L2_PATH = smoothPath(L2.map((v, i) => ({ x: ux(i), y: uy(v) })), 0.35);

function UtilizationChart() {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [hi, setHi] = useState(5);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * UW;
    const i = Math.round(((x - UP.l) / (UW - UP.l - UP.r)) * (MONTHS.length - 1));
    setHi(Math.max(0, Math.min(MONTHS.length - 1, i)));
  };

  const tipLeft = ux(hi) > UW * 0.55;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-5 text-[0.8rem] text-mute">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cobalt" /> DCFC
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" /> L2
        </span>
        <span className="data-label ml-auto">2023</span>
      </div>
      <div className="relative mt-3">
        <svg
          ref={ref}
          viewBox={`0 0 ${UW} ${UH}`}
          className="block h-auto w-full touch-none"
          onPointerMove={onMove}
          role="img"
          aria-label="EV charging utilization in 2023: DCFC rose from about 11% in January to about 22% in August; L2 rose from about 4% to about 9%."
        >
          {[0, 6, 12, 18, 24].map((t) => (
            <g key={t}>
              <line x1={UP.l} x2={UW - UP.r} y1={uy(t)} y2={uy(t)} stroke="var(--line)" strokeDasharray={t ? "3 5" : undefined} vectorEffect="non-scaling-stroke" />
              <text x={UP.l - 10} y={uy(t) + 4} textAnchor="end" className="fill-mute font-mono text-[10px]">
                {t}%
              </text>
            </g>
          ))}
          {MONTHS.map((m, i) => (
            <text key={m} x={ux(i)} y={UH - 8} textAnchor="middle" className={`font-mono text-[10px] ${i === hi ? "fill-ink" : "fill-mute"}`}>
              {m}
            </text>
          ))}
          <line x1={ux(hi)} x2={ux(hi)} y1={UP.t} y2={UH - UP.b} stroke="var(--ink)" strokeOpacity="0.25" strokeDasharray="3 3" style={{ transition: "all 0.35s var(--ease-out-soft)" }} vectorEffect="non-scaling-stroke" />
          {[
            { d: DCFC_PATH, c: "var(--cobalt)", data: DCFC },
            { d: L2_PATH, c: "var(--accent)", data: L2 },
          ].map((s, k) => (
            <g key={k}>
              <motion.path
                d={s.d}
                fill="none"
                stroke={s.c}
                strokeWidth="2.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.8, ease: EASE, delay: 0.2 + k * 0.25 }}
              />
              {s.data.map((v, i) => (
                <motion.circle
                  key={i}
                  cx={ux(i)}
                  cy={uy(v)}
                  r={i === hi ? 5.5 : 3.2}
                  fill={i === hi ? "var(--surface-2)" : s.c}
                  stroke={s.c}
                  strokeWidth={i === hi ? 2.6 : 0}
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.12 + k * 0.2 }}
                  style={{ transition: "r 0.3s" }}
                />
              ))}
            </g>
          ))}
        </svg>

        {/* tooltip, styled after the index's own */}
        <div
          className="pointer-events-none absolute -top-1 w-[132px] rounded-xl border border-line bg-surface-2 px-3 py-2.5 shadow-[var(--shadow-float)] transition-[left] duration-300 ease-[var(--ease-out-soft)]"
          style={{ left: `calc(${(ux(hi) / UW) * 100}% ${tipLeft ? "- 144px" : "+ 12px"})` }}
          aria-hidden="true"
        >
          <p className="text-[0.82rem] font-semibold text-ink">{MONTHS[hi]} 2023</p>
          <p className="mt-2 flex items-center justify-between text-[0.8rem] text-ink-2">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cobalt" />
              DCFC
            </span>
            <span className="tabular font-semibold">{DCFC[hi].toFixed(1)}%</span>
          </p>
          <p className="mt-1 flex items-center justify-between text-[0.8rem] text-ink-2">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              L2
            </span>
            <span className="tabular font-semibold">{L2[hi].toFixed(1)}%</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---- Pricing (regional ranges) --------------------------------------- */

const REGIONS = [
  { r: "West", lo: 0.42, hi: 0.68, mid: 0.56 },
  { r: "Northeast", lo: 0.38, hi: 0.62, mid: 0.52 },
  { r: "Southeast", lo: 0.33, hi: 0.55, mid: 0.46 },
  { r: "Midwest", lo: 0.3, hi: 0.52, mid: 0.43 },
  { r: "Texas", lo: 0.29, hi: 0.5, mid: 0.41 },
];

function PricingViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const pos = (v: number) => `${((v - 0.25) / 0.5) * 100}%`;
  return (
    <div ref={ref} className="flex flex-col gap-2.5" role="img" aria-label="Illustrative range of DC fast charging prices per kWh by region.">
      {REGIONS.map((g, i) => (
        <div key={g.r} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
          <span className="text-[0.8rem] text-ink-2">{g.r}</span>
          <span className="relative h-4">
            <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
            <motion.span
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent/35"
              style={{ left: pos(g.lo), width: `calc(${pos(g.hi)} - ${pos(g.lo)})`, transformOrigin: "left" }}
              initial={{ scaleX: reduce ? 1 : 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.08 }}
            />
            <motion.span
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface-2 bg-accent-ink"
              style={{ left: pos(g.mid) }}
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: 0.6 + i * 0.08 }}
            />
          </span>
        </div>
      ))}
      <p className="data-label mt-1 flex justify-between pl-[6.25rem]">
        <span>Lower $/kWh</span>
        <span>Higher</span>
      </p>
    </div>
  );
}

/* ---- Gas price equivalent -------------------------------------------- */

function GasViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const rows = [
    { k: "Gasoline", sub: "per gallon", w: 0.92, c: "bg-ink-2" },
    { k: "DCFC", sub: "gallon equivalent", w: 0.7, c: "bg-cobalt" },
    { k: "L2", sub: "gallon equivalent", w: 0.38, c: "bg-accent" },
  ];
  return (
    <div ref={ref} className="flex flex-col gap-3.5" role="img" aria-label="Illustrative comparison of fuel cost per gallon against DCFC and L2 charging on a gallon-equivalent basis.">
      {rows.map((r, i) => (
        <div key={r.k}>
          <div className="flex items-baseline justify-between text-[0.8rem]">
            <span className="font-semibold text-ink">{r.k}</span>
            <span className="text-mute">{r.sub}</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-mist-2">
            <motion.div
              className={`h-full origin-left rounded-full ${r.c}`}
              initial={{ scaleX: reduce ? r.w : 0 }}
              animate={inView ? { scaleX: r.w } : {}}
              transition={{ duration: 1.2, ease: EASE, delay: 0.15 + i * 0.12 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
