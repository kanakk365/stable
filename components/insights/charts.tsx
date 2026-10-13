"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { EASE } from "@/components/fx/motion";
import { Check } from "@/components/ui/icons";
import { smoothPath } from "@/lib/chart";
import { STATE_ABBR, TILE_GRID, type MonthPoint, type StatePoint } from "@/lib/pages/insights";

export type Unit = "pct" | "frac" | "usd";

/** Value formatting lives client-side so server pages can pass a plain unit. */
const fmt = (unit: Unit, v: number, tick = false) => {
  if (unit === "usd") return `${v.toFixed(2)}`;
  const pct = unit === "frac" ? v * 100 : v;
  return tick ? `${Math.round(pct)}%` : `${pct.toFixed(1)}%`;
};

const SERIES = [
  { key: "dcfc" as const, label: "DCFC (L3)", color: "var(--cobalt)" },
  { key: "l2" as const, label: "L2 (AC)", color: "var(--accent)" },
];

const shortMonth = (d: string) => {
  const [m, y] = d.split(", ");
  return `${m.slice(0, 3)} ’${y.slice(2)}`;
};

/* =========================================================================
   Monthly trend — L2 vs DCFC, with a hover readout.
   ========================================================================= */

export function TrendChart({
  data,
  unit,
  yMin = 0,
  yMax,
  yTicks,
  label,
}: {
  data: MonthPoint[];
  unit: Unit;
  yMin?: number;
  yMax: number;
  yTicks: number[];
  label: string;
}) {
  const format = (v: number) => fmt(unit, v);
  const W = 1000;
  const H = 380;
  const P = { l: 58, r: 24, t: 20, b: 46 };
  const x = (i: number) => P.l + (i / (data.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => H - P.b - ((v - yMin) / (yMax - yMin)) * (H - P.t - P.b);

  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const show = inView || !!reduce;
  const [hi, setHi] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");

  const paths = useMemo(
    () =>
      SERIES.map((s) => {
        const pts = data.map((d, i) => ({ x: x(i), y: y(d[s.key]) }));
        const line = smoothPath(pts, 0.35);
        return { ...s, line, area: `${line} L ${x(data.length - 1)} ${H - P.b} L ${x(0)} ${H - P.b} Z` };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, yMin, yMax]
  );

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - P.l) / (W - P.l - P.r)) * (data.length - 1));
    setHi(Math.max(0, Math.min(data.length - 1, i)));
  };

  const active = hi ?? data.length - 1;
  const tipRight = x(active) > W * 0.62;

  return (
    <div className="relative">
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.88rem] text-ink-2">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHi(null)}
        role="img"
        aria-label={label}
      >
        <defs>
          {SERIES.map((s) => (
            <linearGradient key={s.key} id={`${gid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.14" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {yTicks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray={t !== yMin ? "3 6" : undefined} />
            <text x={P.l - 12} y={y(t) + 4} textAnchor="end" className="fill-mute font-mono text-[12px]">
              {fmt(unit, t, true)}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text
            key={d.date}
            x={x(i)}
            y={H - 14}
            textAnchor="middle"
            className={`font-mono text-[12px] ${i === active && hi !== null ? "fill-ink" : "fill-mute"}`}
          >
            {i % 2 === 0 || i === data.length - 1 ? shortMonth(d.date) : ""}
          </text>
        ))}

        <line
          x1={x(active)}
          x2={x(active)}
          y1={P.t}
          y2={H - P.b}
          stroke="var(--ink)"
          strokeOpacity={hi === null ? 0 : 0.25}
          strokeDasharray="4 4"
          style={{ transition: "stroke-opacity 0.3s" }}
        />

        {paths.map((s, k) => (
          <g key={s.key}>
            <motion.path
              d={s.area}
              fill={`url(#${gid}-${s.key})`}
              initial={{ opacity: reduce ? 1 : 0 }}
              animate={show ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 + k * 0.15 }}
            />
            <motion.path
              d={s.line}
              fill="none"
              stroke={s.color}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={show ? { pathLength: 1 } : {}}
              transition={{ duration: 1.8, ease: EASE, delay: 0.15 + k * 0.2 }}
            />
            {data.map((d, i) => (
              <motion.circle
                key={i}
                cx={x(i)}
                cy={y(d[s.key])}
                r={i === active && hi !== null ? 6.5 : 3.5}
                fill={i === active && hi !== null ? "var(--surface-2)" : s.color}
                stroke={s.color}
                strokeWidth={i === active && hi !== null ? 3 : 0}
                initial={{ opacity: reduce ? 1 : 0 }}
                animate={show ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.07 + k * 0.1 }}
                style={{ transition: "r 0.25s" }}
              />
            ))}
          </g>
        ))}
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 w-[190px] rounded-2xl border border-line bg-surface-2 p-3.5 shadow-[var(--shadow-float)] transition-[left,opacity] duration-300 ease-[var(--ease-out-soft)]"
        style={{
          left: `calc(${(x(active) / W) * 100}% ${tipRight ? "- 206px" : "+ 16px"})`,
          opacity: hi === null ? 0 : 1,
        }}
      >
        <p className="text-[0.86rem] font-semibold text-ink">{data[active].date}</p>
        {SERIES.map((s) => (
          <p key={s.key} className="mt-2 flex items-center justify-between text-[0.84rem] text-ink-2">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="tabular font-semibold text-ink">{format(data[active][s.key])}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   State tile map — a square per state on a geographic grid, shaded by value.
   ========================================================================= */

const shade = (t: number) => {
  const L = 0.94 - t * 0.6;
  const C = 0.03 + t * 0.05;
  const H = 165 + t * 35;
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
};

export function StateTileMap({ data, unit, label }: { data: StatePoint[]; unit: Unit; label: string }) {
  const format = (v: number) => fmt(unit, v);
  const S = 60;
  const G = 6;
  const W = 11 * (S + G);
  const H = 8 * (S + G);
  const byAbbr = useMemo(() => {
    const m: Record<string, StatePoint> = {};
    for (const d of data) m[STATE_ABBR[d.state]] = d;
    return m;
  }, [data]);
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const t = (v: number) => (v - min) / (max - min);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const show = inView || !!reduce;
  const [hover, setHover] = useState<string | null>(null);
  const hovered = hover ? byAbbr[hover] : null;
  const names = useMemo(() => Object.fromEntries(Object.entries(STATE_ABBR).map(([n, a]) => [a, n])), []);

  return (
    <div ref={ref}>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={label}>
          {Object.entries(TILE_GRID).map(([abbr, [cx, cy]]) => {
            const d = byAbbr[abbr];
            const tv = d ? t(d.value) : 0;
            const dark = d && tv > 0.45;
            const on = hover === abbr;
            return (
              <motion.g
                key={abbr}
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 + cx * 0.05 + cy * 0.025 }}
                onPointerEnter={() => setHover(abbr)}
                onPointerLeave={() => setHover((h) => (h === abbr ? null : h))}
                onFocus={() => setHover(abbr)}
                onBlur={() => setHover((h) => (h === abbr ? null : h))}
                tabIndex={d ? 0 : -1}
                aria-label={d ? `${d.state}: ${format(d.value)}` : `${names[abbr]}: no data`}
                className="outline-none"
              >
                <rect
                  x={cx * (S + G)}
                  y={cy * (S + G)}
                  width={S}
                  height={S}
                  rx="10"
                  fill={d ? shade(tv) : "var(--surface)"}
                  stroke={on ? "var(--ink)" : d ? "transparent" : "var(--line-strong)"}
                  strokeWidth={on ? 2.5 : 1}
                  strokeDasharray={d ? undefined : "3 3"}
                  style={{ transition: "stroke 0.2s" }}
                />
                <text
                  x={cx * (S + G) + S / 2}
                  y={cy * (S + G) + 27}
                  textAnchor="middle"
                  className="text-[14px] font-bold"
                  fill={dark ? "var(--on-deep)" : d ? "var(--ink)" : "var(--mute)"}
                >
                  {abbr}
                </text>
                <text
                  x={cx * (S + G) + S / 2}
                  y={cy * (S + G) + 45}
                  textAnchor="middle"
                  className="font-mono text-[10px]"
                  fill={dark ? "var(--on-deep-mute)" : "var(--mute)"}
                >
                  {d ? format(d.value) : "n/a"}
                </text>
              </motion.g>
            );
          })}
        </svg>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 min-w-[180px] rounded-2xl border border-line bg-surface-2 px-4 py-3 shadow-[var(--shadow-float)] transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <p className="text-[0.86rem] text-mute">{hovered?.state ?? " "}</p>
          <p className="tabular text-[1.6rem] font-bold leading-tight text-ink">{hovered ? format(hovered.value) : " "}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <span className="tabular font-mono text-[0.78rem] text-mute">{format(min)}</span>
        <span
          className="h-2.5 flex-1 rounded-full"
          style={{ background: `linear-gradient(90deg, ${shade(0)}, ${shade(0.5)}, ${shade(1)})` }}
        />
        <span className="tabular font-mono text-[0.78rem] text-mute">{format(max)}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   State-by-state bars, sorted high to low, in two balanced columns.
   ========================================================================= */

export function StateBars({ data, unit }: { data: StatePoint[]; unit: Unit }) {
  const format = (v: number) => fmt(unit, v);
  const sorted = useMemo(() => [...data].sort((a, b) => b.value - a.value), [data]);
  const max = sorted[0].value;
  const half = Math.ceil(sorted.length / 2);
  const cols = [sorted.slice(0, half), sorted.slice(half)];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const show = inView || !!reduce;

  return (
    <div ref={ref} className="grid gap-x-12 gap-y-0 md:grid-cols-2">
      {cols.map((col, c) => (
        <ol key={c} className="flex flex-col">
          {col.map((d, i) => {
            const rank = c * half + i + 1;
            return (
              <li key={d.state} className="grid grid-cols-[2rem_8.5rem_1fr_3.5rem] items-center gap-3 border-b border-line py-2.5 text-[0.92rem]">
                <span className="tabular font-mono text-[0.74rem] text-mute">{String(rank).padStart(2, "0")}</span>
                <span className="truncate font-medium text-ink">{d.state}</span>
                <span className="h-2 overflow-hidden rounded-full bg-mist-2">
                  <motion.span
                    className="block h-full origin-left rounded-full"
                    style={{ background: shade((d.value - sorted[sorted.length - 1].value) / (max - sorted[sorted.length - 1].value)) }}
                    initial={{ scaleX: reduce ? d.value / max : 0 }}
                    animate={show ? { scaleX: d.value / max } : {}}
                    transition={{ duration: 1, ease: EASE, delay: 0.05 + rank * 0.015 }}
                  />
                </span>
                <span className="tabular text-right font-semibold text-ink">{format(d.value)}</span>
              </li>
            );
          })}
        </ol>
      ))}
    </div>
  );
}

/* =========================================================================
   Highlights and the email gate.
   ========================================================================= */

export function Highlights({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-10 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
      {items.map((h) => (
        <li key={h} className="flex items-start gap-3.5 border-t border-line py-4 text-[0.98rem] leading-relaxed text-ink-2">
          <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-ink">
            <Check width={11} height={11} />
          </span>
          {h}
        </li>
      ))}
    </ul>
  );
}

const GATE_KEY = "stable-insights-unlocked";

/** Blurs its content until the reader leaves an email, as on stable.auto. */
export function EmailGate({ children, title }: { children: ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const id = useId();

  useEffect(() => {
    if (window.localStorage.getItem(GATE_KEY) === "1") setOpen(true);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(true);
      return;
    }
    // TODO: post to the HubSpot form behind this gate on stable.auto.
    window.localStorage.setItem(GATE_KEY, "1");
    setOpen(true);
  };

  return (
    <div className="relative">
      <div
        className="transition-[filter,opacity] duration-700"
        style={open ? undefined : { filter: "blur(7px)", opacity: 0.55, pointerEvents: "none", userSelect: "none" }}
        aria-hidden={!open}
      >
        {children}
      </div>
      {!open ? (
        <div className="absolute inset-0 grid place-items-center p-4">
          <form
            onSubmit={submit}
            noValidate
            className="w-full max-w-[420px] rounded-[24px] border border-line bg-surface-2 p-6 text-center shadow-[var(--shadow-float)] sm:p-8"
          >
            <p className="font-display text-[1.3rem] font-semibold tracking-[-0.015em] text-ink">{title}</p>
            <label htmlFor={id} className="sr-only">
              Work email
            </label>
            <input
              id={id}
              type="email"
              autoComplete="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              aria-invalid={error}
              className="input mt-5"
            />
            <button type="submit" className="btn mt-3 w-full justify-center !pr-7">
              Unlock the state data
            </button>
            <p role="alert" className={`mt-3 text-[0.86rem] text-[oklch(0.5_0.16_30)] ${error ? "" : "hidden"}`}>
              Enter a valid email address, like name@company.com.
            </p>
          </form>
        </div>
      ) : null}
    </div>
  );
}
