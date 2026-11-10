import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/site/ProductCard";
import { getProduct } from "@/lib/catalog";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/wishlist")({
  head: () => seo("Wishlist", "Your saved SOHO knits, kept on this device."),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, hydrated } = useStore();
  const items = wishlist.map(getProduct).filter((p): p is Product => !!p);
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-20">
      <p className="eyebrow mb-4 text-muted-foreground">Saved on this device</p>
      <h1 className="font-wide text-giga">Wishlist {hydrated && <span className="text-muted-foreground">({items.length})</span>}</h1>
      {hydrated && items.length === 0 ? (
        <div className="mt-12 max-w-md">
          <p className="text-lg text-muted-foreground">Tap the heart on any knit to save it here for later.</p>
          <Link to="/shop" className="mt-8 inline-block bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background hover:bg-foreground/85">Find something</Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {items.map((p) => <ProductCard key={p.handle} p={p} />)}
        </div>
      )}
    </div>
  );
}
