// Product data for the hero stage, in the vocabulary of Stable's own UI:
// candidate sites with a charger mix, a utilization forecast, and the
// energy / peak / average demand summary. Site A carries the figures from
// Stable's demo site (57,821 kWh, 429 kW peak, 72 kW average).

export type Candidate = {
  id: string;
  mix: string;
  x: number;
  y: number;
  util: number;
  energy: number;
  peak: number;
  avg: number;
};

export const CANDIDATES: Candidate[] = [
  { id: "A", mix: "4 × 150 kW · 2 × 22 kW", x: 246, y: 232, util: 18.4, energy: 57821, peak: 429, avg: 72 },
  { id: "B", mix: "6 × 150 kW", x: 404, y: 112, util: 21.3, energy: 74210, peak: 512, avg: 94 },
  { id: "C", mix: "4 × 150 kW", x: 338, y: 188, util: 15.1, energy: 41380, peak: 336, avg: 55 },
  { id: "D", mix: "2 × 150 kW · 4 × 22 kW", x: 182, y: 344, util: 11.6, energy: 26623, peak: 300, avg: 41 },
];

/** Unscored parcels — the rest of the scan. */
export const PARCELS = [
  { x: 92, y: 88 },
  { x: 474, y: 246 },
  { x: 516, y: 372 },
  { x: 58, y: 236 },
  { x: 304, y: 384 },
  { x: 446, y: 54 },
  { x: 150, y: 168 },
  { x: 520, y: 150 },
  { x: 372, y: 300 },
];

export const MONTHS = 36;
export const MARKET_END = 12.2;

/** Ramp-up curve with a seasonal ripple, pinned to the candidate's year-3 figure. */
export function forecastSeries(end: number, phase = 0.6): number[] {
  const raw = Array.from({ length: MONTHS }, (_, m) => {
    const ramp = 1 - Math.exp(-m / 11);
    return 3.6 + 14.2 * ramp + 0.9 * Math.sin((m / 12) * Math.PI * 2 + phase) * ramp;
  });
  const last = raw[MONTHS - 1];
  return raw.map((v) => 3.6 + ((v - 3.6) * (end - 3.6)) / (last - 3.6));
}

export function marketSeries(): number[] {
  const raw = Array.from({ length: MONTHS }, (_, m) => 3 + 9.2 * (1 - Math.exp(-m / 15)));
  const last = raw[MONTHS - 1];
  return raw.map((v) => 3 + ((v - 3) * (MARKET_END - 3)) / (last - 3));
}
