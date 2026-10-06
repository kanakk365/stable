// Copy for the Stable Auto home page, taken section by section from
// stable.auto. Links to pages we haven't rebuilt yet point at the live site:
// the pages it currently serves (PAGE) where one exists, otherwise the
// original site's own link.

const LIVE = "https://stable.auto";
const PAGE = {
  about: `${LIVE}/About%20Stable%20Auto.html`,
  careers: `${LIVE}/Careers%20at%20Stable%20Auto.html`,
  evaluate: `${LIVE}/Stable%20Product%20%E2%80%94%20Evaluate.html`,
  operate: `${LIVE}/Stable%20Product%20%E2%80%94%20Operate.html`,
  utilization: `${LIVE}/Stable%20Insights_%20EV%20Charging%20Utilization%20Trends.html`,
  pricing: `${LIVE}/Stable%20Insights_%20EV%20Charging%20Pricing%20Trends.html`,
};

export const insightsHref = PAGE.utilization;

export type NavLink = { label: string; href: string; note?: string };
export type NavGroup = { label: string; href?: string; children?: NavLink[] };

export const nav: {
  links: NavGroup[];
  login: NavLink;
  cta: NavLink;
} = {
  links: [
    { label: "Home", href: "/" },
    {
      label: "Products",
      children: [
        { label: "Evaluate", href: "#evaluate", note: "Forecast and de-risk new sites" },
        { label: "Operate", href: "#operate", note: "Monitor and optimize live networks" },
      ],
    },
    {
      label: "Insights",
      children: [
        { label: "Utilization Trends", href: PAGE.utilization, note: "Charger performance nationwide" },
        { label: "Pricing Trends", href: PAGE.pricing, note: "Market pricing by region" },
        { label: "Gasoline Price Equivalent Index", href: `${LIVE}/insights/gas-price-index`, note: "EV vs. fuel economics" },
        { label: "Articles & Webinars", href: `${LIVE}/resources`, note: "Research from the Stable team" },
      ],
    },
    {
      label: "Company",
      children: [
        { label: "About", href: PAGE.about },
        { label: "Careers", href: PAGE.careers },
        { label: "Contact", href: `${LIVE}/contact` },
      ],
    },
  ],
  login: { label: "Login", href: "https://app.stable.auto/" },
  cta: { label: "See it in action", href: `${LIVE}/try` },
};

export const hero = {
  kicker: "EV charging intelligence",
  headline: ["Smarter", "forecasting", "and", "performance", "for", "EV", "charging"],
  emphasis: ["forecasting", "performance"],
  sub: "Stable gives investors and operators the data and tools to forecast, deploy, and optimize EV charging with confidence",
  primary: { label: "See it in action", href: `${LIVE}/try` },
  secondary: { label: "Contact sales", href: `${LIVE}/contact` },
};

export const products = [
  {
    id: "evaluate",
    name: "Evaluate",
    index: "01",
    title: "Forecast performance and de-risk new sites",
    body: "Identify high-potential sites and forecast utilization and ROI across your portfolio.",
    cta: { label: "Run a free site analysis", href: PAGE.evaluate },
  },
  {
    id: "operate",
    name: "Operate",
    index: "02",
    title: "Monitor, benchmark, and optimize active networks",
    body: "Monitor utilization, pricing, and reliability in real time to improve network performance.",
    cta: { label: "See pricing and utilization near your sites", href: PAGE.operate },
  },
] as const;

export const logos = [
  { name: "MN8", src: "/logos/mn8.png", h: 26 },
  { name: "FPL", src: "/logos/fpl.png", h: 34 },
  { name: "SWTCH", src: "/logos/swtch.png", h: 22 },
  { name: "AGI", src: "/logos/agi.png", h: 30 },
  { name: "Hyperfuel", src: "/logos/Hyperfuel.png", h: 18 },
  { name: "bp pulse", src: "/logos/bp-pulse.png", h: 28 },
  { name: "Blink", src: "/logos/blink.svg", h: 22 },
  { name: "EV Connect", src: "/logos/ev-connect.svg", h: 24 },
  { name: "Breathe EV", src: "/logos/breathe-ev.png", h: 30 },
  { name: "Chaevi", src: "/logos/chaevi.png", h: 20 },
  { name: "Oxbo", src: "/logos/oxbo.png", h: 26 },
  { name: "QCharge", src: "/logos/qcharge.png", h: 32 },
  { name: "XCharge", src: "/logos/xcharge.png", h: 16 },
  { name: "Positive Energy", src: "/logos/positiveenergy.png", h: 16 },
];

