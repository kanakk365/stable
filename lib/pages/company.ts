// Copy for the About and Careers pages, transcribed from stable.auto.

import { PAGE } from "@/lib/content";

export const resources = [
  {
    id: "utilization",
    title: "EV Charging Utilization Trends",
    body: "Explore national utilization data from public charging stations",
    cta: "View EV Charging Utilization Data",
    href: PAGE.utilization,
  },
  {
    id: "pricing",
    title: "EV Charging Pricing Trends",
    body: "See average DC fast charging prices by state",
    cta: "View EV Charging Pricing Data",
    href: PAGE.pricing,
  },
] as const;

export const about = {
  hero: {
    eyebrow: "About Stable",
    title: "The trusted intelligence platform for EV charging",
    emphasis: ["intelligence"],
    sub: "Stable helps investors and operators plan, deploy, and optimize EV charging networks with data they can trust. By analyzing real-world utilization, pricing, and reliability data from tens of thousands of chargers, we deliver insights that reduce risk, improve ROI, and accelerate the transition to electric mobility.",
  },
  mission: {
    title: "Our Mission",
    statement: "To accelerate the widespread adoption of electric vehicles through smarter, more sustainable charging infrastructure.",
    body: "We believe better data leads to better decisions, and that every well-placed, well-priced charger brings us closer to a fully electrified future.",
    // Photo: Michael Förtsch on Unsplash (unsplash.com/photos/qdNvo1Uk9lk), free to use.
    img: {
      src: "/images/mission-ev-charging.webp",
      alt: "An electric car plugged in at a public charging station",
      width: 1800,
      height: 1200,
    },
  },
  products: [
    {
      name: "Evaluate",
      body: "Evaluate supports site selection and acquisition analysis across the United States.",
      href: PAGE.evaluate,
    },
    {
      name: "Operate",
      body: "Operate provides live performance and pricing intelligence for networks worldwide, with optional integrations for deeper portfolio visibility.",
      href: PAGE.operate,
    },
  ],
  investors: {
    title: "Backed by investors driving the future of clean infrastructure",
    logos: [
      { name: "Congruent Ventures", src: "/logos/investors/congruent-ventures.svg", href: "http://congruentvc.com/", h: 30 },
      { name: "Trucks VC", src: "/logos/investors/trucks-vc.svg", href: "https://www.trucks.vc/", h: 34 },
      { name: "E14", src: "/logos/investors/e14.svg", href: "https://www.e14.vc/", h: 34 },
      { name: "Ironspring Ventures", src: "/logos/investors/ironspring-ventures.png", href: "https://ironspring.com/", h: 30 },
      { name: "Homecoming Capital", src: "/logos/investors/homecoming-capital.svg", href: "https://homecomingcapital.com/", h: 38 },
    ],
  },
  resourcesTitle: "Explore Stable insights and data",
  join: {
    title: "Join us in building the future of EV infrastructure",
    body: "We are looking for curious, driven people who want to shape the next chapter of the energy transition.",
    cta: { label: "See Job Postings", href: `${PAGE.careers}#positions` },
  },
};

export const careers = {
  hero: {
    eyebrow: "Careers at Stable",
    title: "Join the shop for EV problem solving.",
    emphasis: ["EV", "problem", "solving."],
    sub: "Stable is where intellectual rigor meets automotive industry expertise, and where passionate people with practical experience can map their own career path.",
    anchors: [
      { label: "Open Positions", href: "#positions" },
      { label: "Benefits", href: "#benefits" },
      { label: "Mission", href: "#mission" },
      { label: "Values", href: "#values" },
    ],
  },
  positions: {
    title: "Open positions",
    body: [
      "We believe in setting your own path. It’s a part of our story too. From making robotic charging stations in a small shop in San Francisco to scaling our software solutions, we’ve always been driven by a passion for EV.",
      "The potential impact is what’s always mattered most. How can we move the industry forward—faster? We look for that same mindset in our team.",
      "If you have conviction in the why behind what you’re doing, and you love to challenge the how, then come learn and build with us.",
    ],
    empty: { title: "We are not currently hiring right now", body: "Check back later for new opportunities" },
  },
  benefits: {
    title: "Our benefits",
    items: [
      { label: "Parental and family leave", icon: "/images/benefits/parental-icon.svg" },
      { label: "Remote work stipends", icon: "/images/benefits/stipend-icon.svg" },
      { label: "401(k)", icon: "/images/benefits/401k-icon.svg" },
      { label: "Comprehensive health plans", icon: "/images/benefits/health-icon.svg" },
      { label: "Flexible PTO", icon: "/images/benefits/PTO-icon.svg" },
    ],
  },
  mission: {
    title: "Our mission",
    lead: "All electric, everywhere and for everyone. It’s what we solve for every day, and we believe it can’t happen soon enough.",
    body: [
      "Climate is humanity’s gnarliest problem. Every charger has to be part of the solution, made readily available to the people who need it.",
      "We make it easy for organizations to build efficient, effective, perfectly placed infrastructure—allowing for high-performance charging stations that help speed electric vehicle adoption. This is a faster way to all EV and a giant leap forward for our planet.",
    ],
    img: { src: "/images/charging-station.webp", alt: "A Stable-branded EV charging station with a car plugged in", width: 1266, height: 969 },
  },
  values: {
    title: "Our values",
    items: [
      {
        title: "Unknowns are not unknowable.",
        body: "Every idea starts with uncertainty, and uncertainty can be intimidating. We work to bring tangibility to unknowns, and understanding to today’s knottiest questions.",
      },
      {
        title: "Default kind.",
        body: "Great paradigm shifts are hard to keep up with. We bring intelligence and kindness to our work, and empathy to a world in flux.",
      },
      {
        title: "Understand, not understood.",
        body: "In everyday conversations, real world experiences, and even data—solutions are often right in front of us. We find them by listening well to understand others, before being understood ourselves.",
      },
      {
        title: "Done is just a state of mind.",
        body: "For relentless problem solvers, seeking the next challenge is second nature. In a world of constant change, there’s always more to understand.",
      },
    ],
    img: { src: "/images/stable-banner.webp", alt: "Stable street banners on a lamp post", width: 1600, height: 1799 },
  },
};
