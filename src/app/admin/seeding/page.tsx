import Link from "next/link";
import { Plus } from "lucide-react";
import { SeedingTable } from "@/components/admin/seeding-table";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import { getCreators, seedingStats } from "@/lib/creators";
import { formatPrice } from "@/lib/utils";

export default function SeedingPage() {
  const creators = getCreators();
  const stats = seedingStats();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Creator seeding</h1>
          <p className="text-muted-foreground">
            Your nano &amp; micro-influencer pipeline — track outreach, samples, and sales.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/creators/apply"><Plus className="h-4 w-4" /> Add creator</Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total creators" value={String(stats.total)} />
        <StatCard label="Samples sent" value={String(stats.samplesSent)} />
        <StatCard label="Affiliates" value={String(stats.affiliates)} hint="converted" />
        <StatCard label="Attributed GMV" value={formatPrice(stats.gmv)} delta="+38%" />
      </div>

      <SeedingTable creators={creators} />
    </div>
  );
}
