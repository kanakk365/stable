// Copy for the Evaluate and Operate product pages, transcribed from the
// live stable.auto pages. Form and meeting links are the originals.

import { PAGE } from "@/lib/content";
import type { Tier } from "@/components/page/blocks";

// "Contact Sales" books a call with each product's team.
const EVALUATE_CALL = "https://meetings.hubspot.com/akash-krishnani/evaluate-meeting";
const OPERATE_CALL = "https://meetings.hubspot.com/akash-krishnani/operate-meeting";

const IMG = {
  laptop: { src: "/images/product-laptop.webp", alt: "Stable Evaluate on a laptop: a national map of candidate sites above a ranked site table", width: 1600, height: 975 },
  marketTrends: { src: "/images/market-trends.webp", alt: "Stable market view: EV ownership, demographics and nearby amenities around a site", width: 1258, height: 974 },
  sitePerformance: { src: "/images/site-performance.webp", alt: "Predicting site performance: traffic radius, EV registrations, typical utilization of nearby chargers and EV traffic", width: 1450, height: 964 },
  operate: { src: "/images/operate-dashboard.webp", alt: "Stable Operate: network performance charts, a map of live sites and a station table", width: 1600, height: 817 },
  pricingGuidance: { src: "/images/pricing-guidance.webp", alt: "Stable pricing guidance: revenue performance and recommended price adjustments by site", width: 1568, height: 1152 },
};

export const evaluate = {
  hero: {
    eyebrow: "Evaluate",
    title: "Forecast EV charging performance with confidence",
    emphasis: ["performance", "confidence"],
    sub: "Stable Evaluate uses transparent data and defensible forecasts to help investors and operators model returns and de-risk EV charging projects",
    primary: { label: "Run a free site analysis", href: "https://share.hsforms.com/1T1ayaE0zQfSHolan4Ho8dQc4u3d" },
    secondary: { label: "Book a call", href: "https://meetings.hubspot.com/akash-krishnani/evaluate-meeting" },
    img: IMG.laptop,
  },
  audience: [
    {
      who: "operators" as const,
      title: "For Operators",
      body: "Improve station performance before breaking ground. Use utilization and pricing forecasts to select profitable sites, validate portfolios, accelerate site decisions, and validate ROI potential.",
    },
    {
      who: "investors" as const,
      title: "For Investors",
      body: "Confidently underwrite EV charging projects. Evaluate market potential, model returns, and build defensible pro formas that stand up under diligence.",
    },
  ],
  forecast: {
    title: "Forecast utilization, revenue, and energy costs before you build",
    emphasis: ["before", "you", "build"],
    body: [
      "Evaluate combines real utilization data, EV adoption trends, and local energy tariffs to help you make smarter investment decisions.",
      "Model ROI, payback timelines, and performance potential across every site or portfolio, all in one platform. Whether you’re comparing potential sites or modeling a full network, Evaluate brings the most complete picture of EV charging performance into one platform.",
    ],
    points: [
      "Forecast utilization and performance potential at the site level",
      "Compare markets and portfolios side-by-side",
      "Evaluate tariff scenarios and projected energy costs",
      "Provide the inputs to model ROI, payback period, and profitability",
    ],
    img: IMG.sitePerformance,
  },
  data: {
    title: "Built on real-world charging data",
    emphasis: ["real-world"],
    body: [
      "Evaluate forecasts are grounded in actual charging behavior, not assumptions. Our models draw from 50,000+ chargers under analysis, updated continuously to reflect changing utilization, pricing, and charging and utilization trends.",
    ],
    link: { label: "Explore our live utilization data", href: PAGE.utilization },
    img: IMG.marketTrends,
  },
  plans: {
    title: "Flexible solutions for any stage of deployment",
    lead: "Choose the level of access that fits your portfolio and workflow. Start free with directional insights or scale up to full portfolio modeling and expert guidance",
    tiers: [
      {
        name: "Basic",
        price: "Free",
        audience: "Early-stage diligence or portfolio screening",
        cta: { label: "Run a free site analysis", href: "https://share.hsforms.com/1T1ayaE0zQfSHolan4Ho8dQc4u3d" },
        features: [
          "Baseline utilization and revenue benchmarks for up to 5 locations",
          "Directional ROI and performance insights at the site level",
          "Quick validation of site potential before deeper analysis",
        ],
      },
      {
        name: "Pro",
        audience: "Teams modeling full portfolios and financial returns",
        cta: { label: "Contact Sales", href: EVALUATE_CALL },
        includes: "All Basic features, plus",
        features: [
          "Full access to Evaluate data and modeling tools",
          "Custom tariff and energy-cost analysis",
          "Portfolio-level forecasting, exportable pro formas",
        ],
      },
      {
        name: "Expert",
        audience: "Enterprise accounts needing tailored analysis and support",
        cta: { label: "Contact Sales", href: EVALUATE_CALL },
        includes: "All Pro features, plus",
        features: ["Dedicated support from Stable experts", "Collaborative modeling and strategy validation"],
      },
    ] satisfies Tier[],
  },
  platform: {
    title: "One platform for smarter planning and performance",
    emphasis: ["smarter"],
    body: [
      "Evaluate helps you plan and invest confidently. Once your sites are live, Operate gives you ongoing visibility into utilization, reliability, and pricing performance, creating a continuous feedback loop across your portfolio.",
      "Evaluate users can transition seamlessly into Operate once chargers are live, using shared data and consistent performance logic.",
    ],
    link: { label: "Explore Operate", href: PAGE.operate },
    img: IMG.operate,
  },
  cta: {
    headline: "Make confident EV charging investments",
    sub: "From site selection to financial modeling, Evaluate gives you the clarity to deploy capital intelligently and deliver stronger returns.",
    primary: { label: "Run a free site analysis", href: "https://share.hsforms.com/1T1ayaE0zQfSHolan4Ho8dQc4u3d" },
    secondary: { label: "Book a call", href: "https://meetings.hubspot.com/akash-krishnani/evaluate-meeting" },
    meeting: "Evaluate demo with Stable",
  },
};

