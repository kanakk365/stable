import type { ReactNode } from "react";

import { Logo } from "@/components/ui/Logo";

/**
 * A Stable app window drawn in code: browser chrome, the deep-teal app bar,
 * then whatever product view sits inside. Vector all the way down, so it
 * stays sharp at any size.
 */
export function AppWindow({ section, children, label }: { section: string; children: ReactNode; label: string }) {
  return (
    <figure
      aria-label={label}
      className="min-w-0 overflow-hidden rounded-[22px] border border-line bg-surface-2 shadow-[var(--shadow-float)]"
    >
      <div className="flex items-center gap-4 border-b border-line bg-surface px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        </span>
        <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-lg bg-mist px-3 py-1 font-mono text-[0.7rem] text-mute sm:px-10">
          <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor" aria-hidden="true">
            <path d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5Zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2Z" />
          </svg>
          app.stable.auto
        </span>
        <span className="w-[42px]" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-4 bg-deep px-5 py-2.5 text-on-deep">
        <Logo className="h-6 w-auto shrink-0" />
        <span className="h-4 w-px shrink-0 bg-white/15" aria-hidden="true" />
        <span className="truncate whitespace-nowrap font-mono text-[0.72rem] font-medium tracking-[0.04em] text-mint">{section}</span>
        <span className="ml-auto hidden shrink-0 items-center gap-2 sm:flex" aria-hidden="true">
          <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25 text-[0.62rem] text-on-deep-mute">?</span>
          <span className="h-6 w-6 rounded-full bg-mint/90" />
        </span>
      </div>

      {children}
    </figure>
  );
}
