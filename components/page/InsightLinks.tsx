import { Reveal } from "@/components/fx/motion";
import { ArrowUpRight } from "@/components/ui/icons";
import { resources } from "@/lib/pages/company";

import { SectionIntro } from "./blocks";

const ICONS: Record<(typeof resources)[number]["id"], React.ReactNode> = {
  utilization: <path d="M4 20h16M6 16l4-5 3 3 5-7" />,
  pricing: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 9.5c-.5-1-1.4-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.9 2.5 2-1 2-2.5 2c-1.2 0-2.1-.6-2.6-1.6M12 6.5v1.5M12 16v1.5" />
    </>
  ),
};

/** "Explore Stable insights and data" — the resource cards from About. */
export function InsightLinks({ exclude, title = "Explore Stable insights and data" }: { exclude?: string; title?: string }) {
  const items = resources.filter((r) => r.id !== exclude);
  return (
    <section className="section bg-mist-2/60">
      <div className="shell">
        <SectionIntro title={title} emphasis={["insights"]} />
        <div className={`mt-14 grid gap-5 lg:gap-6 ${items.length > 1 ? "mx-auto max-w-[920px] md:grid-cols-2" : "mx-auto max-w-[920px]"}`}>
          {items.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.1} className="h-full">
              <a
                href={r.href}
                className={`group flex h-full rounded-[24px] border border-line bg-surface-2 p-7 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-float)] ${items.length > 1 ? "flex-col" : "flex-col gap-6 sm:flex-row sm:items-center sm:p-8"}`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-deep text-mint">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {ICONS[r.id]}
                  </svg>
                </span>
                <span className={items.length > 1 ? "mt-7 block" : "block"}>
                  <h3 className="font-display text-[1.3rem] font-bold tracking-[-0.02em] text-ink">{r.title}</h3>
                  <p className="mt-2 text-mute">{r.body}</p>
                </span>
                <span className={`link-arrow text-[0.95rem] ${items.length > 1 ? "mt-auto pt-7" : "sm:ml-auto sm:shrink-0"}`}>
                  <span className="border-b border-accent/50 pb-0.5 group-hover:border-accent">{r.cta}</span>
                  <ArrowUpRight className="arr text-accent-ink" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
