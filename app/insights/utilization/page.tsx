import type { Metadata } from "next";

import { EmailGate, StateTileMap, TrendChart } from "@/components/insights/charts";
import { MonthlySection, Overview, StateSection } from "@/components/insights/sections";
import { InsightLinks } from "@/components/page/InsightLinks";
import { PageHero } from "@/components/page/PageHero";
import { Subscribe } from "@/components/sections/Subscribe";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { UPDATED, utilization as c, utilizationByState, utilizationMonthly } from "@/lib/pages/insights";

export const metadata: Metadata = {
  title: "Stable Insights: EV Charging Utilization Trends",
  description: "Explore high-quality data on national EV charging station utilization from Stable Auto.",
};

export default function UtilizationPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} emphasis={c.hero.emphasis} sub={c.hero.sub} meta={UPDATED} />
        <Overview paragraphs={c.overview} figures={c.keyFigures} />
        <MonthlySection
          title={c.monthly.title}
          chart={
            <TrendChart
              data={utilizationMonthly}
              unit="pct"
              yMin={8}
              yMax={18}
              yTicks={[8, 10, 12, 14, 16, 18]}
              label="National charging utilization by month, July 2024 to June 2025. DCFC rose from 11.0% to a 16.0% peak in December 2024 before easing to 12.9%; L2 rose from 11.1% to 14.6%."
            />
          }
          highlights={c.monthly.highlights}
        />
        <StateSection
          title={c.states.title}
          sub={c.states.sub}
          updated={UPDATED}
          map={
            <EmailGate title="Enter your email to unlock more insights">
              <StateTileMap
                data={utilizationByState}
                unit="frac"
                label="Average DCFC utilization by state, Q2 2025. Highest in Nevada (23.3%), California (22.4%) and Florida (18.4%)."
              />
            </EmailGate>
          }
          highlights={c.states.highlights}
        />
        <InsightLinks exclude="utilization" title="More Stable insights and data" />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
