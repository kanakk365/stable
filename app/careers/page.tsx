import type { Metadata } from "next";
import Image from "next/image";

import { Reveal, SplitHeadline } from "@/components/fx/motion";
import { FeatureSplit } from "@/components/page/blocks";
import { PageHero } from "@/components/page/PageHero";
import { Subscribe } from "@/components/sections/Subscribe";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { LinkedIn } from "@/components/ui/icons";
import { careers as c } from "@/lib/pages/company";

export const metadata: Metadata = {
  title: "Careers at Stable Auto",
  description: c.hero.sub,
};

export default function CareersPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <PageHero
          eyebrow={c.hero.eyebrow}
          title={c.hero.title}
          emphasis={c.hero.emphasis}
          sub={c.hero.sub}
          anchors={c.hero.anchors}
        />

        {/* Open positions: the story on the left, the current status on the right */}
        <section id="positions" className="section scroll-mt-24">
          <div className="shell grid items-stretch gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="flex flex-col justify-center">
              <SplitHeadline className="h2" words={c.positions.title.split(" ")} emphasis={["positions"]} />
              <Reveal delay={0.1}>
                {c.positions.body.map((p, i) => (
                  <p key={i} className={`max-w-[56ch] text-[1.06rem] leading-relaxed ${i === 0 ? "mt-8 text-ink-2" : "mt-4 text-mute"}`}>
                    {p}
                  </p>
                ))}
              </Reveal>
            </div>
            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-line-strong bg-surface p-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-deep text-mint">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3.5" y="7" width="17" height="12.5" rx="2.5" />
                    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17" />
                  </svg>
                </span>
                <p className="mt-6 font-display text-[1.4rem] font-semibold tracking-[-0.015em] text-ink">{c.positions.empty.title}</p>
                <p className="mt-2 text-mute">{c.positions.empty.body}</p>
                <a
                  href="https://www.linkedin.com/company/stableauto"
                  className="btn-ghost mt-8 !py-3 text-[0.95rem]"
                >
                  <LinkedIn width={16} height={16} />
                  Follow Stable on LinkedIn
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="section scroll-mt-24 bg-mist-2/60">
          <div className="shell">
            <div className="text-center">
              <SplitHeadline className="h2" words={c.benefits.title.split(" ")} emphasis={["benefits"]} />
            </div>
            <div role="list" className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
              {c.benefits.items.map((b, i) => (
                <Reveal key={b.label} delay={i * 0.07} className="h-full">
                  <div role="listitem" className="flex h-full flex-col items-center rounded-[24px] border border-line bg-surface-2 px-5 py-8 text-center shadow-[var(--shadow-card)]">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/12">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.icon} alt="" className="h-9 w-9" />
                    </span>
                    <p className="mt-5 font-semibold leading-snug text-ink">{b.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <FeatureSplit
          id="mission"
          title={c.mission.title}
          emphasis={["mission"]}
          body={[c.mission.lead, ...c.mission.body]}
          media={
            <div className="relative h-full min-h-[360px] overflow-hidden rounded-[28px] border border-line shadow-[var(--shadow-float)]">
              <Image src={c.mission.img.src} alt={c.mission.img.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          }
          reverse
        />

        {/* Values: four cards beside the banner photograph, equal height */}
        <section id="values" className="section scroll-mt-24 bg-mist-2/60">
          <div className="shell">
            <div className="text-center">
              <SplitHeadline className="h2" words={c.values.title.split(" ")} emphasis={["values"]} />
            </div>
            <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-[1.5fr_0.8fr] lg:gap-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
                {c.values.items.map((v, i) => (
                  <Reveal key={v.title} delay={i * 0.08} className="h-full">
                    <article className="flex h-full flex-col rounded-[24px] border border-line bg-surface-2 p-7 shadow-[var(--shadow-card)]">
                      <span className="tabular font-mono text-[0.78rem] font-bold text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="h3 mt-5 !text-[1.35rem]">{v.title}</h3>
                      <p className="mt-3 text-[1rem] leading-relaxed text-mute">{v.body}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.15} className="h-full">
                <div className="relative h-full min-h-[420px] overflow-hidden rounded-[24px] border border-line shadow-[var(--shadow-float)]">
                  <Image src={c.values.img.src} alt={c.values.img.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
