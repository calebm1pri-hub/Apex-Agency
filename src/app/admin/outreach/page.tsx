import { Suspense } from "react";
import { OutreachForm } from "@/components/admin/outreach-form";
import { fetchAllProducts } from "@/lib/commerce";
import { productNames } from "@/lib/generators";

export default async function OutreachPage() {
  const names = productNames(await fetchAllProducts());
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold">Outreach generator</h1>
        <p className="text-muted-foreground">
          Generate personalized nano-influencer outreach in seconds. Adjust tone,
          product, and commission, then copy or queue the send.
        </p>
      </header>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
        <OutreachForm productNames={names} />
      </Suspense>
    </div>
  );
}
