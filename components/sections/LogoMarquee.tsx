import { logos } from "@/lib/content";

/**
 * Customer logos on an endless belt. Logos sit in ink-tinted greyscale and
 * come up to full colour on hover; the belt pauses under the pointer.
 */
export function LogoMarquee() {
  const row = [...logos, ...logos];
  return (
    <div
      className="marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
      aria-label="Customers"
    >
      <ul className="marquee-track flex w-max items-center">
        {row.map((l, i) => (
          <li
            key={`${l.name}-${i}`}
            className="flex h-16 shrink-0 items-center px-8 sm:px-11"
            aria-hidden={i >= logos.length ? true : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={l.src}
              alt={i >= logos.length ? "" : l.name}
              style={{ height: l.h }}
              className="w-auto max-w-[150px] object-contain opacity-60 grayscale transition-[filter,opacity] duration-500 hover:opacity-100 hover:grayscale-0"
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
