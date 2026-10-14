import type { Metadata } from "next";

import { AdaptivePricing } from "@/components/page/AdaptivePricing";
import { AudienceSplit, FeatureSplit, LogoBand, MediaStage, PlanTiers, SectionIntro } from "@/components/page/blocks";
import { OperatePerformanceView } from "@/components/page/OperatePerformanceView";
import { PageHero } from "@/components/page/PageHero";
import { Reveal } from "@/components/fx/motion";
import { Cta } from "@/components/sections/Cta";
import { Subscribe } from "@/components/sections/Subscribe";
import { Testimonial } from "@/components/sections/Testimonial";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { operate as c } from "@/lib/pages/products";

export const metadata: Metadata = {
  title: "Stable Operate — Monitor and optimize EV charging networks",
  description: c.hero.sub,
};

export default function OperatePage() {
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
          media={<OperatePerformanceView />}
        />
        <AudienceSplit items={c.audience} />
        <LogoBand />
        <Testimonial quote={c.testimonial} />
        <FeatureSplit
          title={c.visibility.title}
          emphasis={c.visibility.emphasis}
          body={c.visibility.body}
          points={c.visibility.points}
          media={<MediaStage img={c.visibility.img} />}
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
        <section className="section">
          <div className="shell">
            <SectionIntro title={c.adaptive.title} emphasis={["Adaptive", "Pricing"]} lead={c.adaptive.lead} />
            <Reveal delay={0.1} className="mx-auto mt-14 max-w-[1080px]">
              <AdaptivePricing />
            </Reveal>
          </div>
        </section>
        <FeatureSplit
          title={c.platform.title}
          emphasis={c.platform.emphasis}
          body={c.platform.body}
          link={c.platform.link}
          media={<MediaStage img={c.platform.img} />}
          reverse
          tone="tint"
        />
        <div className="pt-6">
          <Cta
            headline={c.cta.headline}
            sub={c.cta.sub}
            primary={c.cta.primary}
            secondary={c.cta.secondary}
            meeting={c.cta.meeting}
            id="tour"
          />
        </div>
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
