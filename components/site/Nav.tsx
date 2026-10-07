"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { EASE } from "@/components/fx/motion";
import { Logo } from "@/components/ui/Logo";
import { ArrowUpRight, ChevronDown } from "@/components/ui/icons";
import { nav, type NavGroup } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  // At the top the bar sits on the deep-teal hero banner, so it reads light.
  const onDark = !scrolled && !open;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto flex max-w-[1280px] items-center gap-4 rounded-full border px-3 py-2 pl-5 transition-[background-color,border-color,box-shadow,backdrop-filter,translate] duration-500 ease-[var(--ease-out-soft)] ${
          scrolled
            ? "translate-y-0 border-line bg-surface/75 shadow-[0_12px_40px_-20px_oklch(0.25_0.035_182/0.35)] backdrop-blur-xl"
            : // Resting on the hero banner: sit lower so the bar has air above it.
              "translate-y-5 border-transparent bg-transparent sm:translate-y-7"
        }`}
      >
        <Link href="/" aria-label="Stable Auto home" className={`shrink-0 transition-colors duration-500 ${onDark ? "text-on-deep" : "text-ink"}`}>
          <Logo className="h-7 w-auto" />
        </Link>

        <nav aria-label="Primary" className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.links.map((g) => (
              <li key={g.label}>
                {g.children ? (
                  <Dropdown group={g} onDark={onDark} />
                ) : (
                  <Link
                    href={g.href ?? "/"}
                    className={`rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors ${onDark ? "text-on-deep-mute hover:bg-white/[0.08] hover:text-on-deep" : "text-ink-2 hover:bg-ink/[0.05] hover:text-ink"}`}
                  >
                    {g.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <a
            href={nav.login.href}
            className={`rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors ${onDark ? "text-on-deep-mute hover:text-on-deep" : "text-ink-2 hover:text-ink"}`}
          >
            {nav.login.label}
          </a>
          <a href={nav.cta.href} className={`btn !py-1.5 !pl-5 !pr-1.5 !text-[0.92rem] ${onDark ? "btn-mint" : ""}`}>
            {nav.cta.label}
            <span className="chip !h-8 !w-8" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className={`relative z-[var(--z-sheet)] ml-auto grid h-11 w-11 place-items-center rounded-full border transition-colors duration-500 lg:hidden ${onDark ? "border-white/20 bg-white/[0.06] text-on-deep" : "border-line-strong bg-surface-2/80 text-ink"}`}
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute inset-x-0 top-0 h-[1.5px] bg-current transition-transform duration-300 ${open ? "translate-y-[5.25px] rotate-45" : ""}`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-[1.5px] bg-current transition-transform duration-300 ${open ? "-translate-y-[5.25px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 28px)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 28px)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 28px)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="fixed inset-x-3 top-3 z-[var(--z-overlay)] max-h-[calc(100svh-24px)] overflow-y-auto rounded-[28px] border border-line bg-surface-2 px-6 pb-6 pt-20 shadow-[0_40px_80px_-30px_oklch(0.25_0.035_182/0.4)] lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.links.map((g, i) => (
                <motion.li
                  key={g.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.05 }}
                  className="border-b border-line py-3"
                >
                  {g.children ? (
                    <>
                      <p className="data-label mb-2">{g.label}</p>
                      <ul className="flex flex-col gap-1">
                        {g.children.map((c) => (
                          <li key={c.label}>
                            <a
                              href={c.href}
                              onClick={() => setOpen(false)}
                              className="block py-1.5 text-[1.15rem] font-semibold text-ink"
                            >
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={g.href ?? "/"}
                      onClick={() => setOpen(false)}
                      className="block py-1.5 text-[1.15rem] font-semibold text-ink"
                    >
                      {g.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <a href={nav.cta.href} className="btn w-full justify-between">
                {nav.cta.label}
                <span className="chip" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
              <a href={nav.login.href} className="btn-ghost w-full">
                {nav.login.label}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Dropdown({ group, onDark }: { group: NavGroup; onDark: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onPointerEnter={show}
      onPointerLeave={hide}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={(e) => {
          // Hover already opened it for mouse users; a click shouldn't undo that.
          const mouse = (e.nativeEvent as PointerEvent).pointerType === "mouse";
          setOpen((v) => (mouse ? true : !v));
        }}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors ${
          onDark
            ? `hover:bg-white/[0.08] hover:text-on-deep ${open ? "bg-white/[0.08] text-on-deep" : "text-on-deep-mute"}`
            : `hover:bg-ink/[0.05] hover:text-ink ${open ? "bg-ink/[0.05] text-ink" : "text-ink-2"}`
        }`}
      >
        {group.label}
        <ChevronDown className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute left-1/2 top-full z-[var(--z-dropdown)] w-[320px] -translate-x-1/2 pt-3"
          >
            <ul className="overflow-hidden rounded-2xl border border-line bg-surface-2 p-2 shadow-[0_30px_60px_-24px_oklch(0.25_0.035_182/0.35)]">
              {group.children!.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="group/item flex items-start justify-between gap-4 rounded-xl px-3.5 py-3 transition-colors hover:bg-mist"
                  >
                    <span>
                      <span className="block text-[0.95rem] font-semibold text-ink">{c.label}</span>
                      {c.note && (
                        <span className="mt-0.5 block text-[0.84rem] leading-snug text-mute">
                          {c.note}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight className="mt-1 shrink-0 text-accent-ink opacity-0 transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
