import { SeedanceForm } from "@/components/admin/seedance-form";
import { fetchAllProducts } from "@/lib/commerce";
import { productNames } from "@/lib/generators";

export default async function SeedancePage() {
  const names = productNames(await fetchAllProducts());
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold">Seedance studio</h1>
        <p className="text-muted-foreground">
          Generate ready-to-film UGC video scripts for your seeded creators —
          hook, shot list, caption &amp; hashtags, sized to the format.
        </p>
      </header>
      <SeedanceForm productNames={names} />
    </div>
  );
}
