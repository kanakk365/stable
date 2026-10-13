import type { Metadata } from "next";

import { Reveal, SplitHeadline } from "@/components/fx/motion";
import { StateBars, StateTileMap, TrendChart } from "@/components/insights/charts";
import { MonthlySection, Overview, StateSection } from "@/components/insights/sections";
import { InsightLinks } from "@/components/page/InsightLinks";
import { PageHero } from "@/components/page/PageHero";
import { Subscribe } from "@/components/sections/Subscribe";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { UPDATED, pricing as c, pricingByState, pricingMonthly } from "@/lib/pages/insights";

export const metadata: Metadata = {
  title: "Stable Insights: EV Charging Pricing Trends",
  description: "Explore high-quality data on national EV charging station pricing from Stable Auto.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} emphasis={c.hero.emphasis} sub={c.hero.sub} meta={UPDATED} />
        <Overview paragraphs={c.overview} figures={c.keyFigures} />
        <MonthlySection
          title={c.monthly.title}
          sub={c.monthly.sub}
          chart={
            <TrendChart
              data={pricingMonthly}
              unit="usd"
              yMin={0.2}
              yMax={0.5}
              yTicks={[0.2, 0.3, 0.4, 0.5]}
              label="National average charging prices per kWh by month, July 2024 to June 2025. DCFC between $0.43 and $0.47; L2 between $0.23 and $0.26."
            />
          }
          highlights={c.monthly.highlights}
        />
        <StateSection
          title={c.states.title}
          sub={c.states.sub}
          updated={UPDATED}
          map={
            <StateTileMap
              data={pricingByState}
              unit="usd"
              label="Average DCFC price per kWh by state, Q2 2025. Highest in Louisiana ($0.59) and Maine ($0.57); lowest in Nebraska ($0.24) and Iowa ($0.26)."
            />
          }
          highlights={c.states.highlights}
        />
        <section className="section bg-mist-2/60">
          <div className="shell">
            <div className="mx-auto max-w-[860px] text-center">
              <SplitHeadline className="h2" words={c.bars.title.split(" ")} />
              <Reveal delay={0.1}>
                <p className="lead mx-auto mt-5">Average DCFC price per kWh, Q2 &rsquo;25, highest to lowest.</p>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="mt-12">
              <div className="rounded-[28px] border border-line bg-surface-2 p-5 shadow-[var(--shadow-card)] sm:p-8">
                <StateBars data={pricingByState} unit="usd" />
                <p className="mt-5 font-mono text-[0.72rem] text-mute">{UPDATED}</p>
              </div>
            </Reveal>
          </div>
        </section>
        <InsightLinks exclude="pricing" title="More Stable insights and data" />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
