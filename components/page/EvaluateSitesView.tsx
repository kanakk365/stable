"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { KX, LAT0, LAT1, LON0, LON1, MAP_ASPECT, US } from "@/components/fx/DotMap";
import { r } from "@/lib/chart";
import { SITE_PINS, SITE_ROWS } from "@/lib/pages/app-views";

import { AppWindow } from "./AppWindow";

/*
 * Evaluate's "Sites" view, rebuilt from Stable's product screenshot: a
 * vector map of candidate sites beside the sites table. The highlighted row
 * moves slowly down the table and its pin answers on the map.
 */

const MW = 600;
const MH = r(MW / MAP_ASPECT);
const px = (lon: number) => r(((lon - LON0) / (LON1 - LON0)) * MW);
const py = (lat: number) => r(((LAT1 - lat) / (LAT1 - LAT0)) * MH);
const OUTLINE = `M ${US.map(([lon, lat]) => `${px(lon)} ${py(lat)}`).join(" L ")} Z`;
const GRID_LON = [-120, -110, -100, -90, -80, -70];
const GRID_LAT = [30, 35, 40, 45];
void KX;

const GLIDE = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };
const EASE_CSS = "cubic-bezier(0.65,0,0.35,1)";

const PROJECT_STYLE = {
  Safeway: "bg-cobalt/12 text-cobalt",
  "Whole Foods": "bg-accent/15 text-accent-ink",
} as const;

export function EvaluateSitesView() {
  const reduce = useReducedMotion();
  const [sel, setSel] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (reduce || held) return;
    const t = setInterval(() => setSel((v) => (v + 1) % SITE_ROWS.length), 3600);
    return () => clearInterval(t);
  }, [reduce, held]);

  const selRow = SITE_ROWS[sel];
  const selPin = selRow.pin;

  return (
    <AppWindow section="Evaluate · Sites" label="Stable Evaluate: a map of candidate charging sites beside the sites table">
      <div className="grid min-w-0 lg:grid-cols-[0.9fr_1.1fr] [&>*]:min-w-0">
        {/* Map */}
        <div className="flex flex-col border-b border-line lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 pb-1 pt-4">
            <p className="text-[0.9rem] font-semibold text-ink">Map</p>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[0.72rem] text-ink-2">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
                <circle cx="8" cy="8" r="2" />
              </svg>
              Sites layer
            </span>
          </div>
          <div className="flex flex-1 items-center px-4 pb-4 pt-2">
            <svg viewBox={`-10 -10 ${MW + 20} ${MH + 20}`} className="block h-auto w-full" role="img" aria-label="Map of the United States with charging sites in California, Utah, New Mexico, Arkansas, Tennessee and Illinois.">
              <defs>
                <clipPath id="us-land">
                  <path d={OUTLINE} />
                </clipPath>
              </defs>
              <path d={OUTLINE} fill="var(--mist-2)" stroke="var(--line-strong)" strokeWidth="1.2" strokeLinejoin="round" />
              <g clipPath="url(#us-land)" stroke="var(--surface-2)" strokeWidth="1.2">
                {GRID_LON.map((lon) => (
                  <line key={lon} x1={px(lon)} x2={px(lon)} y1={0} y2={MH} />
                ))}
                {GRID_LAT.map((lat) => (
                  <line key={lat} x1={0} x2={MW} y1={py(lat)} y2={py(lat)} />
                ))}
              </g>

              {SITE_PINS.map((p, i) => {
                const on = i === selPin;
                const x = px(p.lon);
                const y = py(p.lat);
                return (
                  <motion.g
                    key={i}
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 1.1 + i * 0.05 }}
                  >
                    <g style={{ opacity: on ? 1 : 0, transition: `opacity 0.9s ${EASE_CSS}` }}>
                      <circle cx={x} cy={y} r="11" fill="var(--accent)" className="pulse-ring" />
                    </g>
                    <circle
                      cx={x}
                      cy={y}
                      r={on ? 7.5 : 5}
                      fill={on ? "var(--deep)" : "var(--surface-2)"}
                      stroke={on ? "var(--mint)" : "var(--accent)"}
                      strokeWidth={on ? 3 : 2.2}
                      style={{ transition: `r 0.9s ${EASE_CSS}, fill 0.9s ${EASE_CSS}, stroke 0.9s ${EASE_CSS}` }}
                    />
                  </motion.g>
                );
              })}
            </svg>
          </div>
          {/* The selected site, echoed under the map */}
          <div className="flex items-center gap-3 border-t border-line bg-surface px-5 py-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-deep ring-[3px] ring-mint/60" aria-hidden="true" />
            <span className="relative min-w-0 flex-1 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={selRow.address}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.6, ease: GLIDE.ease }}
                  className="block truncate text-[0.82rem] text-ink-2"
                >
                  <span className="font-semibold text-ink">{selRow.address}</span> · {selRow.city}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="data-label hidden shrink-0 sm:inline">{SITE_PINS.length} sites · 6 states</span>
          </div>
        </div>

        {/* Sites table */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-3 pt-4">
            <div>
              <p className="text-[1.05rem] font-semibold text-ink">Sites</p>
              <p className="text-[0.8rem] text-mute">View and manage your charging sites</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-deep px-3 py-1.5 text-[0.78rem] font-semibold text-on-deep">
              Create site
              <span aria-hidden="true" className="text-mint">+</span>
            </span>
          </div>
          <table className="w-full text-left" onPointerLeave={() => setHeld(false)}>
            <thead>
              <tr className="border-y border-line bg-surface text-[0.7rem] text-mute">
                <th className="px-5 py-2 font-medium">Site</th>
                <th className="hidden px-2 py-2 font-medium sm:table-cell">Project</th>
                <th className="hidden px-2 py-2 font-medium md:table-cell">Chargers</th>
                <th className="px-5 py-2 text-right font-medium">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {SITE_ROWS.map((row, i) => {
                const on = i === sel;
                return (
                  <motion.tr
                    key={row.address}
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 1.3 + i * 0.08 }}
                    onPointerEnter={() => {
                      setSel(i);
                      setHeld(true);
                    }}
                    className="cursor-default border-b border-line last:border-b-0"
                    style={{ background: on ? "oklch(0.675 0.132 168 / 0.08)" : "transparent", transition: `background 0.9s ${EASE_CSS}` }}
                  >
                    <td className="w-full max-w-0 px-5 py-3">
                      <span className="block truncate text-[0.86rem] font-semibold text-ink">{row.address}</span>
                      <span className="block text-[0.74rem] text-mute">{row.city}</span>
                    </td>
                    <td className="hidden px-2 py-3 sm:table-cell">
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.66rem] font-bold uppercase tracking-[0.04em] ${PROJECT_STYLE[row.project]}`}>
                        {row.project}
                      </span>
                    </td>
                    <td className="tabular hidden whitespace-nowrap px-2 py-3 text-[0.82rem] text-ink-2 md:table-cell">{row.chargers}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      <span className="tabular text-[0.95rem] font-bold text-ink">{row.utilization.toFixed(1)}%</span>
                      <span className="ml-auto mt-1.5 block h-1 w-16 overflow-hidden rounded-full bg-mist-2">
                        <motion.span
                          className="block h-full origin-left rounded-full bg-accent"
                          initial={{ scaleX: reduce ? row.utilization / 40 : 0 }}
                          animate={{ scaleX: row.utilization / 40 }}
                          transition={{ ...GLIDE, delay: reduce ? 0 : 1.6 + i * 0.08 }}
                        />
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppWindow>
  );
}
