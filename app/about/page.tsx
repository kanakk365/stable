import type { Metadata } from "next";
import Image from "next/image";

import { Reveal, SplitHeadline } from "@/components/fx/motion";
import { Banner, LogoBand } from "@/components/page/blocks";
import { InsightLinks } from "@/components/page/InsightLinks";
import { PageHero } from "@/components/page/PageHero";
import { Stats } from "@/components/sections/Stats";
import { Subscribe } from "@/components/sections/Subscribe";
import { Testimonial } from "@/components/sections/Testimonial";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ArrowRight } from "@/components/ui/icons";
import { LogoMark } from "@/components/ui/Logo";
import { about as c } from "@/lib/pages/company";

export const metadata: Metadata = {
  title: "About Stable Auto",
  description: c.hero.sub,
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} emphasis={c.hero.emphasis} sub={c.hero.sub} />

        {/* Mission: statement on the left, the team on stage on the right */}
        <section className="section">
          <div className="shell grid items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <SplitHeadline className="h2" words={c.mission.title.split(" ")} emphasis={["Mission"]} />
              <Reveal delay={0.1}>
                <p className="mt-8 max-w-[30ch] font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink [font-variation-settings:'wdth'_104]">
                  {c.mission.statement}
                </p>
                <p className="mt-6 max-w-[50ch] text-[1.06rem] leading-relaxed text-mute">{c.mission.body}</p>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="h-full">
              <div className="relative h-full min-h-[360px] overflow-hidden rounded-[28px] border border-line shadow-[var(--shadow-float)]">
                <Image
                  src={c.mission.img.src}
                  alt={c.mission.img.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <Stats />
        <LogoBand />
        <Testimonial />

        {/* The two products, as equal panels */}
        <section className="section !pt-8 lg:!pt-12">
          <div className="shell grid gap-5 md:grid-cols-2 lg:gap-6">
            {c.products.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1} className="h-full">
                <a
                  href={p.href}
                  className="group flex h-full flex-col rounded-[28px] border border-line bg-surface-2 p-8 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-float)] sm:p-10"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-deep">
                      <LogoMark className="h-6 w-8" />
                    </span>
                    <span className="font-display text-[2.2rem] font-[780] tracking-[-0.035em] text-ink [font-variation-settings:'wdth'_110]">
                      {p.name}
                    </span>
                  </span>
                  <p className="mt-6 max-w-[48ch] text-[1.06rem] leading-relaxed text-mute">{p.body}</p>
                  <span className="link-arrow mt-auto pt-8">
                    <span className="border-b border-accent/50 pb-0.5 group-hover:border-accent">Explore {p.name}</span>
                    <ArrowRight className="arr text-accent-ink" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Investors */}
        <section className="pb-24 pt-4 sm:pb-28">
          <div className="shell">
            <Reveal>
              <p className="mx-auto max-w-[40ch] text-center font-display text-[1.35rem] font-semibold tracking-[-0.015em] text-ink">
                {c.investors.title}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mx-auto mt-10 flex max-w-[1000px] flex-wrap items-center justify-center gap-x-14 gap-y-8">
                {c.investors.logos.map((l) => (
                  <li key={l.name}>
                    <a href={l.href} target="_blank" rel="noreferrer" className="block text-ink opacity-70 grayscale transition-[opacity,filter] duration-500 hover:opacity-100 hover:grayscale-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.src} alt={l.name} style={{ height: l.h }} className="w-auto" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <InsightLinks />
        <div className="pt-6" />
        <Banner title={c.join.title} body={c.join.body} action={c.join.cta} />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
