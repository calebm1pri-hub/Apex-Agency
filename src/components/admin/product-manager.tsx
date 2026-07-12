"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Loader2, Pencil, Plus } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockUrgency } from "@/components/marketing/stock-urgency";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { categories } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

type Draft = Partial<Product> & { imageUrl?: string };

export function ProductManager({
  initialProducts,
  live,
}: {
  initialProducts: Product[];
  live: boolean;
}) {
  const [products, setProducts] = React.useState(initialProducts);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>({});
  const [saving, setSaving] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  function edit(p: Product) {
    setDraft({ ...p, imageUrl: p.images[0]?.url });
    setOpen(true);
  }
  function add() {
    setDraft({ category: "sets", currency: "USD", price: 0, stock: 20, bundleEligible: true });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Save failed");
      // Update local list optimistically.
      setProducts((prev) => {
        const exists = prev.some((p) => p.handle === data.product.handle);
        return exists
          ? prev.map((p) => (p.handle === data.product.handle ? data.product : p))
          : [...prev, data.product];
      });
      setNotice(data.demo ? "Saved in demo mode (connect Supabase to persist)." : "Saved ✓");
      setOpen(false);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="text-muted-foreground">
            {products.length} products ·{" "}
            {live ? "live in Supabase" : "demo mode (seed catalog)"}
          </p>
        </div>
        <Button size="sm" onClick={add}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </header>

      {notice && (
        <div className="rounded-xl bg-accent px-4 py-2 text-sm text-accent-foreground">
          {notice}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Inventory</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Tags</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                      <Image src={p.images[0].url} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className="font-medium">{p.stock}</span>
                  <StockUrgency stock={p.stock} className="mt-0.5" />
                </td>
                <td className="px-4 py-3">{p.rating} ★</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.tiktokViral && <Badge variant="viral">Viral</Badge>}
                    {p.bestseller && <Badge variant="secondary">Bestseller</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => edit(p)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                      <Link href={`/products/${p.handle}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{draft.id ? "Edit product" : "New product"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={draft.name ?? ""} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input value={draft.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Price</Label>
                <Input type="number" value={draft.price ?? 0} onChange={(e) => set("price", Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Compare at</Label>
                <Input type="number" value={draft.compareAtPrice ?? ""} onChange={(e) => set("compareAtPrice", e.target.value ? Number(e.target.value) : undefined)} />
              </div>
              <div className="space-y-1.5">
                <Label>Stock</Label>
                <Input type="number" value={draft.stock ?? 0} onChange={(e) => set("stock", Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select
                value={draft.category ?? "sets"}
                onChange={(e) => set("category", e.target.value as Product["category"])}
                className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {categories.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input value={draft.imageUrl ?? ""} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-4">
              {(["bestseller", "tiktokViral", "bundleEligible"] as const).map((flag) => (
                <label key={flag} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(draft[flag])}
                    onChange={(e) => set(flag, e.target.checked)}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  {flag === "tiktokViral" ? "TikTok Viral" : flag === "bundleEligible" ? "Bundle eligible" : "Bestseller"}
                </label>
              ))}
            </div>
            <Button className="w-full" onClick={save} disabled={saving || !draft.name}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save product"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
