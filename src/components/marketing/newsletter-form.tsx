"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Captures emails for the Klaviyo-style welcome flow.
 * Posts to /api/subscribe which triggers the email adapter (stubbed).
 */
export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
    } catch {
      /* stub — non-blocking */
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
        <Check className="h-4 w-4" /> You&apos;re on the glow list — check your inbox for 15% off ✨
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm gap-2">
      <Input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <Button type="submit" disabled={state === "loading"}>
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
      </Button>
    </form>
  );
}
