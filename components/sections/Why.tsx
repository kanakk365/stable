"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { EASE, SplitHeadline } from "@/components/fx/motion";
import { featureIcons } from "@/components/ui/icons";
import { why } from "@/lib/content";

import { scenes } from "./WhyVisuals";

/**
 * Six reasons, read as a scroll story: the reason crossing the middle of the
 * viewport becomes active and the pinned stage plays its scene.
 */
export function Why() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const Scene = scenes[active];

  return (
    <section className="section">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <SplitHeadline className="h2 max-w-[13ch]" words={why.headline.split(" ")} emphasis={["choose"]} />

          <div className="relative mt-12 hidden aspect-[7/5] overflow-hidden rounded-[24px] border border-line bg-surface-2 shadow-[var(--shadow-float)] lg:block">
            <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-70" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(8px)", scale: 1.01 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute inset-0 p-6"
              >
                <Scene />
              </motion.div>
            </AnimatePresence>
            {/* progress ticks */}
            <div className="absolute bottom-5 left-6 flex gap-1.5" aria-hidden="true">
              {why.items.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-accent" : "w-3 bg-line-strong"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <ol className="flex flex-col lg:py-[18vh]">
          {why.items.map((item, i) => {
            const Icon = featureIcons[item.icon];
            const on = i === active;
            const [verb, ...rest] = item.title.split(" ");
            return (
              <li
                key={item.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-i={i}
                className="border-t border-line py-9 last:border-b lg:py-12"
              >
                <div className="flex items-start gap-5">
                  <Icon
                    className={`mt-1 shrink-0 transition-colors duration-500 ${on ? "text-ink" : "text-ink lg:text-mute"}`}
                    width={28}
                    height={28}
                  />
                  <p
                    className={`font-display text-[clamp(1.4rem,2.3vw,2rem)] font-[640] leading-[1.18] tracking-[-0.02em] transition-colors duration-500 [font-variation-settings:'wdth'_104] ${
                      on ? "text-ink" : "text-ink lg:text-ink/40"
                    }`}
                  >
                    <span className={`transition-colors duration-500 ${on ? "text-accent-ink" : "text-accent-ink lg:text-inherit"}`}>{verb}</span>{" "}
                    {rest.join(" ")}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
