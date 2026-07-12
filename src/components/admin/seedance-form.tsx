"use client";

import * as React from "react";
import { Check, Clapperboard, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { generateSeedanceScript, type SeedanceOptions } from "@/lib/generators";
import { cn } from "@/lib/utils";

export function SeedanceForm({ productNames }: { productNames: string[] }) {
  const [opts, setOpts] = React.useState<SeedanceOptions>({
    product: productNames[0] ?? "Featherlight Lash Clusters",
    hook: "transformation",
    duration: 30,
    vibe: "aesthetic",
  });
  const [copied, setCopied] = React.useState(false);

  const script = generateSeedanceScript(opts);

  function set<K extends keyof SeedanceOptions>(key: K, value: SeedanceOptions[K]) {
    setOpts((o) => ({ ...o, [key]: value }));
  }

  function copyScript() {
    const text = [
      `TITLE: ${script.title}`,
      `HOOK: ${script.hook}`,
      "",
      "SHOT LIST:",
      ...script.shots.map((s) => `[${s.time}] ${s.direction}\n  VO: "${s.voiceover}"`),
      "",
      `CAPTION: ${script.caption}`,
      `HASHTAGS: ${script.hashtags.join(" ")}`,
    ].join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const hooks: SeedanceOptions["hook"][] = ["transformation", "problem", "trend", "unboxing"];
  const vibes: SeedanceOptions["vibe"][] = ["aesthetic", "chaotic", "educational"];
  const durations: SeedanceOptions["duration"][] = [15, 30, 60];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Controls */}
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-1.5">
          <Label>Product</Label>
          <select
            value={opts.product}
            onChange={(e) => set("product", e.target.value)}
            className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {productNames.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Hook style</Label>
          <div className="grid grid-cols-2 gap-2">
            {hooks.map((h) => (
              <button
                key={h}
                onClick={() => set("hook", h)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs font-medium capitalize transition-colors",
                  opts.hook === h
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent"
                )}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Duration</Label>
          <div className="flex gap-2">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => set("duration", d)}
                className={cn(
                  "flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                  opts.duration === d
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent"
                )}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Vibe</Label>
          <div className="flex gap-2">
            {vibes.map((v) => (
              <button
                key={v}
                onClick={() => set("vibe", v)}
                className={cn(
                  "flex-1 rounded-full border px-3 py-2 text-xs font-medium capitalize transition-colors",
                  opts.vibe === v
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
          <Sparkles className="mb-1 inline h-3.5 w-3.5 text-primary" /> Seedance
          scripts are built for affiliates to film fast. Export, attach to a
          sample, and track posts back in the seeding pipeline.
        </div>
      </div>

      {/* Script output */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Clapperboard className="h-4 w-4" /> {script.title}
          </h3>
          <Button size="sm" variant="outline" onClick={copyScript}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy script"}
          </Button>
        </div>

        <div className="rounded-xl bg-accent/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hook
          </p>
          <p className="mt-1 font-medium">&quot;{script.hook}&quot;</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Shot list
          </p>
          <ol className="space-y-3">
            {script.shots.map((s, i) => (
              <li key={i} className="flex gap-3">
                <Badge variant="muted" className="mt-0.5 shrink-0 font-mono">
                  {s.time}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{s.direction}</p>
                  <p className="text-sm text-muted-foreground">VO: &quot;{s.voiceover}&quot;</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Caption
          </p>
          <p className="text-sm">{script.caption}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {script.hashtags.map((h) => (
              <span key={h} className="text-xs font-medium text-primary">{h}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
