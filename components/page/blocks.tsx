import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { DotField } from "@/components/fx/DotField";
import { Reveal, SplitHeadline } from "@/components/fx/motion";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { ArrowRight, ArrowUpRight, Check } from "@/components/ui/icons";
import { trust } from "@/lib/content";

type Img = { src: string | StaticImageData; alt: string; width: number; height: number };
type Action = { label: string; href: string };

/* ---------------------------------------------------------------------- */

/** A product screenshot or photo, set on a quiet frame. */
export function MediaFrame({
  img,
  frame = true,
  priority,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  img: Img;
  frame?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const image = (
    <Image
      src={img.src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      sizes={sizes}
      priority={priority}
      className="block h-auto w-full"
    />
  );
  if (!frame) return <div className={className}>{image}</div>;
  return (
    <div
      className={`overflow-hidden rounded-[24px] border border-line bg-surface-2 p-3 shadow-[var(--shadow-float)] sm:p-4 ${className}`}
    >
      <div className="overflow-hidden rounded-[16px] bg-surface">{image}</div>
    </div>
  );
}

/** A transparent UI collage set on a soft mint stage. */
export function MediaStage({ img, sizes = "(min-width: 1024px) 50vw, 100vw" }: { img: Img; sizes?: string }) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(80%_70%_at_50%_45%,oklch(0.93_0.04_168),var(--surface)_75%)] p-5 sm:p-8">
      <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} className="relative block h-auto w-full" />
    </div>
  );
}

/* ---------------------------------------------------------------------- */

