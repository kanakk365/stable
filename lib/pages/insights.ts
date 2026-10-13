// Stable Insights: copy and data from the live Utilization and Pricing
// Trends pages. Monthly and state series are the figures those pages chart
// (stations tracked by Stable Auto, non-Tesla L2 and L3 chargers).

export type MonthPoint = { date: string; l2: number; dcfc: number };
export type StatePoint = { state: string; value: number };

export const UPDATED = "Last updated Oct 24, 2025";

/* ---- Utilization -------------------------------------------------------- */

export const utilizationMonthly: MonthPoint[] = [
  { date: "July, 2024", l2: 11.1, dcfc: 11 },
  { date: "August, 2024", l2: 10.2, dcfc: 12.1 },
  { date: "September, 2024", l2: 10.7, dcfc: 12.6 },
  { date: "October, 2024", l2: 12.6, dcfc: 13.3 },
  { date: "November, 2024", l2: 13.2, dcfc: 14.3 },
  { date: "December, 2024", l2: 12.3, dcfc: 16 },
  { date: "January, 2025", l2: 12.4, dcfc: 15.6 },
  { date: "February, 2025", l2: 13, dcfc: 15 },
  { date: "March, 2025", l2: 14.9, dcfc: 13.9 },
  { date: "April, 2025", l2: 12.6, dcfc: 13 },
  { date: "May, 2025", l2: 12.7, dcfc: 12.4 },
  { date: "June, 2025", l2: 14.6, dcfc: 12.9 },
];

/** Average DCFC utilization by state, Q2 '25 (fraction). */
export const utilizationByState: StatePoint[] = [
  { state: "Alabama", value: 0.033 }, { state: "Arkansas", value: 0.06 }, { state: "Arizona", value: 0.174 },
  { state: "California", value: 0.224 }, { state: "Colorado", value: 0.11 }, { state: "Connecticut", value: 0.11 },
  { state: "Delaware", value: 0.097 }, { state: "Florida", value: 0.184 }, { state: "Georgia", value: 0.097 },
  { state: "Iowa", value: 0.032 }, { state: "Idaho", value: 0.046 }, { state: "Illinois", value: 0.13 },
  { state: "Indiana", value: 0.069 }, { state: "Kansas", value: 0.074 }, { state: "Kentucky", value: 0.048 },
  { state: "Louisiana", value: 0.058 }, { state: "Massachusetts", value: 0.101 }, { state: "Maryland", value: 0.176 },
  { state: "Maine", value: 0.046 }, { state: "Michigan", value: 0.088 }, { state: "Minnesota", value: 0.044 },
  { state: "Missouri", value: 0.058 }, { state: "Mississippi", value: 0.035 }, { state: "Montana", value: 0.032 },
  { state: "North Carolina", value: 0.111 }, { state: "North Dakota", value: 0.013 }, { state: "Nebraska", value: 0.044 },
  { state: "New Hampshire", value: 0.073 }, { state: "New Jersey", value: 0.146 }, { state: "New Mexico", value: 0.033 },
  { state: "Nevada", value: 0.233 }, { state: "New York", value: 0.13 }, { state: "Ohio", value: 0.067 },
  { state: "Oklahoma", value: 0.032 }, { state: "Oregon", value: 0.096 }, { state: "Pennsylvania", value: 0.102 },
  { state: "Rhode Island", value: 0.098 }, { state: "South Carolina", value: 0.074 }, { state: "South Dakota", value: 0.021 },
  { state: "Tennessee", value: 0.057 }, { state: "Texas", value: 0.115 }, { state: "Utah", value: 0.08 },
  { state: "Virginia", value: 0.146 }, { state: "Vermont", value: 0.069 }, { state: "Washington", value: 0.137 },
  { state: "Wisconsin", value: 0.056 }, { state: "West Virginia", value: 0.028 }, { state: "Wyoming", value: 0.056 },
];

