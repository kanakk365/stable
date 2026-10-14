import type { Metadata } from "next";

import { AudienceSplit, FeatureSplit, LogoBand, MediaStage, PlanTiers } from "@/components/page/blocks";
import { EvaluateSitesView } from "@/components/page/EvaluateSitesView";
import { PageHero } from "@/components/page/PageHero";
import { Cta } from "@/components/sections/Cta";
import { Subscribe } from "@/components/sections/Subscribe";
import { Testimonial } from "@/components/sections/Testimonial";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { evaluate as c } from "@/lib/pages/products";

export const metadata: Metadata = {
  title: "Stable Evaluate — Forecast EV charging performance",
  description: c.hero.sub,
};

export default function EvaluatePage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <PageHero
          eyebrow={c.hero.eyebrow}
          title={c.hero.title}
          emphasis={c.hero.emphasis}
          sub={c.hero.sub}
          primary={c.hero.primary}
          secondary={c.hero.secondary}
          media={<EvaluateSitesView />}
        />
        <AudienceSplit items={c.audience} />
        <LogoBand />
        <Testimonial />
        <FeatureSplit
          title={c.forecast.title}
          emphasis={c.forecast.emphasis}
          body={c.forecast.body}
          points={c.forecast.points}
          media={<MediaStage img={c.forecast.img} />}
        />
        <FeatureSplit
          title={c.data.title}
          emphasis={c.data.emphasis}
          body={c.data.body}
          link={c.data.link}
          media={<MediaStage img={c.data.img} />}
          reverse
          tone="tint"
        />
        <PlanTiers title={c.plans.title} lead={c.plans.lead} tiers={c.plans.tiers} />
        <FeatureSplit
          title={c.platform.title}
          emphasis={c.platform.emphasis}
          body={c.platform.body}
          link={c.platform.link}
          media={<MediaStage img={c.platform.img} />}
        />
        <Cta
          headline={c.cta.headline}
          sub={c.cta.sub}
          primary={c.cta.primary}
          secondary={c.cta.secondary}
          meeting={c.cta.meeting}
          id="tour"
        />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
