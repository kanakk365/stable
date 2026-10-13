import type { ReactNode } from "react";

import { DotField } from "@/components/fx/DotField";
import { ArrowUpRight } from "@/components/ui/icons";

type Action = { label: string; href: string };

/**
 * Inner-page hero: the same deep-teal banner as the home page, with the
 * dot terrain and light type. An optional visual floats over the banner's
 * lower edge, half on teal and half on the page ground.
 */
export function PageHero({
  eyebrow,
  title,
  emphasis = [],
  sub,
  primary,
  secondary,
  meta,
  anchors,
  media,
  mediaOffset = "default",
}: {
  eyebrow: string;
  title: string;
  emphasis?: string[];
  sub?: ReactNode;
  primary?: Action;
  secondary?: Action;
  meta?: string;
  anchors?: Action[];
  media?: ReactNode;
  mediaOffset?: "default" | "deep";
}) {
  const words = title.split(" ");
  const pad = media
    ? mediaOffset === "deep"
      ? "pb-[180px] sm:pb-[240px] lg:pb-[300px]"
      : "pb-[150px] sm:pb-[200px] lg:pb-[240px]"
    : "pb-20 sm:pb-24 lg:pb-28";

  return (
    <section className="relative isolate px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-deep text-on-deep sm:rounded-[40px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_40%_at_50%_62%,oklch(0.5_0.09_175/0.5),transparent_70%),radial-gradient(40%_30%_at_50%_0%,oklch(0.4_0.06_200/0.6),transparent_70%)]"
        />
        <DotField variant="deep" horizon={0.55} className="absolute inset-0 -z-10 h-full w-full" />

        <div className={`shell flex flex-col items-center pt-36 text-center sm:pt-40 ${pad}`}>
          <p
            className="soft-in inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 font-mono text-[0.72rem] font-medium tracking-[0.06em] text-mint backdrop-blur"
            style={{ ["--d" as string]: "80ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 className="h1 mt-7 max-w-[18ch] !text-on-deep !text-[clamp(2.4rem,5.4vw,4.6rem)]">
            {words.map((w, i) => (
              <span key={`${w}-${i}`}>
                <span className="mask-word">
                  <span
                    className={emphasis.includes(w) ? "text-mint" : undefined}
                    style={{ ["--d" as string]: `${160 + i * 55}ms` }}
                  >
                    {w}
                  </span>
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          {sub ? (
            <div className="lead soft-in mt-6 !max-w-[60ch] !text-on-deep-mute" style={{ ["--d" as string]: "600ms" }}>
              {sub}
            </div>
          ) : null}

          {primary || secondary ? (
            <div className="soft-in mt-9 flex flex-wrap items-center justify-center gap-3" style={{ ["--d" as string]: "720ms" }}>
              {primary ? (
                <a href={primary.href} className="btn btn-mint">
                  {primary.label}
                  <span className="chip" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </a>
              ) : null}
              {secondary ? (
                <a href={secondary.href} className="btn-ghost btn-ghost-deep">
                  {secondary.label}
                </a>
              ) : null}
            </div>
          ) : null}

          {anchors ? (
            <nav aria-label="On this page" className="soft-in mt-9 flex flex-wrap justify-center gap-2" style={{ ["--d" as string]: "720ms" }}>
              {anchors.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="rounded-full border border-white/14 bg-white/[0.05] px-4 py-2 text-[0.9rem] font-medium text-on-deep transition-colors hover:border-mint/60 hover:bg-white/[0.09]"
                >
                  {a.label}
                </a>
              ))}
            </nav>
          ) : null}

          {meta ? (
            <p className="soft-in mt-8 font-mono text-[0.74rem] tracking-[0.04em] text-on-deep-mute" style={{ ["--d" as string]: "760ms" }}>
              {meta}
            </p>
          ) : null}
        </div>
      </div>

      {media ? (
        <div
          className={`shell stage-in relative z-10 max-w-[1180px] ${
            mediaOffset === "deep" ? "-mt-[140px] sm:-mt-[190px] lg:-mt-[250px]" : "-mt-[110px] sm:-mt-[150px] lg:-mt-[190px]"
          }`}
          style={{ ["--d" as string]: "550ms" }}
        >
          {media}
        </div>
      ) : null}
    </section>
  );
}
