import { Section } from "@/components/home/section";
import { ProductCard } from "@/components/product/product-card";
import { fetchBestsellers } from "@/lib/commerce";

/** Horizontally-scrollable bestseller carousel (snap on mobile). */
export async function Bestsellers() {
  const products = await fetchBestsellers();
  return (
    <Section
      eyebrow="Fan favorites"
      title="Bestsellers going viral"
      description="The products behind millions of GRWM videos — shop the ones everyone's obsessed with."
      href="/shop"
    >
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-4 md:px-0">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[70vw] shrink-0 snap-start sm:w-[45vw] md:w-auto"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </Section>
  );
}
