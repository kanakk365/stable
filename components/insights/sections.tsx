import type { ReactNode } from "react";

import { Reveal, SplitHeadline } from "@/components/fx/motion";

import { Highlights } from "./charts";

/** Overview: heading and the period's key figures on the left, prose on the right. */
export function Overview({ paragraphs, figures }: { paragraphs: string[]; figures: { value: string; label: string }[] }) {
  return (
    <section className="section">
      <div className="shell grid items-stretch gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="flex flex-col">
          <SplitHeadline className="h2" words={["Overview"]} />
          <Reveal delay={0.1} className="mt-10 lg:mt-auto">
            <dl className="flex flex-col divide-y divide-line border-y border-line">
              {figures.map((f) => (
                <div key={f.label} className="flex items-baseline gap-5 py-5">
                  <dt className="tabular w-[6.5rem] shrink-0 font-display text-[2.4rem] font-[760] leading-none tracking-[-0.03em] text-accent-ink [font-variation-settings:'wdth'_108]">
                    {f.value}
                  </dt>
                  <dd className="text-[0.98rem] leading-snug text-ink-2">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="flex flex-col justify-center">
          {paragraphs.map((p, i) => (
            <p key={i} className={`max-w-[62ch] text-[1.08rem] leading-relaxed ${i === 0 ? "text-ink" : "mt-5 text-mute"}`}>
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** A national monthly chart in a card, with highlights in two columns beneath. */
export function MonthlySection({
  title,
  sub,
  chart,
  highlights,
}: {
  title: string;
  sub?: string;
  chart: ReactNode;
  highlights: string[];
}) {
  return (
    <section className="section bg-mist-2/60">
      <div className="shell">
        <div className="mx-auto max-w-[860px] text-center">
          <SplitHeadline className="h2" words={title.split(" ")} />
          {sub ? (
            <Reveal delay={0.1}>
              <p className="lead mx-auto mt-5">{sub}</p>
            </Reveal>
          ) : null}
        </div>
        <Reveal delay={0.1} className="mt-12">
          <figure className="rounded-[28px] border border-line bg-surface-2 p-5 shadow-[var(--shadow-card)] sm:p-8">{chart}</figure>
        </Reveal>
        <Reveal delay={0.15} className="mt-10">
          <p className="data-label mb-2 !text-accent-ink">Highlights</p>
          <Highlights items={highlights} columns={2} />
        </Reveal>
      </div>
    </section>
  );
}

/** State map on the left, the reading of it on the right, at equal height. */
export function StateSection({
  title,
  sub,
  map,
  highlights,
  updated,
}: {
  title: string;
  sub: string;
  map: ReactNode;
  highlights: string[];
  updated: string;
}) {
  return (
    <section className="section">
      <div className="shell">
        <div className="mx-auto max-w-[860px] text-center">
          <SplitHeadline className="h2" words={title.split(" ")} />
          <Reveal delay={0.1}>
            <p className="lead mx-auto mt-5">{sub}</p>
          </Reveal>
        </div>
        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <Reveal delay={0.1} className="h-full">
            <figure className="flex h-full flex-col justify-center rounded-[28px] border border-line bg-surface-2 p-5 shadow-[var(--shadow-card)] sm:p-8">
              {map}
              <figcaption className="mt-5 font-mono text-[0.72rem] text-mute">{updated}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-col justify-center">
            <p className="data-label mb-2 !text-accent-ink">Highlights</p>
            <Highlights items={highlights} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