export const utilization = {
  hero: {
    eyebrow: "Stable Insights",
    title: "EV Charging Utilization Trends",
    emphasis: ["Utilization"],
    sub: "Explore high-quality data on national EV charging station utilization",
  },
  overview: [
    "With access to one of the most comprehensive EV charging utilization datasets in North America, covering tens of thousands of Level 2 and Level 3 (DCFC) chargers, Stable tracks how charging behavior and performance are evolving across the market.",
    "Recent data shows that while average utilization has started to level off, overall charging demand continues to grow as networks expand and session power increases. Prices have also continued to rise and stabilize nationwide, narrowing the fuel-cost advantage of EVs in some regions.",
    "To illustrate these shifts, Stable has compiled an updated analysis of utilization and pricing trends across thousands of non-Tesla Level 2 and Level 3 chargers nationwide.",
  ],
  keyFigures: [
    { value: "+16%", label: "L3 (DCFC) utilization, Jul ’24 → Jun ’25" },
    { value: "+32%", label: "L2 (AC) utilization over the same period" },
    { value: "+25%", label: "Overall L3 charger usage growth" },
  ],
  monthly: {
    title: "National charging utilization by month",
    highlights: [
      "Utilization data reveals that DCFCs, once deemed poor investments due to low utilization, are now becoming profitable across many US states",
      "L3 (DCFC) utilization is up 16% since last summer, growing from an average of 11.0% in July 2024 to 12.9% in June 2025",
      "L2 (AC) utilization grew more steadily, growing 32% from an average of 11.1% in July 2024 to 14.6% in June 2025",
      "While L2 utilization continued to grow over the course of the last year, L3 utilization peaked last winter with increased supply and faster average charging speeds driving down utilization in the first half of 2025",
      "Demand for L3 chargers continued to grow with overall charger usage growing 25% from July 2024 to June 2025 accounting for a 17% growth in the number of chargers over that time period",
      "Average utilization decreasing slightly in the first half of 2025 indicates charging infrastructure is finally catching up to demand, though there are still many states with high average utilization",
    ],
  },
  states: {
    title: "Average DCFC utilization by state (Q2 ’25)",
    sub: "The average estimated utilization for Level 3 (DCFC) chargers by stations tracked by Stable Auto",
    highlights: [
      "High average utilization rates across the country show EV adoption is growing beyond major cities and coastal areas and growth appears to be fastest outside the areas that already lead in charging",
      "While demand growth was relatively even across the country account for station growth, utilization growth was concentrated in states that previously had below average utilization increasing 8% in states that had utilization <10% in 2024 while it decreased 2% on average in states that had utilization >10%",
      "While most states saw utilization increase between Q3’24 and Q2’25, 10 states saw utilization decrease, even as overall charging increased, driven by new stations opening in those states",
      "Although these utilization averages do not reflect the number of chargers in each state, utilization rates highlight the growing demand for EV charging, underscoring the need for extensive infrastructure development",
    ],
  },
};

/* ---- Pricing ------------------------------------------------------------ */

export const pricingMonthly: MonthPoint[] = [
  { date: "July, 2024", l2: 0.26, dcfc: 0.46 },
  { date: "August, 2024", l2: 0.25, dcfc: 0.46 },
  { date: "September, 2024", l2: 0.23, dcfc: 0.45 },
  { date: "October, 2024", l2: 0.23, dcfc: 0.43 },
  { date: "November, 2024", l2: 0.23, dcfc: 0.43 },
  { date: "December, 2024", l2: 0.23, dcfc: 0.43 },
  { date: "January, 2025", l2: 0.23, dcfc: 0.43 },
  { date: "February, 2025", l2: 0.23, dcfc: 0.43 },
  { date: "March, 2025", l2: 0.23, dcfc: 0.43 },
  { date: "April, 2025", l2: 0.24, dcfc: 0.44 },
  { date: "May, 2025", l2: 0.25, dcfc: 0.44 },
  { date: "June, 2025", l2: 0.25, dcfc: 0.47 },
];

/** Average DCFC price by state, Q2 '25 ($/kWh). */
export const pricingByState: StatePoint[] = [
  { state: "Alabama", value: 0.43 }, { state: "Arkansas", value: 0.42 }, { state: "Arizona", value: 0.49 },
  { state: "California", value: 0.5 }, { state: "Colorado", value: 0.45 }, { state: "Connecticut", value: 0.51 },
  { state: "Delaware", value: 0.4 }, { state: "Florida", value: 0.45 }, { state: "Georgia", value: 0.45 },
  { state: "Iowa", value: 0.26 }, { state: "Idaho", value: 0.41 }, { state: "Illinois", value: 0.47 },
  { state: "Indiana", value: 0.46 }, { state: "Kansas", value: 0.31 }, { state: "Kentucky", value: 0.53 },
  { state: "Louisiana", value: 0.59 }, { state: "Massachusetts", value: 0.46 }, { state: "Maryland", value: 0.41 },
  { state: "Maine", value: 0.57 }, { state: "Michigan", value: 0.42 }, { state: "Minnesota", value: 0.29 },
  { state: "Missouri", value: 0.36 }, { state: "Mississippi", value: 0.43 }, { state: "Montana", value: 0.29 },
  { state: "North Carolina", value: 0.42 }, { state: "North Dakota", value: 0.28 }, { state: "Nebraska", value: 0.24 },
  { state: "New Hampshire", value: 0.49 }, { state: "New Jersey", value: 0.48 }, { state: "New Mexico", value: 0.38 },
  { state: "Nevada", value: 0.47 }, { state: "New York", value: 0.49 }, { state: "Ohio", value: 0.43 },
  { state: "Oklahoma", value: 0.5 }, { state: "Oregon", value: 0.39 }, { state: "Pennsylvania", value: 0.51 },
  { state: "Rhode Island", value: 0.48 }, { state: "South Carolina", value: 0.5 }, { state: "South Dakota", value: 0.42 },
  { state: "Tennessee", value: 0.49 }, { state: "Texas", value: 0.49 }, { state: "Utah", value: 0.35 },
  { state: "Virginia", value: 0.41 }, { state: "Vermont", value: 0.37 }, { state: "Washington", value: 0.39 },
  { state: "Wisconsin", value: 0.44 }, { state: "West Virginia", value: 0.5 }, { state: "Wyoming", value: 0.36 },
];

