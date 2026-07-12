import Link from "next/link";
import { Clapperboard, Mail, Users, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { MiniBarChart } from "@/components/admin/mini-bar-chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { seedingStats, getCreators, STATUS_LABELS } from "@/lib/creators";
import { formatPrice } from "@/lib/utils";

// Mock analytics — wire to Supermetrics / GA4 / TikTok Analytics adapters later.
const tiktokTraffic = [
  { label: "Mon", value: 4200 },
  { label: "Tue", value: 5100 },
  { label: "Wed", value: 6800 },
  { label: "Thu", value: 9200 },
  { label: "Fri", value: 14300 },
  { label: "Sat", value: 18100 },
  { label: "Sun", value: 15600 },
];

const topContent = [
  { handle: "@makeupbymina", product: "Flick Hybrid Liner", views: "3.9M", gmv: 8900 },
  { handle: "@glowwithtay", product: "Lash Clusters", views: "2.4M", gmv: 12400 },
  { handle: "@get.ready.gigi", product: "5-Minute Glow Kit", views: "1.8M", gmv: 6100 },
  { handle: "@softglam.jules", product: "Cloud Cream Blush", views: "1.1M", gmv: 4100 },
];

export default function AdminDashboard() {
  const stats = seedingStats();
  const recentCreators = getCreators().slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Growth dashboard</h1>
          <p className="text-muted-foreground">
            Your TikTok-first command center. Track seeding ROI, traffic &amp; content.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/outreach"><Mail className="h-4 w-4" /> New outreach</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/seedance"><Clapperboard className="h-4 w-4" /> New Seedance</Link>
          </Button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Creator GMV (30d)" value={formatPrice(stats.gmv)} delta="+38%" hint="attributed" />
        <StatCard label="Active affiliates" value={String(stats.affiliates)} delta="+3" hint="this month" />
        <StatCard label="Samples → posted" value={`${stats.conversionRate}%`} hint="conversion" />
        <StatCard label="UGC videos" value={String(stats.posts)} delta="+12" hint="all creators" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Traffic chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">TikTok traffic</h2>
              <p className="text-sm text-muted-foreground">Sessions from TikTok, last 7 days</p>
            </div>
            <Badge variant="success" className="gap-1">
              <TrendingUp className="h-3 w-3" /> +64% WoW
            </Badge>
          </div>
          <MiniBarChart data={tiktokTraffic} />
        </div>

        {/* Top content by ROI */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Top content by ROI</h2>
          <ul className="space-y-3">
            {topContent.map((c) => (
              <li key={c.handle} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{c.handle}</p>
                  <p className="text-xs text-muted-foreground">{c.product} · {c.views} views</p>
                </div>
                <Badge variant="viral">{formatPrice(c.gmv)}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent seeding pipeline */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Users className="h-5 w-5" /> Seeding pipeline
          </h2>
          <Button asChild size="sm" variant="ghost">
            <Link href="/admin/seeding">View all</Link>
          </Button>
        </div>
        <div className="space-y-2">
          {recentCreators.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{c.handle}</p>
                <p className="text-xs text-muted-foreground">
                  {Intl.NumberFormat("en", { notation: "compact" }).format(c.followers)} followers · {c.niche}
                </p>
              </div>
              <Badge variant="muted">{STATUS_LABELS[c.status]}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
