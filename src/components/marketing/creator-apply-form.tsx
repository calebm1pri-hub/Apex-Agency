"use client";

import * as React from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreatorApplyForm() {
  const [state, setState] = React.useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      await fetch("/api/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* stub */
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-gradient-to-br from-blush-500/15 to-transparent p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="font-display text-2xl font-semibold">You&apos;re in the pipeline! 🎀</h2>
        <p className="max-w-md text-muted-foreground">
          We review applications weekly. If it&apos;s a match, we&apos;ll email you a
          free product + your affiliate link. Keep creating!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="handle">TikTok handle</Label>
          <Input id="handle" name="handle" required placeholder="@yourhandle" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="followers">Followers</Label>
          <Input id="followers" name="followers" type="number" required placeholder="e.g. 8500" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="niche">Your niche</Label>
          <Input id="niche" name="niche" placeholder="e.g. everyday glam, GRWM" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="region">Region</Label>
          <Input id="region" name="region" placeholder="e.g. US-CA" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="why">Why Marnie? (optional)</Label>
        <Textarea id="why" name="why" placeholder="Tell us about your content and why you'd love to partner…" />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={state === "loading"}>
        {state === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <><Sparkles className="h-5 w-5" /> Apply to the creator program</>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Free product · up to 25% commission · nano &amp; micro creators welcome
      </p>
    </form>
  );
}
