import { ProductManager } from "@/components/admin/product-manager";
import { fetchAllProducts, isCommerceLive } from "@/lib/commerce";

export default async function AdminProductsPage() {
  const products = await fetchAllProducts();
  return <ProductManager initialProducts={products} live={isCommerceLive} />;
}
