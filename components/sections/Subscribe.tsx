"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

import { EASE, Reveal, SplitHeadline } from "@/components/fx/motion";
import { ArrowRight, Check, LinkedIn, XLogo } from "@/components/ui/icons";
import { subscribe } from "@/lib/content";

export function Subscribe() {
  return (
    <section className="section">
      <div className="shell grid items-stretch gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="kicker">{subscribe.kicker}</p>
          </Reveal>
          <SplitHeadline className="h2 mt-6 max-w-[12ch]" words={subscribe.headline.split(" ")} emphasis={["fast."]} />
          <Reveal delay={0.1}>
            <p className="lead mt-6 max-w-[44ch]">{subscribe.body}</p>
            <div className="mt-8 flex gap-3">
              {subscribe.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line-strong text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-mint"
                >
                  {s.label === "LinkedIn" ? <LinkedIn /> : <XLogo />}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="h-full">
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}

function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    // TODO: post to the HubSpot newsletter form used on stable.auto.
    setState("done");
  };

  return (
    <div className="flex h-full flex-col justify-center rounded-[28px] border border-line bg-surface-2 p-7 shadow-[var(--shadow-card)] sm:p-10">
      <p className="font-display text-[1.35rem] font-semibold leading-snug tracking-[-0.015em] text-ink">{subscribe.form}</p>
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.p
            key="done"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-6 flex items-center gap-3 rounded-full bg-accent/12 px-5 py-4 font-semibold text-ink"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-deep text-mint">
              <Check />
            </span>
            Thanks. You&rsquo;re on the list.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <label htmlFor={id} className="sr-only">
              Work email
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id={id}
                type="email"
                autoComplete="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                aria-invalid={state === "error"}
                aria-describedby={state === "error" ? `${id}-err` : undefined}
                className="input"
              />
              <button type="submit" className="btn shrink-0 justify-between">
                Subscribe
                <span className="chip" aria-hidden="true">
                  <ArrowRight />
                </span>
              </button>
            </div>
            <p id={`${id}-err`} role="alert" className={`mt-3 text-[0.88rem] text-[oklch(0.5_0.16_30)] ${state === "error" ? "" : "invisible"}`}>
              Enter a valid email address, like name@company.com.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
