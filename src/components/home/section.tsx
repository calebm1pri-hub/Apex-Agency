import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared section wrapper with eyebrow, heading, and optional "see all" link. */
export function Section({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "See all",
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-14 md:py-20", className)}>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            {hrefLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
