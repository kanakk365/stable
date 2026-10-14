// Product data for the Evaluate and Operate hero views, read off Stable's
// own product screenshots on stable.auto (the Evaluate "Sites" view and the
// Operate pricing-guidance view). Bar heights are read off those charts.

/* ---- Evaluate: Sites ---------------------------------------------------- */

export type SitePin = { lon: number; lat: number };

/** Pins shown on the Sites map. */
export const SITE_PINS: SitePin[] = [
  { lon: -122.42, lat: 37.77 }, // San Francisco
  { lon: -122.33, lat: 37.84 }, // San Francisco (Webster St)
  { lon: -121.87, lat: 37.37 }, // San Jose
  { lon: -121.66, lat: 36.68 },
  { lon: -111.89, lat: 40.76 }, // Salt Lake City
  { lon: -111.75, lat: 39.25 },
  { lon: -106.65, lat: 35.08 }, // Albuquerque
  { lon: -106.78, lat: 32.31 },
  { lon: -92.29, lat: 34.75 },
  { lon: -90.05, lat: 35.15 }, // Memphis
  { lon: -89.82, lat: 34.96 },
  { lon: -87.63, lat: 41.88 }, // Chicago
  { lon: -87.8, lat: 42.05 },
];

export type SiteRow = {
  address: string;
  city: string;
  project: "Safeway" | "Whole Foods";
  chargers: string;
  utilization: number;
  /** Index into SITE_PINS. */
  pin: number;
};

export const SITE_ROWS: SiteRow[] = [
  { address: "Safeway, Berryessa Road", city: "San Jose, CA", project: "Safeway", chargers: "6×150kW", utilization: 34.7, pin: 2 },
  { address: "450 Rhode Island St", city: "San Francisco, CA", project: "Whole Foods", chargers: "4×150kW", utilization: 32.8, pin: 0 },
  { address: "1335 Webster St", city: "San Francisco, CA", project: "Safeway", chargers: "6×150kW", utilization: 34.3, pin: 1 },
  { address: "1131 E Wilmington Ave", city: "Salt Lake City, UT", project: "Whole Foods", chargers: "6×150kW", utilization: 22.7, pin: 4 },
];

/* ---- Operate: revenue performance and price adjustments --------------- */

export const REVENUE = {
  period: "May 1, 2024 – Jul 1, 2024",
  total: 72657,
  netRevenue: [3100, 4300, 3950, 3950, 4300, 3950, 4300, 4600, 4900, 4600, 4900, 5150, 6300, 6300, 6300, 6050, 6300],
  customers: [375, 395, 375, 395, 375, 395, 335, 375, 320, 335, 360, 335, 410, 395, 410, 395, 375],
  energy: [11500, 12800, 11500, 12200, 12800, 12800, 12200, 13500, 12200, 11500, 12200, 12800, 13500, 13500, 13500, 12200, 12800],
};

export const PRICE_ADJUSTMENTS = {
  next: "Aug 9, 2024 · 19:00 PT",
  increasing: 145,
  decreasing: 49,
  unchanged: 123,
  rows: [
    { site: "45 Rhode Island St", city: "San Francisco, CA", account: "Wells Development LLC", current: 0.62, next: 0.73 },
    { site: "176 California St", city: "San Francisco, CA", account: "Kriyo Management Group", current: 0.22, next: 0.45 },
    { site: "131 E Wilmington Ave", city: "Salt Lake City, UT", account: "Whole Foods", current: 0.63, next: 0.5 },
    { site: "69 Stanyan St", city: "San Francisco, CA", account: "City of SF", current: 0.62, next: 0.62 },
  ],
};
