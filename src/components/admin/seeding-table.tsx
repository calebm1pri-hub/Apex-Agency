"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Package, Check } from "lucide-react";
import type { Creator } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATUS_LABELS } from "@/lib/creators";
import { cn, formatPrice } from "@/lib/utils";

const statusVariant: Record<Creator["status"], "muted" | "success" | "warning" | "viral"> = {
  prospect: "muted",
  contacted: "warning",
  interested: "warning",
  sample_sent: "warning",
  posted: "success",
  affiliate: "viral",
  declined: "muted",
};

const filters: (Creator["status"] | "all")[] = [
  "all",
  "prospect",
  "contacted",
  "sample_sent",
  "posted",
  "affiliate",
];

export function SeedingTable({ creators }: { creators: Creator[] }) {
  const [filter, setFilter] = React.useState<Creator["status"] | "all">("all");
  const [query, setQuery] = React.useState("");

  const rows = creators.filter((c) => {
    const matchStatus = filter === "all" || c.status === filter;
    const matchQuery =
      !query ||
      c.handle.toLowerCase().includes(query.toLowerCase()) ||
      c.niche.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              )}
            >
              {f === "all" ? "All" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
        <Input
          placeholder="Search creators…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Creator</th>
              <th className="px-4 py-3 font-semibold">Followers</th>
              <th className="px-4 py-3 font-semibold">Engagement</th>
              <th className="px-4 py-3 font-semibold">Tier</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">GMV</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{c.handle}</p>
                  <p className="text-xs text-muted-foreground">{c.niche} · {c.region}</p>
                </td>
                <td className="px-4 py-3">
                  {Intl.NumberFormat("en", { notation: "compact" }).format(c.followers)}
                </td>
                <td className="px-4 py-3 text-emerald-500">{c.engagementRate}%</td>
                <td className="px-4 py-3 capitalize">{c.tier}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[c.status]}>{STATUS_LABELS[c.status]}</Badge>
                </td>
                <td className="px-4 py-3">{c.gmv ? formatPrice(c.gmv) : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                      <Link href={`/admin/outreach?creator=${encodeURIComponent(c.handle)}`}>
                        <Mail className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1 px-2 text-xs"
                      title={c.sampleSent ? "Sample sent" : "Send sample"}
                    >
                      {c.sampleSent ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Package className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {rows.length} of {creators.length} creators
      </p>
    </div>
  );
}
