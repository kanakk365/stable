"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { Reveal } from "@/components/fx/motion";
import { testimonial } from "@/lib/content";

/** The MN8 quote, lit word by word as it scrolls through the viewport. */
export function Testimonial() {
  const ref = useRef<HTMLQuoteElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = testimonial.quote.split(" ");

  return (
    <section className="section !pt-8 lg:!pt-12">
      <div className="shell">
        <figure className="mx-auto max-w-[1080px]">
          <svg viewBox="0 0 48 36" width="48" height="36" className="text-accent" aria-hidden="true">
            <path
              fill="currentColor"
              d="M0 36V22.6C0 9.9 6.2 2.4 18.6 0l2 5.2C13.6 7 10.4 11.4 10.2 18H20v18H0Zm27.4 0V22.6C27.4 9.9 33.6 2.4 46 0l2 5.2C41 7 37.8 11.4 37.6 18h9.8v18h-20Z"
            />
          </svg>
          <blockquote
            ref={ref}
            className="mt-8 font-display text-[clamp(1.6rem,3.3vw,2.85rem)] font-[620] leading-[1.18] tracking-[-0.022em] text-ink [font-variation-settings:'wdth'_104]"
          >
            <p>
              {words.map((w, i) => (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce}>
                  {w}
                </Word>
              ))}
            </p>
          </blockquote>
          <Reveal>
            <figcaption className="mt-12 flex items-center gap-5">
              <span className="grid h-14 w-24 place-items-center rounded-2xl border border-line bg-surface-2 px-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={testimonial.logo} alt="MN8" className="h-6 w-auto" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{testimonial.role}</span>
                <span className="block text-mute">{testimonial.company}</span>
              </span>
            </figcaption>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  still,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity: still ? 1 : opacity }}>{children}</motion.span>{" "}
    </>
  );
}