/** Centered section heading with an optional lead. */
export function SectionIntro({
  title,
  emphasis = [],
  lead,
  className = "",
}: {
  title: string;
  emphasis?: string[];
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`mx-auto flex max-w-[860px] flex-col items-center text-center ${className}`}>
      <SplitHeadline className="h2" words={title.split(" ")} emphasis={emphasis} />
      {lead ? (
        <Reveal delay={0.1}>
          <p className="lead mt-6 !max-w-[62ch]">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------------- */

const AUDIENCE_ICON = {
  operators: (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="4" width="14" height="24" rx="3" />
      <path d="M16.8 10 13 16.5h3.6L15.2 22l4-6.5h-3.6z" fill="currentColor" stroke="none" />
    </svg>
  ),
  investors: (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 27h24" />
      <path d="M7 22l6-6 4 3 8-9" />
      <path d="M20 10h5v5" />
    </svg>
  ),
};

/** "For Operators / For Investors": two equal panels, same structure. */
export function AudienceSplit({ items }: { items: { who: "operators" | "investors"; title: string; body: string }[] }) {
  return (
    <section className="section !pt-20 sm:!pt-24">
      <div className="shell grid gap-5 md:grid-cols-2 lg:gap-6">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.1} className="h-full">
            <article className="flex h-full flex-col rounded-[28px] border border-line bg-surface-2 p-8 shadow-[var(--shadow-card)] sm:p-10">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-deep text-mint">{AUDIENCE_ICON[it.who]}</span>
              <h2 className="h3 mt-8">{it.title}</h2>
              <p className="mt-4 max-w-[48ch] text-[1.05rem] leading-relaxed text-mute">{it.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */

/** Text and media side by side, vertically centred so both columns carry weight. */
export function FeatureSplit({
  id,
  title,
  emphasis = [],
  body,
  points,
  link,
  media,
  reverse,
  tone = "plain",
}: {
  id?: string;
  title: string;
  emphasis?: string[];
  body: string[];
  points?: string[];
  link?: Action;
  media: ReactNode;
  reverse?: boolean;
  tone?: "plain" | "tint";
}) {
  return (
    <section id={id} className={`section scroll-mt-24 ${tone === "tint" ? "bg-mist-2/60" : ""}`}>
      {/* Both columns stretch to the taller one: the text centres itself and
          the media stage fills its side, so neither column reads light. */}
      <div className="shell grid items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
        <div className={`flex flex-col justify-center ${reverse ? "lg:order-2" : ""}`}>
          <SplitHeadline className="h2 max-w-[18ch]" words={title.split(" ")} emphasis={emphasis} />
          <Reveal delay={0.1}>
            {body.map((p, i) => (
              <p key={i} className={`max-w-[54ch] text-[1.06rem] leading-relaxed ${i === 0 ? "mt-7 text-ink-2" : "mt-4 text-mute"}`}>
                {p}
              </p>
            ))}
          </Reveal>
          {points ? (
            <Reveal delay={0.15}>
              <ul className="mt-8 flex flex-col divide-y divide-line border-y border-line">
                {points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3.5 py-3.5 text-[1rem] text-ink">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-ink">
                      <Check width={13} height={13} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
          {link ? (
            <Reveal delay={0.2}>
              <a href={link.href} className="link-arrow group mt-8 text-[1rem]">
                <span className="border-b border-accent/50 pb-0.5 transition-colors group-hover:border-accent">{link.label}</span>
                <ArrowRight className="arr text-accent-ink" />
              </a>
            </Reveal>
          ) : null}
        </div>
        <Reveal delay={0.1} className={`h-full lg:min-h-[440px] ${reverse ? "lg:order-1" : ""}`}>
          {media}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */

export type Tier = {
  name: string;
  price?: string;
  audience: string;
  cta: Action;
  includes?: string;
  features: string[];
};

/** Basic / Pro / Expert. The middle tier carries the deep-teal emphasis. */
export function PlanTiers({ title, lead, tiers }: { title: string; lead: string; tiers: Tier[] }) {
  return (
    <section id="plans" className="section scroll-mt-24 bg-mist-2/60">
      <div className="shell">
        <SectionIntro title={title} lead={lead} />
        <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3 lg:gap-6">
          {tiers.map((t, i) => {
            const featured = i === 1;
            return (
              <Reveal key={t.name} delay={i * 0.1} className="h-full">
                <article
                  className={`flex h-full flex-col rounded-[28px] border p-8 sm:p-9 ${
                    featured
                      ? "border-deep bg-deep text-on-deep shadow-[var(--shadow-float)]"
                      : "border-line bg-surface-2 shadow-[var(--shadow-card)]"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className={`font-display text-[1.6rem] font-bold tracking-[-0.02em] ${featured ? "text-on-deep" : "text-ink"}`}>
                      {t.name}
                    </h3>
                    {t.price ? (
                      <span className={`rounded-full px-3 py-1 font-mono text-[0.74rem] font-bold ${featured ? "bg-mint text-ink" : "bg-accent/15 text-accent-ink"}`}>
                        {t.price}
                      </span>
                    ) : null}
                  </div>
                  <p className={`mt-3 min-h-[3.2em] text-[1rem] leading-snug ${featured ? "text-on-deep-mute" : "text-mute"}`}>{t.audience}</p>

                  <a href={t.cta.href} className={`btn mt-7 justify-between ${featured ? "btn-mint" : ""}`}>
                    {t.cta.label}
                    <span className="chip" aria-hidden="true">
                      <ArrowUpRight />
                    </span>
                  </a>

                  <div className={`mt-8 border-t pt-6 ${featured ? "border-white/12" : "border-line"}`}>
                    <p className={`data-label ${featured ? "!text-mint" : "!text-accent-ink"}`}>{t.includes ?? "Key features"}</p>
                    <ul className="mt-4 flex flex-col gap-3.5">
                      {t.features.map((f) => (
                        <li key={f} className={`flex items-start gap-3 text-[0.98rem] leading-snug ${featured ? "text-on-deep" : "text-ink-2"}`}>
                          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${featured ? "bg-mint/20 text-mint" : "bg-accent/15 text-accent-ink"}`}>
                            <Check width={11} height={11} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */

/** The customer belt, with its headline. */
export function LogoBand() {
  return (
    <section className="pb-4 pt-16 sm:pt-20">
      <p className="shell text-center text-[0.9rem] text-mute">{trust.headline}</p>
      <div className="mt-4">
        <LogoMarquee />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */

/** A centred deep-teal banner with one action — the dot terrain behind it. */
export function Banner({ title, body, action, id }: { title: string; body: string; action: Action; id?: string }) {
  return (
    <section id={id} className="px-3 pb-6 sm:px-5">
      <div className="relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-[32px] bg-deep text-on-deep sm:rounded-[40px]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_50%_70%,oklch(0.5_0.09_175/0.45),transparent_70%)]" />
        <DotField variant="deep" horizon={0.5} className="absolute inset-0 -z-10 h-full w-full" />
        <div className="shell flex flex-col items-center py-20 text-center sm:py-24 lg:py-28">
          <SplitHeadline className="h2 max-w-[20ch] !text-on-deep" words={title.split(" ")} />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-[52ch] text-[1.12rem] leading-relaxed text-on-deep-mute">{body}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <a href={action.href} className="btn btn-mint mt-10">
              {action.label}
              <span className="chip" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
