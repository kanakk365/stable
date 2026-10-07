"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { DotMap, MAP_ASPECT } from "@/components/fx/DotMap";
import { CountUp, EASE, Reveal } from "@/components/fx/motion";
import { stats } from "@/lib/content";

const LAYER_NOTES = [
  "Sites scored across demand centres",
  "Live chargers feeding the model",
  "Capital planned in the largest markets",
];

/**
 * The deep band. The three figures are not a stat row: each one is a
 * switch for the map beside it. Hover or focus a figure to light its layer;
 * left alone, the band walks through them.
 */
export function Stats() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20%" });
  const [layer, setLayer] = useState(1);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!inView || held || reduce) return;
    const t = setInterval(() => setLayer((v) => (v + 1) % 3), 4200);
    return () => clearInterval(t);
  }, [inView, held, reduce]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-deep text-on-deep">
      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/2 -z-10 h-[700px] w-[900px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.55_0.1_175/0.35),transparent)]"
      />

      <div className="shell section">
        <Reveal>
          <h2 className="h2 max-w-[22ch] !text-on-deep">
            {stats.headline[0]} <span className="text-on-deep-mute">{stats.headline[1]}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[52ch] text-[1.08rem] leading-relaxed text-on-deep-mute">{stats.sub}</p>
        </Reveal>

        <div className="mt-14 grid items-center gap-10 lg:mt-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <ul className="flex flex-col" onPointerLeave={() => setHeld(false)}>
            {stats.items.map((s, i) => {
              const on = layer === i;
              return (
                <li key={s.label} className="border-t border-line-deep last:border-b">
                  <button
                    type="button"
                    aria-pressed={on}
                    onPointerEnter={() => {
                      setLayer(i);
                      setHeld(true);
                    }}
                    onFocus={() => {
                      setLayer(i);
                      setHeld(true);
                    }}
                    onBlur={() => setHeld(false)}
                    onClick={() => setLayer(i)}
                    className="group relative w-full py-5 text-left outline-none"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 -left-4 right-0 -z-10 rounded-2xl bg-white/[0.05]"
                      initial={false}
                      animate={{ opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                    <span className="flex items-baseline justify-between gap-6">
                      <span
                        className={`font-display text-[clamp(2.4rem,4.4vw,3.6rem)] font-[760] leading-none tracking-[-0.04em] transition-colors duration-500 [font-variation-settings:'wdth'_110] ${on ? "text-mint" : "text-on-deep"}`}
                      >
                        <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-500 ${on ? "border-mint bg-mint shadow-[0_0_0_6px_oklch(0.784_0.145_171/0.18)]" : "border-on-deep-mute/50"}`}
                      />
                    </span>
                    <span className="mt-2 block text-[1rem] text-on-deep">{s.label}</span>
                    <span
                      className={`mt-1 block text-[0.86rem] text-on-deep-mute transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
                    >
                      {LAYER_NOTES[i]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <Reveal delay={0.15}>
            <figure>
              <div className="relative w-full" style={{ aspectRatio: `${MAP_ASPECT}` }}>
                <DotMap layer={layer} className="absolute inset-0 h-full w-full" />
              </div>
              <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.7rem] text-on-deep-mute">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                  {["Evaluated locations", "Active chargers", "Planned investment"][layer]}
                </span>
                <span>Stylised coverage, contiguous US</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
