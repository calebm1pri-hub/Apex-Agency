"use client";

import * as React from "react";
import { Check, Copy, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShareBar } from "@/components/marketing/share-bar";
import type { ReferralInfo } from "@/lib/referral";

export function ReferralWidget({ info }: { info: ReferralInfo }) {
  const [copied, setCopied] = React.useState(false);

  function copy() {
    navigator.clipboard?.writeText(info.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-blush-500/15 to-transparent p-6">
      <Gift className="mb-3 h-8 w-8 text-primary" />
      <h2 className="font-display text-2xl font-semibold">Share &amp; get a free brush</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Give friends 15% off. For every friend who orders, you earn a free Mini
        Glow Brush. {info.nextReward}.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-background p-4 text-center">
          <p className="font-display text-2xl font-semibold">{info.referred}</p>
          <p className="text-xs text-muted-foreground">Friends referred</p>
        </div>
        <div className="rounded-2xl bg-background p-4 text-center">
          <p className="font-display text-2xl font-semibold">{info.rewardsEarned}</p>
          <p className="text-xs text-muted-foreground">Rewards earned</p>
        </div>
        <div className="rounded-2xl bg-background p-4 text-center">
          <p className="font-display text-2xl font-semibold">15%</p>
          <p className="text-xs text-muted-foreground">Off for friends</p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Input readOnly value={info.url} className="font-mono text-xs" />
        <Button onClick={copy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="mt-4">
        <ShareBar path={`/?ref=${info.code}`} title="Get 15% off Marnie — my code inside ✨" />
      </div>
    </div>
  );
}
