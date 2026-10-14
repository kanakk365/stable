"use client";

import { motion, useReducedMotion } from "motion/react";

import { CountUp } from "@/components/fx/motion";
import { PRICE_ADJUSTMENTS, REVENUE } from "@/lib/pages/app-views";

import { AppWindow } from "./AppWindow";

/*
 * Operate's revenue and pricing view, rebuilt from Stable's pricing-guidance
 * screenshot: revenue performance on the left, the next round of price
 * adjustments on the right, at equal height.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

function Bars({
  values,
  max,
  height,
  delay,
  label,
  strong,
}: {
  values: number[];
  max: number;
  /** Fixed height in px; omit to fill the parent column. */
  height?: number;
  delay: number;
  label: string;
  strong?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`flex items-end gap-[3px] ${height ? "" : "min-h-[118px] flex-1"}`}
      style={height ? { height } : undefined}
      role="img"
      aria-label={label}
    >
      {values.map((v, i) => (
        <motion.span
          key={i}
          className="flex-1 origin-bottom rounded-t-[3px]"
          style={{ height: `${(v / max) * 100}%`, background: strong ? "var(--accent)" : "oklch(0.675 0.132 168 / 0.55)" }}
          initial={{ scaleY: reduce ? 1 : 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : delay + i * 0.025 }}
        />
      ))}
    </div>
  );
}

const fmtPrice = (v: number) => `$${v.toFixed(2)}`;

function Change({ from, to }: { from: number; to: number }) {
  if (to > from)
    return <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.68rem] font-bold text-accent-ink">↑ Increase</span>;
  if (to < from)
    return <span className="rounded-full bg-signal/15 px-2 py-0.5 text-[0.68rem] font-bold text-[oklch(0.52_0.14_45)]">↓ Decrease</span>;
  return <span className="rounded-full bg-ink/[0.07] px-2 py-0.5 text-[0.68rem] font-bold text-mute">No change</span>;
}

export function OperatePerformanceView() {
  const reduce = useReducedMotion();
  const p = PRICE_ADJUSTMENTS;
  return (
    <AppWindow section="Operate · Performance" label="Stable Operate: revenue performance and upcoming price adjustments for a charging network">
      <div className="grid min-w-0 items-stretch lg:grid-cols-2 [&>*]:min-w-0">
        {/* Revenue performance */}
        <div className="flex flex-col border-b border-line px-5 pb-5 pt-4 lg:border-b-0 lg:border-r">
          <p className="text-[0.9rem] font-semibold text-ink">Revenue Performance</p>
          <p className="mt-3 text-[0.74rem] text-mute">Net revenue · {REVENUE.period}</p>
          <p className="tabular mt-0.5 font-display text-[2rem] font-[760] leading-none tracking-[-0.03em] text-ink [font-variation-settings:'wdth'_108]">
            <CountUp value={REVENUE.total} prefix="$" duration={1.8} />
          </p>
          <div className="mt-4 flex flex-1 flex-col">
            <Bars values={REVENUE.netRevenue} max={7000} delay={0.9} label="Net revenue by week, rising from about $3,100 to $6,300." strong />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-5 border-t border-line pt-4">
            <div>
              <p className="text-[0.72rem] text-mute">Unique customers</p>
              <div className="mt-2">
                <Bars values={REVENUE.customers} max={450} height={44} delay={1.2} label="Unique customers by week, between about 320 and 410." />
              </div>
            </div>
            <div>
              <p className="text-[0.72rem] text-mute">Energy dispensed (kWh)</p>
              <div className="mt-2">
                <Bars values={REVENUE.energy} max={15000} height={44} delay={1.35} label="Energy dispensed by week, between about 11,500 and 13,500 kWh." />
              </div>
            </div>
          </div>
        </div>

        {/* Price adjustments */}
        <div className="flex flex-col">
          <div className="px-5 pb-3 pt-4">
            <p className="text-[0.9rem] font-semibold text-ink">Price Adjustments</p>
            <p className="mt-3 text-[0.74rem] text-mute">Next adjustment · {p.next}</p>
            <dl className="mt-3 grid grid-cols-3 gap-2">
              {[
                { k: "Increasing", v: p.increasing, dot: "bg-accent", glyph: "↑" },
                { k: "Decreasing", v: p.decreasing, dot: "bg-signal", glyph: "↓" },
                { k: "No change", v: p.unchanged, dot: "bg-ink/25", glyph: "–" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-line bg-surface px-3 py-2.5">
                  <dd className="flex items-center gap-2">
                    <span className={`grid h-5 w-5 place-items-center rounded-full text-[0.7rem] font-bold text-surface-2 ${s.dot}`} aria-hidden="true">
                      {s.glyph}
                    </span>
                    <CountUp value={s.v} duration={1.4} className="text-[1.15rem] font-bold text-ink" />
                  </dd>
                  <dt className="mt-0.5 text-[0.7rem] text-mute">{s.k}</dt>
                </div>
              ))}
            </dl>
          </div>
          <ul className="mt-auto border-t border-line">
            {p.rows.map((row, i) => (
              <motion.li
                key={row.site}
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : 1.4 + i * 0.08 }}
                className="flex items-center gap-3 border-b border-line px-5 py-2.5 last:border-b-0"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.82rem] font-semibold text-ink">{row.site}</span>
                  <span className="block truncate text-[0.7rem] text-mute">{row.account}</span>
                </span>
                <span className="tabular hidden whitespace-nowrap text-[0.8rem] text-ink-2 sm:inline">
                  {fmtPrice(row.current)} <span className="text-mute">→</span> <span className="font-semibold text-ink">{fmtPrice(row.next)}</span>
                </span>
                <Change from={row.current} to={row.next} />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </AppWindow>
  );
}