export const pricing = {
  hero: {
    eyebrow: "Stable Insights",
    title: "EV Charging Pricing Trends",
    emphasis: ["Pricing"],
    sub: "Explore high-quality data on national EV charging station pricing",
  },
  overview: [
    "Stable Auto has played a pivotal role in evaluating and siting over 16,000 EV charging stations throughout the United States. Through this experience, it’s evident that the pricing strategies of EV charging stations significantly influences both the economic sustainability of stations and the satisfaction of EV drivers.",
    "With the anticipated growth in EV ownership, the demand for public charging facilities is set to rise sharply, partly due to limitations of home charging solutions. To prepare for this growth, it’s important that EV charging station owners and operators adopt strategic pricing that not only ensures the viability of the EV charging industry, but also meets the diverse needs of consumers.",
    "In an effort to shed light on the current state of pricing within the DC fast charging (DCFC) landscape, Stable Auto conducted a comprehensive analysis of the average costs associated with EV charging across the nation, drawing on data from thousands of Level 3 (L3) charging stations under its purview.",
  ],
  keyFigures: [
    { value: "$0.47", label: "Average DCFC price per kWh, June 2025" },
    { value: "$0.25", label: "Average L2 price per kWh, June 2025" },
    { value: "28", label: "States averaging $0.40–$0.50 per kWh" },
  ],
  monthly: {
    title: "National average charging prices by month",
    sub: "The average estimated $/kWh price of charging at public Level 3 (DCFC) and Level 2 (AC) at stations tracked by Stable Auto",
    highlights: [
      "Unlike gas stations, pricing at EV chargers remained remarkably steady over the last year with DCFC prices increasing 1¢ and L2 prices decreasing 1¢ respectively from July 2024 to June 2025",
      "L2 chargers were on average 53% cheaper than L3 chargers over the course of 2024 with that discount holding relatively steady even as prices at both increased slightly",
      "Both L2 and DCFC chargers showed seasonal patterns over the course of the last year, declining on average 3¢ in the winter months from summer peaks",
    ],
  },
  states: {
    title: "Average DCFC charging prices by state (Q2 ’25)",
    sub: "The average estimated $/kWh cost for Level 3 (DCFC) charged by stations tracked by Stable Auto",
    highlights: [
      "Most EV drivers charge their vehicles at home, but those using public DCFCs encounter significantly different prices depending on where they plug in",
      "Comparing prices from December to June, both DC and L2 prices increased 9% on average to $0.47 / kWh for DCFC and $0.25 for L2 chargers",
      "Comparing to July 2024 to June 2025 prices were remarkably steady with prices increasing just 1¢ on average for DCFC and decreasing 1¢ on average for L2",
      "While gas prices can vary significantly by state, charging prices tend to be more consistent across the country, with 28 states averaging between $0.40 and $0.50 per kWh.",
      "The midwest and northwest remain the exception where DCFC remains below $0.40 / kWh in most states",
      "The number of states with average prices >$0.50 increased from 3 at the end of last year to 7 in Q2 of this year as average prices have continued to rise",
    ],
  },
  bars: { title: "State-by-state view" },
};

/* ---- Tile-grid positions for the state map (column, row) --------------- */

export const STATE_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT",
  Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI",
  Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH",
  "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH",
  Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
  Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

export const TILE_GRID: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0],
  VT: [9, 1], NH: [10, 1],
  WA: [0, 2], ID: [1, 2], MT: [2, 2], ND: [3, 2], MN: [4, 2], IL: [5, 2], WI: [6, 2], MI: [7, 2], NY: [8, 2], RI: [9, 2], MA: [10, 2],
  OR: [0, 3], NV: [1, 3], WY: [2, 3], SD: [3, 3], IA: [4, 3], IN: [5, 3], OH: [6, 3], PA: [7, 3], NJ: [8, 3], CT: [9, 3],
  CA: [0, 4], UT: [1, 4], CO: [2, 4], NE: [3, 4], MO: [4, 4], KY: [5, 4], WV: [6, 4], VA: [7, 4], MD: [8, 4], DE: [9, 4],
  AZ: [1, 5], NM: [2, 5], KS: [3, 5], AR: [4, 5], TN: [5, 5], NC: [6, 5], SC: [7, 5],
  OK: [3, 6], LA: [4, 6], MS: [5, 6], AL: [6, 6], GA: [7, 6],
  HI: [0, 7], TX: [3, 7], FL: [8, 7],
};
