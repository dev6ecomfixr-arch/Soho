import { createFileRoute } from "@tanstack/react-router";

import { ListingPage } from "@/components/site/ListingPage";
import { products } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop")({
  head: () => seo("Shop All Knitwear", "Every SOHO knit in one place — raglan polos and striped cardigans, unisex M to XL."),
  component: () => (
    <ListingPage
      eyebrow="Shop all · Unisex"
      title={<>All knits</>}
      intro="Every piece SOHO makes right now. Filter by size or silhouette, or sort by price."
      items={products}
    />
  ),
});
