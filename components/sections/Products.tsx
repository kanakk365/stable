"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

import { EASE, Reveal, SplitHeadline } from "@/components/fx/motion";
import { ArrowRight } from "@/components/ui/icons";
import { products } from "@/lib/content";

import { EvaluateVisual, OperateVisual } from "./ProductVisuals";

/**
 * Evaluate and Operate as one lifecycle. Two panels of identical structure
 * and equal height sit under a rail that spans both; the rail's midpoint —
 * the moment chargers go live — falls exactly in the gutter between them.
 */
export function Products() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "center 0.45"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section ref={ref} id="products" className="section">
      <div className="shell">
        <div className="mx-auto max-w-[900px] text-center">
          <SplitHeadline className="h2" words={"Two products, one lifecycle".split(" ")} emphasis={["lifecycle"]} />
        </div>

        {/* Lifecycle rail */}
        <div className="mt-16 grid grid-cols-2 gap-5 lg:gap-6" aria-hidden="true">
          <RailEnd label="Before you build" index="01" />
          <RailEnd label="After deployment" index="02" right />
        </div>
        <div className="relative mt-4 h-px bg-line-strong" aria-hidden="true">
          <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-accent" />
          <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent" />
          <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-accent bg-mist" />
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-mist px-3.5 py-1.5 text-[0.78rem] font-semibold text-ink">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-deep text-mint">
              <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                <path d="M9.2 1 3 9h4.2L6.6 15 13 7H8.8z" />
              </svg>
            </span>
            Chargers go live
          </span>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
          <ProductPanel p={products[0]} visual={<EvaluateVisual />} />
          <ProductPanel p={products[1]} visual={<OperateVisual />} delay={0.12} />
        </div>
      </div>
    </section>
  );
}

function RailEnd({ label, index, right }: { label: string; index: string; right?: boolean }) {
  return (
    <p className={`data-label flex items-center gap-3 ${right ? "justify-end" : ""}`}>
      <span className="tabular font-bold text-accent-ink">{index}</span>
      {label}
    </p>
  );
}

function ProductPanel({
  p,
  visual,
  delay = 0,
}: {
  p: (typeof products)[number];
  visual: ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      id={p.id}
      data-reveal
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      className="group flex scroll-mt-28 flex-col overflow-hidden rounded-[28px] border border-line bg-surface-2 shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-float)]"
    >
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <SplitHeadline
          as="h3"
          words={[p.name]}
          className="font-display text-[clamp(2.6rem,4.6vw,4rem)] font-[780] leading-[0.95] tracking-[-0.04em] text-ink [font-variation-settings:'wdth'_112]"
        />
        <Reveal delay={delay + 0.1} className="flex flex-1 flex-col">
          <p className="mt-5 font-display text-[1.3rem] font-semibold leading-snug tracking-[-0.015em] text-ink [font-variation-settings:'wdth'_104]">
            {p.title}
          </p>
          <p className="mt-3 max-w-[44ch] text-[1.02rem] leading-relaxed text-mute">{p.body}</p>
          <a href={p.cta.href} className="link-arrow group/cta mt-auto pt-8 text-[1rem]">
            <span className="border-b border-accent/50 pb-0.5 transition-colors group-hover/cta:border-accent">{p.cta.label}</span>
            <ArrowRight className="arr text-accent-ink" />
          </a>
        </Reveal>
      </div>
      <div className="border-t border-line bg-surface">{visual}</div>
    </motion.article>
  );
}
