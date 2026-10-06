"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** House easing — expo-out, used for every entrance in the system. */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Scroll entrance: rise out of a light blur, once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: reduce ? 0.3 : 1.1, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section headline that rises word by word out of a mask the first time it
 * scrolls into view. Words in `emphasis` take the accent ink.
 */
export function SplitHeadline({
  words,
  emphasis = [],
  className,
  delay = 0,
  as = "h2",
}: {
  words: readonly string[];
  emphasis?: readonly string[];
  className?: string;
  delay?: number;
  as?: "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag className={className} initial="hide" whileInView="show" viewport={VIEWPORT}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="mask-word !pb-[0.1em]">
            <motion.span
              data-reveal
              className={`!animate-none ${emphasis.includes(w) ? "text-accent-ink" : ""}`}
              variants={{
                hide: reduce ? { opacity: 0 } : { y: "108%" },
                show: reduce ? { opacity: 1 } : { y: "0%" },
              }}
              transition={{ duration: 1, ease: EASE, delay: delay + i * 0.045 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Number that counts up the first time it scrolls into view. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState<number | null>(null);

  // Server render shows the real figure, so the number is never wrong if
  // the animation can't run. Once hydrated, park at zero until in view.
  useEffect(() => {
    if (!reduce) setN(0);
  }, [reduce]);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE_SOFT,
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  const shown = n ?? value;
  const text = shown.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