export const operate = {
  hero: {
    eyebrow: "Operate",
    title: "Monitor and optimize EV charging network performance",
    emphasis: ["optimize"],
    sub: "Stable Operate connects utilization, pricing, energy, and reliability data to help operators and investors monitor performance, reduce costs, and drive higher portfolio returns",
    primary: { label: "Benchmark your network", href: "https://share.hsforms.com/12UpYwSiYS86_NDotfa2ZhAc4u3d" },
    secondary: { label: "Book a call", href: "https://meetings.hubspot.com/akash-krishnani/operate-meeting" },
    img: IMG.operate,
  },
  audience: [
    {
      who: "operators" as const,
      title: "For Operators",
      body: "Benchmark and improve network performance with data on utilization, energy cost, and market pricing. Identify underperforming stations, optimize pricing, and track reliability in one platform.",
    },
    {
      who: "investors" as const,
      title: "For Investors",
      body: "Track the live performance of funded assets. Benchmark utilization, pricing, and uptime across portfolios to validate assumptions and strengthen ROI.",
    },
  ],
  testimonial: {
    quote:
      "We have already experienced the staying power of utilizing this platform. For example, we achieved a 34% improvement in efficiency, increasing the net revenue across 60 locations",
    person: "Mike Battaglia",
    role: "Chief Operating Officer and CEO",
    company: "Blink",
    logo: "/logos/blink.svg",
  },
  visibility: {
    title: "Visibility and insight across every charger, site, and portfolio",
    emphasis: ["every"],
    body: [
      "Operate combines utilization, reliability, energy, and pricing data into one connected view of network performance.",
      "Quickly identify trends, detect issues, and make informed pricing and operations decisions.",
    ],
    points: [
      "Benchmark your utilization and pricing against market averages",
      "Monitor uptime and energy costs in real time",
      "Detect anomalies and track performance trends by region or operator",
      "Combine performance data with internal systems for deeper insight",
    ],
    img: IMG.pricingGuidance,
  },
  data: {
    title: "Grounded in real-world performance",
    emphasis: ["real-world"],
    body: [
      "Operate is built on aggregated, anonymized data from tens of thousands of EV chargers, updated continuously to reflect changing market conditions. Track utilization, reliability, and pricing with the same trusted data that powers Stable’s national indexes.",
    ],
    link: { label: "Explore our live utilization data", href: PAGE.utilization },
    img: IMG.marketTrends,
  },
  plans: {
    title: "Flexible plans for any network size or level of insight",
    lead: "Choose the access level that fits your operations, from free benchmarks to full-scale analytics and expert guidance",
    tiers: [
      {
        name: "Basic",
        price: "Free",
        audience: "Teams tracking benchmarks or early performance trends",
        cta: { label: "Benchmark your network", href: "https://share.hsforms.com/12UpYwSiYS86_NDotfa2ZhAc4u3d" },
        features: [
          "Access utilization and pricing benchmarks for up to 3 locations",
          "Market comparisons by charger type and region",
          "Visibility into performance trends across the market",
        ],
      },
      {
        name: "Pro",
        audience: "Networks optimizing performance and ROI",
        cta: { label: "Contact Sales", href: OPERATE_CALL },
        includes: "All Basic features, plus",
        features: [
          "Full access to reliability, energy, and market data",
          "Real-time alerts and anomaly detection",
          "Integrations and portfolio-level views (option to connect internal data)",
        ],
      },
      {
        name: "Expert",
        audience: "Enterprises seeking hands-on support",
        cta: { label: "Contact Sales", href: OPERATE_CALL },
        includes: "All Pro features, plus",
        features: [
          "Tailored recommendations on pricing, reliability, and energy optimization",
          "Access to Stable experts for performance tuning and reporting",
          "Adaptive Pricing automation and strategic advisory",
        ],
      },
    ] satisfies Tier[],
  },
  adaptive: {
    title: "Adaptive Pricing for automated, market-aligned pricing",
    lead: "Prices adjust to real conditions, including site utilization, energy tariffs, and local demand. The result is higher margins and less busywork.",
  },
  platform: {
    title: "One platform for smarter planning and performance",
    emphasis: ["smarter"],
    body: [
      "Operate extends the same data foundation as Evaluate, helping you move from investment to optimization seamlessly.",
      "Evaluate helps you plan and forecast with confidence, while Operate gives you continuous visibility to refine performance and returns over time.",
    ],
    link: { label: "Explore Evaluate", href: PAGE.evaluate },
    img: IMG.sitePerformance,
  },
  cta: {
    headline: "Turn charging data into operational advantage",
    sub: "Operate helps operators and investors monitor, benchmark, and improve performance with confidence. Get instant visibility into utilization, pricing, and reliability, and act on it with data you can trust.",
    primary: { label: "See pricing and utilization near your sites", href: "https://share.hsforms.com/12UpYwSiYS86_NDotfa2ZhAc4u3d" },
    secondary: { label: "Book a call", href: "https://meetings.hubspot.com/akash-krishnani/operate-meeting" },
    meeting: "Operate demo with Stable",
  },
};
