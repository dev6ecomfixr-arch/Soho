import { createFileRoute } from "@tanstack/react-router";

import { ListingPage } from "@/components/site/ListingPage";
import { getProduct, lifestyleImage } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { seo } from "@/lib/seo";

const ORDER = ["brown-full-button-knit-polo", "burgundy-knit-raglan-polo", "forest-green-knit-raglan-polo", "bottle-green-knit-raglan-polo", "navy-full-button-knit-polo"];
const items = ORDER.map(getProduct).filter((p): p is Product => !!p);

export const Route = createFileRoute("/trending")({
  head: () => seo("Trending Now", "What's trending at SOHO — striped knit cardigans and contrast-collar raglan polos."),
  component: () => (
    <ListingPage
      eyebrow="Trending"
      title={<>Trending now</>}
      intro="Stripes, tipped collars and rich autumn colour — the knits on everyone's feed this season."
      heroImage={lifestyleImage(items[0] as Product, 4)}
      items={items}
      note="Demo curation: an editor's selection, not live traffic data."
    />
  ),
});
