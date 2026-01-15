import { FilterBar } from "@/components/catalog/FilterBar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Header } from "@/components/layout/Header";
import { ProductDrawer } from "@/components/details/ProductDrawer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <Header />
      <FilterBar />
      <ProductGrid />
      <ProductDrawer />
      <CartDrawer />

      {/* Drawers will be placed here eventually */}
    </main>
  );
}
