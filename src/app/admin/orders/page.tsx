import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { adminOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

const statusVariant = {
  processing: "warning",
  shipped: "success",
  delivered: "muted",
  cancelled: "muted",
} as const;

export default function AdminOrdersPage() {
  const revenue = adminOrders.reduce((s, o) => s + o.total, 0);
  const tiktokOrders = adminOrders.filter((o) => o.channel === "TikTok Shop").length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="text-muted-foreground">Unified orders across website + TikTok Shop.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue (shown)" value={formatPrice(revenue)} delta="+22%" />
        <StatCard label="Orders" value={String(adminOrders.length)} />
        <StatCard label="From TikTok Shop" value={`${tiktokOrders}/${adminOrders.length}`} hint="channel mix" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Channel</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {adminOrders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.customer}</td>
                <td className="px-4 py-3">
                  <Badge variant={o.channel === "TikTok Shop" ? "viral" : "secondary"}>
                    {o.channel}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[o.status]} className="capitalize">
                    {o.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
