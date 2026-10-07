"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { DotField } from "@/components/fx/DotField";
import { EASE, Reveal, SplitHeadline } from "@/components/fx/motion";
import { ArrowUpRight, Check } from "@/components/ui/icons";
import { cta } from "@/lib/content";

export function Cta() {
  return (
    <section className="px-3 pb-6 sm:px-5" id="contact">
      <div className="relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-[32px] bg-deep text-on-deep sm:rounded-[40px]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_65%_30%,oklch(0.45_0.08_180/0.55),transparent_70%)]" />
        <DotField variant="deep" horizon={0.42} className="absolute inset-0 -z-10 h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,oklch(0.3_0.05_205/0.85),oklch(0.3_0.05_205/0.35)_60%,transparent)]" />

        <div className="shell grid items-center gap-14 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <SplitHeadline className="h2 max-w-[15ch] !text-on-deep" words={cta.headline.split(" ")} />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-[40ch] text-[1.15rem] leading-relaxed text-on-deep-mute">{cta.sub}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a href={cta.action.href} className="btn btn-mint">
                  {cta.action.label}
                  <span className="chip" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </a>
                <a href="https://stable.auto/contact" className="btn-ghost btn-ghost-deep">
                  Contact sales
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mx-auto w-full max-w-[440px] lg:mr-0">
            <Scheduler />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SLOTS = ["9:30", "11:00", "13:30", "15:00"];

/** A booking widget that books itself: day, then slot, then confirmed. */
function Scheduler() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20%" });
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(
      () => {
        if (step === 3) {
          setStep(0);
          setCycle((c) => c + 1);
        } else setStep((s) => s + 1);
      },
      step === 3 ? 3000 : 1300
    );
    return () => clearTimeout(t);
  }, [step, inView, reduce]);

  const day = [2, 3, 1][cycle % 3];
  const slot = [1, 2, 0][cycle % 3];
  const daySel = step >= 1 || reduce;
  const slotSel = step >= 2 || reduce;
  const done = step === 3;

  return (
    <div ref={ref} className="relative rounded-[24px] border border-white/10 bg-surface-2 p-5 text-ink shadow-[0_40px_80px_-30px_oklch(0.15_0.04_205/0.8)] sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[1.02rem] font-semibold">Intro call with Stable</p>
          <p className="text-[0.82rem] text-mute">30 min · Video call</p>
        </div>
        <div className="flex -space-x-2" aria-hidden="true">
          {["JM", "AK", "RS"].map((n, i) => (
            <span
              key={n}
              className="grid h-9 w-9 place-items-center rounded-full border-2 border-surface-2 text-[0.7rem] font-bold"
              style={{ background: ["var(--deep)", "var(--accent)", "var(--mist-2)"][i], color: ["var(--mint)", "var(--ink)", "var(--ink)"][i] }}
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-1.5" role="presentation">
        {DAYS.map((d, i) => {
          const on = daySel && i === day;
          return (
            <span
              key={d}
              className={`relative rounded-xl border py-2.5 text-center text-[0.82rem] font-medium transition-colors duration-300 ${on ? "border-deep text-on-deep" : "border-line text-ink-2"}`}
            >
              {on && (
                <motion.span layoutId="day" className="absolute inset-0 -z-0 rounded-[11px] bg-deep" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <span className="relative">{d}</span>
            </span>
          );
        })}
      </div>

      <div className="relative mt-4 min-h-[124px]">
        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <motion.div
              key="slots"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: daySel ? 1 : 0.35, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid grid-cols-2 gap-2"
            >
              {SLOTS.map((s, i) => {
                const on = slotSel && i === slot;
                return (
                  <span
                    key={s}
                    className={`rounded-xl border px-3 py-3 text-center text-[0.9rem] font-semibold tabular transition-all duration-300 ${on ? "border-accent bg-accent/15 text-ink" : "border-line text-ink-2"}`}
                  >
                    {s}
                  </span>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex h-[124px] flex-col items-center justify-center rounded-2xl bg-accent/12 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                className="grid h-10 w-10 place-items-center rounded-full bg-deep text-mint"
              >
                <Check />
              </motion.span>
              <p className="mt-2 text-[0.95rem] font-semibold">
                {DAYS[day]} · {SLOTS[slot]} confirmed
              </p>
              <p className="text-[0.8rem] text-mute">Invite sent to your calendar</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[0.8rem] text-mute">
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <circle cx="8" cy="8" r="6.2" />
            <path d="M1.8 8h12.4M8 1.8c1.8 1.9 2.6 4 2.6 6.2S9.8 12.3 8 14.2C6.2 12.3 5.4 10.2 5.4 8S6.2 3.7 8 1.8Z" />
          </svg>
          Times shown in your time zone
        </span>
        <span className="font-semibold text-ink-2">Google Meet</span>
      </div>
    </div>
  );
}
