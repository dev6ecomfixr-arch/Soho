import { createFileRoute } from "@tanstack/react-router";

import { ListingPage } from "@/components/site/ListingPage";
import { getProduct, lifestyleImage } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { seo } from "@/lib/seo";

const ORDER = ["burgundy-knit-raglan-polo", "bottle-green-knit-raglan-polo", "brown-full-button-knit-polo", "navy-full-button-knit-polo", "forest-green-knit-raglan-polo"];
const items = ORDER.map(getProduct).filter((p): p is Product => !!p);

export const Route = createFileRoute("/best-sellers")({
  head: () => seo("Most Loved", "SOHO's most-loved knits — the raglan polos and cardigans our community keeps coming back to."),
  component: () => (
    <ListingPage
      eyebrow="Best sellers"
      title={<>Most loved</>}
      intro="The pieces we see styled again and again."
      heroImage={lifestyleImage(items[0] as Product, 1)}
      tone="ink"
      items={items}
      note="Demo curation: SOHO doesn't publish sales rankings, so this order is an editor's pick rather than live sales data."
    />
  ),
});