export const trust = {
  headline: "Trusted by leading investors and CPOs deploying thousands of EV chargers",
};

export const testimonial = {
  quote:
    "We evaluated many tools, but Stable is hands-down the best tool for predicting public DCFC utilization due to their use of real EV charging operating data. It has quickly become a critical step in our evaluation and underwriting process.",
  role: "Senior Director, EV Charging",
  company: "MN8",
  logo: "/logos/mn8.png",
};

export const insights = {
  headline: "See the data driving EV charging decisions",
  items: [
    {
      id: "pricing",
      title: "Pricing Index",
      body: "Market pricing and revenue trends by region",
      badge: "New Oct '25",
      href: PAGE.pricing,
    },
    {
      id: "utilization",
      title: "Utilization Index",
      body: "Real-time insight into charger performance nationwide",
      badge: "New Oct '25",
      href: PAGE.utilization,
    },
    {
      id: "gas",
      title: "Gas Price Equivalent",
      body: "Compare EV charging and fuel economics",
      badge: "New Oct '25",
      href: `${LIVE}/insights/gas-price-index`,
    },
  ],
} as const;

export const problem = {
  headline: "Most EV charging stations aren’t meeting their potential",
  body: [
    "Nearly 80% of charging happens at just 30% of stations. Stable helps investors and operators understand why, and then act on it.",
    "From forecasting ROI before you build to optimizing network performance after deployment, Stable turns data into measurable results.",
  ],
  ctas: [
    { label: "Explore Evaluate", href: "#evaluate" },
    { label: "Explore Operate", href: "#operate" },
  ],
};

export const stats = {
  headline: ["The trusted intelligence platform", "for EV charging investment and operations"],
  sub: "Used by leading investors, developers, and CPOs to plan and manage thousands of EV chargers worldwide.",
  items: [
    { value: 23000, prefix: "", suffix: "+", label: "Charging locations evaluated" },
    { value: 50000, prefix: "", suffix: "+", label: "Active EV chargers under analysis" },
    { value: 5, prefix: "$", suffix: "B+", label: "Infrastructure investments planned" },
  ],
};

export const why = {
  headline: "Why investors and operators choose Stable",
  items: [
    { icon: "model", title: "Model utilization, ROI, and energy costs using transparent, data-driven forecasts" },
    { icon: "target", title: "Forecast site performance with accuracy investors and operators can trust" },
    { icon: "pulse", title: "Monitor live utilization and energy trends to stay ahead of the market" },
    { icon: "shield", title: "Get independent, investment-grade forecasts that stand up under scrutiny" },
    { icon: "link", title: "Seamlessly connect your own data if desired for deeper, continuous analysis" },
    { icon: "people", title: "Partner with Stable experts for tailored pricing and performance guidance" },
  ],
} as const;

export const cta = {
  headline: "Partner with Stable on your next deployment",
  sub: "Start with a 30-minute introductory conversation with our team.",
  action: { label: "Schedule a call", href: `${LIVE}/demo` },
};

export const subscribe = {
  kicker: "Subscribe to data-driven insights",
  headline: "The world of EVs moves fast.",
  body: "Follow our social feeds to see what we’re working on, gain real-time insights, and learn about new roles.",
  form: "Subscribe to our newsletter for updates about our products and services",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/stableauto" },
    { label: "X (Twitter)", href: "https://twitter.com/stable_auto" },
  ],
};

export const footer = {
  links: [
    { label: "Home", href: "/" },
    { label: "About", href: PAGE.about },
    { label: "Product", href: "#evaluate" },
    { label: "Careers", href: PAGE.careers },
    { label: "Contact", href: `${LIVE}/contact` },
  ],
  legal: [
    { label: "Privacy Statement", href: `${LIVE}/legal/privacy-policy` },
    { label: "Terms of Use", href: `${LIVE}/legal/terms-of-service` },
    { label: "Cookie Declaration", href: `${LIVE}/legal/cookie-declaration` },
  ],
  copyright: "© Stable Auto Corporation",
};
