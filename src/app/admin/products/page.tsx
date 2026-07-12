import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StockUrgency } from "@/components/marketing/stock-urgency";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const products = getAllProducts();
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="text-muted-foreground">
            {products.length} products · synced to TikTok Shop via Shopify channel
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </header>

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
                  <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                    <Link href={`/products/${p.handle}`} target="_blank">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
