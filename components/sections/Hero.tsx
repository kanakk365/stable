import { DotField } from "@/components/fx/DotField";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { hero, insightsHref, trust } from "@/lib/content";

import { HeroStage } from "./HeroStage";
import { LogoMarquee } from "./LogoMarquee";

export function Hero() {
  return (
    <section className="relative isolate px-3 pt-3 sm:px-5 sm:pt-5">
      {/* The banner: deep teal, matching the CTA band, with the dot terrain
          rolling toward a horizon under the copy. */}
      <div
        data-hero-banner
        className="relative isolate overflow-hidden rounded-[32px] bg-deep text-on-deep sm:rounded-[40px]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_38%_at_50%_58%,oklch(0.5_0.09_175/0.55),transparent_70%),radial-gradient(40%_30%_at_50%_0%,oklch(0.4_0.06_200/0.6),transparent_70%)]"
        />
        <DotField variant="deep" horizon={0.5} className="absolute inset-0 -z-10 h-full w-full" />

        <div className="shell flex flex-col items-center pb-[200px] pt-32 text-center sm:pb-[260px] sm:pt-36 lg:pb-[300px]">
          <a
            href={insightsHref}
            className="soft-in group inline-flex max-w-full items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-[0.86rem] text-on-deep backdrop-blur transition-colors hover:border-mint/60"
            style={{ ["--d" as string]: "80ms" }}
          >
            <span className="shrink-0 rounded-full bg-mint px-2.5 py-0.5 font-mono text-[0.68rem] font-medium tracking-[0.04em] text-ink">
              New Oct &rsquo;25
            </span>
            <span className="truncate">Pricing, Utilization &amp; Gas Price indices</span>
            <ArrowRight className="shrink-0 text-mint transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>

          <h1 className="h1 mt-7 max-w-[15ch] !text-on-deep sm:max-w-[17ch]">
            {hero.headline.map((w, i) => (
              <span key={`${w}-${i}`}>
                <span className="mask-word">
                  <span
                    className={hero.emphasis.includes(w) ? "text-mint" : undefined}
                    style={{ ["--d" as string]: `${160 + i * 65}ms` }}
                  >
                    {w}
                  </span>
                </span>
                {i < hero.headline.length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          <p className="lead soft-in mt-6 !max-w-[54ch] !text-on-deep-mute" style={{ ["--d" as string]: "650ms" }}>
            {hero.sub}
          </p>

          <div className="soft-in mt-9 flex flex-wrap items-center justify-center gap-3" style={{ ["--d" as string]: "780ms" }}>
            <a href={hero.primary.href} className="btn btn-mint">
              {hero.primary.label}
              <span className="chip" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
            <a href={hero.secondary.href} className="btn-ghost btn-ghost-deep">
              {hero.secondary.label}
            </a>
          </div>
        </div>
      </div>

      {/* The product stage floats over the banner's lower edge */}
      <div className="shell relative z-10 -mt-[160px] max-w-[1240px] sm:-mt-[210px] lg:-mt-[250px]">
        <HeroStage />
      </div>

      <div className="relative pb-4 pt-20 sm:pt-24">
        <p className="shell text-center text-[0.9rem] text-mute">{trust.headline}</p>
        <div className="mt-4">
          <LogoMarquee />
        </div>
      </div>
    </section>
  );
}
