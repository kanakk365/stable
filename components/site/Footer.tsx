import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { LinkedIn, XLogo } from "@/components/ui/icons";
import { footer, nav, subscribe } from "@/lib/content";

export function Footer() {
  const groups = nav.links.filter((g) => g.children);
  return (
    <footer className="relative overflow-hidden border-t border-line bg-mist-2/70">
      <div className="shell pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <Link href="/" aria-label="Stable Auto home" className="inline-block w-fit text-ink">
              <Logo className="h-9 w-auto" />
            </Link>
            <p className="mt-6 max-w-[44ch] text-mute">
              Predict ROI for your next EV charging station. Stable uses 70+ variables to forecast utilization, energy
              costs, and potential revenue.
            </p>
            <div className="mt-8 flex gap-2 lg:mt-auto lg:pt-8">
              {subscribe.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink-2 transition-colors hover:border-ink hover:bg-ink hover:text-mint"
                >
                  {s.label === "LinkedIn" ? <LinkedIn width={16} height={16} /> : <XLogo width={14} height={14} />}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {groups.map((g) => (
              <div key={g.label}>
                <p className="data-label">{g.label}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {g.children!.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="font-medium text-ink-2 transition-colors hover:text-accent-ink">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-6 text-[0.86rem] text-mute sm:flex-row sm:items-center sm:justify-between">
          <span>{footer.copyright}</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the page edge */}
      <div aria-hidden="true" className="pointer-events-none h-[15vw] select-none overflow-hidden px-3 text-ink/[0.05]">
        <Logo mono className="h-auto w-full" />
      </div>
    </footer>
  );
}
