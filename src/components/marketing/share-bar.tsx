"use client";

import * as React from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/utils";

/**
 * TikTok-first share bar. Uses the native Web Share API on mobile (where most
 * TikTok traffic lives) and falls back to per-network links on desktop.
 */
export function ShareBar({
  path,
  title,
  compact = false,
}: {
  path: string;
  title: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const url = absoluteUrl(path);

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    copy();
  }

  function copy() {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const links = [
    {
      label: "TikTok",
      href: `https://www.tiktok.com/upload?shareUrl=${encodeURIComponent(url)}`,
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ];

  if (compact) {
    return (
      <Button variant="outline" size="sm" onClick={nativeShare}>
        <Share2 className="h-4 w-4" /> Share
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="default" size="sm" onClick={nativeShare}>
        <Share2 className="h-4 w-4" /> Share the glow
      </Button>
      {links.map((l) => (
        <Button key={l.label} variant="outline" size="sm" asChild>
          <a href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label}
          </a>
        </Button>
      ))}
      <Button variant="ghost" size="sm" onClick={copy}>
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  );
}
