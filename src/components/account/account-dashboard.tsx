"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Package, Sparkles, Truck, Gift, Heart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistGrid } from "@/components/account/wishlist-grid";
import { ReferralWidget } from "@/components/marketing/referral-widget";
import { getOrders } from "@/lib/orders";
import { getReferralInfo } from "@/lib/referral";
import { getLoyaltyState, EARN_RULES, TIERS } from "@/lib/loyalty";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const statusVariant = {
  processing: "warning",
  shipped: "success",
  delivered: "muted",
  cancelled: "muted",
} as const;

function OrderRow({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{order.id}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.date).toLocaleDateString("en-US", { dateStyle: "medium" })}
          </p>
        </div>
        <Badge variant={statusVariant[order.status]} className="capitalize">
          {order.status}
        </Badge>
      </div>
      <div className="mt-3 flex items-center gap-3">
        {order.items.map((item, i) => (
          <div key={i} className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
            <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
          </div>
        ))}
        <div className="ml-auto text-right">
          <p className="font-semibold">{formatPrice(order.total)}</p>
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Truck className="h-3 w-3" /> Track
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function AccountDashboard() {
  const params = useSearchParams();
  const tab = params.get("tab") ?? "orders";
  const orders = getOrders();
  const referral = getReferralInfo();
  const loyalty = getLoyaltyState();

  return (
    <Tabs defaultValue={tab} className="w-full">
      <TabsList className="mb-6 flex-wrap">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        <TabsTrigger value="loyalty">Glow Points</TabsTrigger>
        <TabsTrigger value="referrals">Refer &amp; Earn</TabsTrigger>
      </TabsList>

      {/* Orders */}
      <TabsContent value="orders">
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      </TabsContent>

      {/* Wishlist */}
      <TabsContent value="wishlist">
        <WishlistGrid />
      </TabsContent>

      {/* Loyalty */}
      <TabsContent value="loyalty">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-blush-500/15 to-transparent p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <Badge variant="viral">{loyalty.tier.name} tier</Badge>
            </div>
            <p className="mt-4 font-display text-5xl font-semibold">{loyalty.points}</p>
            <p className="text-sm text-muted-foreground">Glow Points</p>
            {loyalty.nextTier && (
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>{loyalty.tier.name}</span>
                  <span>{loyalty.pointsToNext} pts to {loyalty.nextTier.name}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blush-400 to-rose-400"
                    style={{
                      width: `${Math.min(100, (loyalty.points / loyalty.nextTier.min) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border p-5">
              <h3 className="mb-3 font-semibold">Ways to earn</h3>
              <ul className="space-y-2">
                {EARN_RULES.map((r) => (
                  <li key={r.action} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{r.action}</span>
                    <span className="font-semibold text-primary">+{r.points}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border p-5">
              <h3 className="mb-3 font-semibold">Tiers</h3>
              <ul className="space-y-2 text-sm">
                {TIERS.map((t) => (
                  <li key={t.name} className="flex items-start gap-2">
                    <Gift className="mt-0.5 h-4 w-4 text-primary" />
                    <span>
                      <b>{t.name}</b> ({t.min}+ pts) — {t.perk}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Referrals */}
      <TabsContent value="referrals">
        <ReferralWidget info={referral} />
      </TabsContent>
    </Tabs>
  );
}
