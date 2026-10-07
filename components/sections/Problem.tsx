"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { CountUp, EASE, Reveal, SplitHeadline } from "@/components/fx/motion";
import { ArrowRight } from "@/components/ui/icons";
import { problem } from "@/lib/content";
import { r, smoothPath } from "@/lib/chart";

/*
 * Concentration of charging across stations. 100 stations sorted by
 * sessions; the cumulative curve passes through (30%, 80%) — the statistic
 * the section is built on. Curve: y = 1 - (1 - x)^k with 0.7^k = 0.2.
 */
const N = 100;
const K = Math.log(0.2) / Math.log(0.7);
const cum = (x: number) => 1 - Math.pow(1 - x, K);
const share = Array.from({ length: N }, (_, i) => cum((i + 1) / N) - cum(i / N));
// Bar heights are rounded so server and browser render identical numbers.
const maxShare = share[0];

const W = 640;
const H = 360;
const P = { l: 44, r: 20, t: 24, b: 40 };
const px = (x: number) => P.l + x * (W - P.l - P.r);
const py = (y: number) => H - P.b - y * (H - P.t - P.b);
const CURVE = smoothPath(
  Array.from({ length: 41 }, (_, i) => {
    const x = i / 40;
    return { x: px(x), y: py(cum(x)) };
  }),
  0.5
);
const BAR_W = (W - P.l - P.r) / N;

export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();
  const show = reduce || inView;

  return (
    <section className="section">
      <div className="shell">
        <div className="grid items-stretch gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="flex flex-col lg:py-2">
            <SplitHeadline className="h2 max-w-[14ch]" words={problem.headline.split(" ")} emphasis={["potential"]} />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[46ch] text-[1.15rem] leading-relaxed text-ink-2">{problem.body[0]}</p>
              <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-mute">{problem.body[1]}</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
              {problem.ctas.map((c, i) => (
                <a key={c.label} href={c.href} className={i === 0 ? "btn" : "btn-ghost"}>
                  {c.label}
                  {i === 0 ? (
                    <span className="chip" aria-hidden="true">
                      <ArrowRight />
                    </span>
                  ) : null}
                </a>
              ))}
            </Reveal>
          </div>

          <div ref={ref}>
            <Reveal>
              <figure className="overflow-hidden rounded-[22px] border border-line bg-surface-2 shadow-[var(--shadow-card)]">
                <div className="grid grid-cols-2 border-b border-line">
                  <div className="p-5 sm:p-6">
                    <p className="font-display text-[clamp(2.6rem,5vw,3.8rem)] font-[780] leading-none tracking-[-0.04em] text-accent-ink [font-variation-settings:'wdth'_110]">
                      <CountUp value={80} suffix="%" />
                    </p>
                    <p className="mt-2 text-[0.9rem] text-mute">of all charging sessions</p>
                  </div>
                  <div className="border-l border-line p-5 sm:p-6">
                    <p className="font-display text-[clamp(2.6rem,5vw,3.8rem)] font-[780] leading-none tracking-[-0.04em] text-ink [font-variation-settings:'wdth'_110]">
                      <CountUp value={30} suffix="%" duration={1.4} />
                    </p>
                    <p className="mt-2 text-[0.9rem] text-mute">of stations deliver them</p>
                  </div>
                </div>

                <div className="p-3 sm:p-5">
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="block h-auto w-full"
                    role="img"
                    aria-label="100 stations sorted by sessions. The busiest 30 stations account for 80% of all charging; the remaining 70 share 20%."
                  >
                    {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                      <g key={t}>
                        <line x1={P.l} x2={W - P.r} y1={py(t)} y2={py(t)} stroke="var(--line)" strokeDasharray={t ? "3 5" : undefined} />
                        <text x={P.l - 10} y={py(t) + 4} textAnchor="end" className="fill-mute font-mono text-[11px]">
                          {t * 100}%
                        </text>
                      </g>
                    ))}

                    {/* station bars: per-station share of sessions, scaled */}
                    {share.map((s, i) => {
                      const top = i < 30;
                      const h = r((s / maxShare) * (H - P.t - P.b) * 0.62);
                      return (
                        <motion.rect
                          key={i}
                          x={r(P.l + i * BAR_W + 0.6)}
                          y={r(H - P.b - h)}
                          width={r(BAR_W - 1.2)}
                          height={h}
                          rx="1"
                          fill={top ? "var(--accent)" : "var(--signal)"}
                          fillOpacity={top ? 0.55 : 0.38}
                          initial={{ scaleY: reduce ? 1 : 0 }}
                          animate={show ? { scaleY: 1 } : {}}
                          transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.008 }}
                          style={{ transformOrigin: "50% 100%", transformBox: "fill-box" }}
                        />
                      );
                    })}

                    {/* 30% marker */}
                    <motion.g initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: 1.6, duration: 0.6 }}>
                      <line x1={px(0.3)} x2={px(0.3)} y1={py(0.8)} y2={H - P.b} stroke="var(--ink)" strokeOpacity="0.5" strokeDasharray="4 4" />
                      <line x1={P.l} x2={px(0.3)} y1={py(0.8)} y2={py(0.8)} stroke="var(--ink)" strokeOpacity="0.5" strokeDasharray="4 4" />
                    </motion.g>

                    {/* cumulative curve */}
                    <motion.path
                      d={CURVE}
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={show ? { pathLength: 1 } : {}}
                      transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
                    />

                    <motion.g
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={show ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1.9, duration: 0.5, ease: EASE }}
                      style={{ transformOrigin: `${px(0.3)}px ${py(0.8)}px` }}
                    >
                      <circle cx={px(0.3)} cy={py(0.8)} r="12" fill="var(--accent)" className="pulse-ring" />
                      <circle cx={px(0.3)} cy={py(0.8)} r="6" fill="var(--surface-2)" stroke="var(--ink)" strokeWidth="2.4" />
                      <g transform={`translate(${px(0.3) + 16} ${py(0.8) + 14})`}>
                        <rect width="178" height="30" rx="15" fill="var(--deep)" />
                        <text x="14" y="19.5" className="font-mono text-[11px]" fill="var(--mint)" fontWeight="700">
                          30% → 80%
                          <tspan fill="var(--on-deep)" fontWeight="500"> of charging</tspan>
                        </text>
                      </g>
                    </motion.g>

                    {/* axis labels */}
                    <text x={px(0.15)} y={H - 14} textAnchor="middle" className="fill-accent-ink font-mono text-[11px] font-bold">
                      Busiest 30%
                    </text>
                    <text x={px(0.65)} y={H - 14} textAnchor="middle" className="fill-mute font-mono text-[11px]">
                      Remaining 70% of stations →
                    </text>
                  </svg>
                </div>

                <figcaption className="figcaption">
                  <span>
                    <b>Fig.</b> Cumulative share of charging sessions by station, busiest first
                  </span>
                  <span>Bars: sessions per station</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
