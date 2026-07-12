"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateOutreachEmail, type OutreachOptions } from "@/lib/generators";
import { cn } from "@/lib/utils";

export function OutreachForm({ productNames }: { productNames: string[] }) {
  const params = useSearchParams();
  const [opts, setOpts] = React.useState<OutreachOptions>({
    creatorHandle: params.get("creator") ?? "@creator",
    creatorName: "",
    product: productNames[0] ?? "Featherlight Lash Clusters",
    tone: "genz",
    commission: 20,
    offerSample: true,
  });
  const [copied, setCopied] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const email = generateOutreachEmail(opts);

  function set<K extends keyof OutreachOptions>(key: K, value: OutreachOptions[K]) {
    setOpts((o) => ({ ...o, [key]: value }));
  }

  function copy() {
    navigator.clipboard?.writeText(`Subject: ${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function send() {
    // Fires the outreach automation (Zapier/Gmail adapter) — stubbed in demo.
    await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...opts, subject: email.subject, body: email.body }),
    }).catch(() => {});
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  const tones: OutreachOptions["tone"][] = ["genz", "friendly", "professional"];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Controls */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Creator handle</Label>
            <Input
              value={opts.creatorHandle}
              onChange={(e) => set("creatorHandle", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Name (optional)</Label>
            <Input
              value={opts.creatorName}
              placeholder="Taylor"
              onChange={(e) => set("creatorName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Product to seed</Label>
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
          <Label>Tone</Label>
          <div className="flex gap-2">
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => set("tone", t)}
                className={cn(
                  "flex-1 rounded-full border px-3 py-2 text-xs font-medium capitalize transition-colors",
                  opts.tone === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent"
                )}
              >
                {t === "genz" ? "Gen-Z" : t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Commission: {opts.commission}%</Label>
          <input
            type="range"
            min={10}
            max={30}
            value={opts.commission}
            onChange={(e) => set("commission", Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={opts.offerSample}
            onChange={(e) => set("offerSample", e.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          Offer a free sample
        </label>
      </div>

      {/* Preview */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Mail className="h-4 w-4" /> Preview
          </h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" onClick={send}>
              {sent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {sent ? "Queued" : "Send"}
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input readOnly value={email.subject} />
        </div>
        <div className="space-y-1.5">
          <Label>Body</Label>
          <Textarea readOnly value={email.body} className="min-h-72 font-mono text-xs" />
        </div>
        <p className="text-xs text-muted-foreground">
          Tip: swap the template engine in <code>lib/generators.ts</code> for a
          Claude API call to fully personalize each email from the creator&apos;s bio.
        </p>
      </div>
    </div>
  );
}
