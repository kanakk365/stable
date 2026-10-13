"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { EASE } from "@/components/fx/motion";

/*
 * Adaptive Pricing, after the diagram on Stable's Operate page: five live
 * inputs feed the model, which returns a recommended price. Inputs on the
 * left, model in the middle, price on the right; signal pulses travel the
 * connectors once the figure is in view.
 */

const INPUTS = [
  { label: "Charger utilization", icon: "gauge" },
  { label: "User sentiment", icon: "smile" },
  { label: "Local energy costs", icon: "bolt" },
  { label: "Custom limits", icon: "sliders" },
  { label: "Market utilization trends", icon: "trend" },
] as const;

const W = 1000;
const H = 440;
const IN_X = 40;
const IN_W = 300;
const IN_H = 56;
const MODEL = { x: 500, y: H / 2, r: 62 };
const OUT = { x: 700, w: 260, h: 96 };
const rowY = (i: number) => 40 + i * 84 + IN_H / 2;

const connector = (i: number) => {
  const y = rowY(i);
  const x0 = IN_X + IN_W;
  const x1 = MODEL.x - MODEL.r - 6;
  const cx = (x0 + x1) / 2;
  return `M ${x0} ${y} C ${cx} ${y}, ${cx} ${MODEL.y}, ${x1} ${MODEL.y}`;
};
const OUT_PATH = `M ${MODEL.x + MODEL.r + 6} ${MODEL.y} L ${OUT.x - 6} ${MODEL.y}`;

function Icon({ name }: { name: (typeof INPUTS)[number]["icon"] }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "gauge":
      return (
        <g {...p}>
          <path d="M4 15a8 8 0 0 1 16 0" />
          <path d="m12 15 4-5" />
        </g>
      );
    case "smile":
      return (
        <g {...p}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.5 13.5a4 4 0 0 0 7 0" />
          <path d="M9 9.5h.01M15 9.5h.01" />
        </g>
      );
    case "bolt":
      return <path d="M13 3 6 13h5l-1 8 7-10h-5z" {...p} />;
    case "sliders":
      return (
        <g {...p}>
          <path d="M5 7h14M5 17h14" />
          <circle cx="9" cy="7" r="2" fill="var(--surface-2)" />
          <circle cx="15" cy="17" r="2" fill="var(--surface-2)" />
        </g>
      );
    case "trend":
      return (
        <g {...p}>
          <path d="m4 16 5-5 3 3 7-7" />
          <path d="M15 7h4v4" />
        </g>
      );
  }
}

export function AdaptivePricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const show = inView || !!reduce;

  return (
    <div ref={ref} className="rounded-[28px] border border-line bg-surface-2 p-4 shadow-[var(--shadow-card)] sm:p-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Charger utilization, user sentiment, local energy costs, custom limits and market utilization trends feed Stable's model, which returns a recommended price."
      >
        {/* connectors */}
        {INPUTS.map((_, i) => (
          <g key={i}>
            <motion.path
              d={connector(i)}
              fill="none"
              stroke="var(--line-strong)"
              strokeWidth="1.5"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={show ? { pathLength: 1 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.08 }}
            />
            {show && !reduce ? (
              <circle r="4" fill="var(--accent)">
                <animateMotion dur="2.8s" begin={`${1.2 + i * 0.45}s`} repeatCount="indefinite" path={connector(i)} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                <animate attributeName="opacity" dur="2.8s" begin={`${1.2 + i * 0.45}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.1;0.85;1" />
              </circle>
            ) : null}
          </g>
        ))}
        <motion.path
          d={OUT_PATH}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={show ? { pathLength: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 1.1 }}
        />
        <motion.path
          d={`M ${OUT.x - 16} ${MODEL.y - 7} L ${OUT.x - 6} ${MODEL.y} L ${OUT.x - 16} ${MODEL.y + 7}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 1.6 }}
        />

        {/* inputs */}
        {INPUTS.map((it, i) => (
          <motion.g
            key={it.label}
            initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -12 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
          >
            <rect x={IN_X} y={rowY(i) - IN_H / 2} width={IN_W} height={IN_H} rx="16" fill="var(--surface)" stroke="var(--line-strong)" />
            <g transform={`translate(${IN_X + 14} ${rowY(i) - 18})`}>
              <rect width="36" height="36" rx="10" fill="var(--deep)" />
              <g transform="translate(6 6)" color="var(--mint)">
                <Icon name={it.icon} />
              </g>
            </g>
            <text x={IN_X + 66} y={rowY(i) + 5.5} className="fill-ink text-[16px] font-semibold">
              {it.label}
            </text>
          </motion.g>
        ))}

        {/* model */}
        <motion.g
          initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.85 }}
          animate={show ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
          style={{ transformOrigin: `${MODEL.x}px ${MODEL.y}px` }}
        >
          <circle cx={MODEL.x} cy={MODEL.y} r={MODEL.r + 18} fill="var(--accent)" fillOpacity="0.1" />
          <circle cx={MODEL.x} cy={MODEL.y} r={MODEL.r} fill="var(--deep)" />
          <text x={MODEL.x} y={MODEL.y - 4} textAnchor="middle" className="text-[17px] font-bold" fill="var(--on-deep)">
            AI model
          </text>
          <text x={MODEL.x} y={MODEL.y + 18} textAnchor="middle" className="font-mono text-[11px]" fill="var(--mint)">
            Stable Operate
          </text>
        </motion.g>

        {/* output */}
        <motion.g
          initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : 12 }}
          animate={show ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 1.5 }}
        >
          <rect x={OUT.x} y={MODEL.y - OUT.h / 2} width={OUT.w} height={OUT.h} rx="20" fill="var(--mint)" />
          <text x={OUT.x + 24} y={MODEL.y - 8} className="font-mono text-[11px] font-bold" fill="var(--deep)">
            OUTPUT
          </text>
          <text x={OUT.x + 24} y={MODEL.y + 20} className="text-[22px] font-bold" fill="var(--ink)">
            Recommended price
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
