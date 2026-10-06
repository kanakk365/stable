import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowRight(props: P) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" {...base} {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowUpRight(props: P) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" {...base} {...props}>
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}

export function ChevronDown(props: P) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" {...base} strokeWidth={1.8} {...props}>
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

export function Check(props: P) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" {...base} strokeWidth={2} {...props}>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

export function Bolt(props: P) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" {...props}>
      <path d="M9.2 1 3 9h4.2L6.6 15 13 7H8.8z" />
    </svg>
  );
}

export function LinkedIn(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.13v5.42h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.84 1.25-1.84 2.54v4.88h-4v-11Z" />
    </svg>
  );
}

export function XLogo(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.32l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
    </svg>
  );
}

/* ---- Feature icons (Why Stable). 32px line art on a 32 grid. ---------- */

const feat = { ...base, strokeWidth: 1.5 };

export function IconModel(props: P) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" {...feat} {...props}>
      <path d="M4 27h24" />
      <rect x="6" y="17" width="4" height="10" rx="1" />
      <rect x="14" y="12" width="4" height="15" rx="1" />
      <rect x="22" y="7" width="4" height="20" rx="1" />
      <path d="M5 13 13 7l6 3 8-6" stroke="var(--accent)" />
    </svg>
  );
}

export function IconTarget(props: P) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" {...feat} {...props}>
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="6.5" />
      <circle cx="16" cy="16" r="2.2" fill="var(--accent)" stroke="var(--accent)" />
      <path d="M16 2v4M16 26v4M2 16h4M26 16h4" />
    </svg>
  );
}

export function IconPulse(props: P) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" {...feat} {...props}>
      <rect x="3" y="6" width="26" height="20" rx="3" />
      <path d="M6 18h5l2.5-6 4 10 2.5-6H26" stroke="var(--accent)" />
    </svg>
  );
}

export function IconShield(props: P) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" {...feat} {...props}>
      <path d="M16 3 5 7v8c0 7 4.7 11.7 11 14 6.3-2.3 11-7 11-14V7L16 3Z" />
      <path d="m11 16 3.5 3.5L21 13" stroke="var(--accent)" />
    </svg>
  );
}

export function IconLink(props: P) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" {...feat} {...props}>
      <ellipse cx="9" cy="8" rx="6" ry="2.5" />
      <path d="M3 8v6c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V8" />
      <path d="M3 14v6c0 1.4 2.7 2.5 6 2.5" />
      <circle cx="24" cy="23" r="5" stroke="var(--accent)" />
      <path d="M15 19h4" stroke="var(--accent)" strokeDasharray="1.5 2.5" />
      <path d="m22 23 1.5 1.5L26.5 21" stroke="var(--accent)" />
    </svg>
  );
}

export function IconPeople(props: P) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" {...feat} {...props}>
      <circle cx="11" cy="11" r="4.5" />
      <path d="M3 26c.6-4.6 3.8-7.5 8-7.5s7.4 2.9 8 7.5" />
      <circle cx="22.5" cy="12.5" r="3.5" stroke="var(--accent)" />
      <path d="M21 18.6c4.2-.5 7.4 2 8 6.4" stroke="var(--accent)" />
    </svg>
  );
}

export const featureIcons = {
  model: IconModel,
  target: IconTarget,
  pulse: IconPulse,
  shield: IconShield,
  link: IconLink,
  people: IconPeople,
};
