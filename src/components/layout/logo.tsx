import { cn } from "@/lib/utils";

/**
 * MARNIE wordmark — an inline SVG so it stays crisp at any size, adapts to
 * the current theme (uses currentColor), and needs no image request.
 * The dot on the "i" is a small glow-blush accent — a beauty-mark motif.
 */
export function Logo({
  className,
  withAccent = true,
}: {
  className?: string;
  withAccent?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-display text-2xl font-semibold tracking-tight",
        className
      )}
      aria-label="Marnie"
    >
      <span>Marn</span>
      <span className="relative">
        i
        {withAccent && (
          <span
            aria-hidden
            className="absolute -top-[0.15em] left-1/2 h-[0.22em] w-[0.22em] -translate-x-1/2 rounded-full bg-gradient-to-br from-blush-400 to-rose-400 shadow-[var(--shadow-glow)]"
          />
        )}
      </span>
      <span>e</span>
    </span>
  );
}

/** Standalone glyph mark (the "M" beauty drop) for favicons / compact spots. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="marnie-grad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stopColor="#ff85a8" />
          <stop offset="1" stopColor="#cf5f45" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" stroke="url(#marnie-grad)" strokeWidth="2" />
      <path
        d="M11 27V14l9 7 9-7v13"
        stroke="url(#marnie-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
