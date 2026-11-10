import { createFileRoute } from "@tanstack/react-router";

import { ListingPage } from "@/components/site/ListingPage";
import { byNewest, lifestyleImage } from "@/lib/catalog";
import { seo } from "@/lib/seo";

const newest = byNewest[0];

export const Route = createFileRoute("/new-arrivals")({
  head: () => seo("New Arrivals", "The latest SOHO knits, newest first — starting with the Forest Green raglan polo."),
  component: () => (
    <ListingPage
      eyebrow="New arrivals"
      title={<>New in</>}
      intro="Newest first. The Forest Green raglan is the latest addition to the knit family."
      {...(newest ? { heroImage: lifestyleImage(newest, 2) } : {})}
      items={byNewest}
      defaultSort="newest"
      labelFor={(p) => (p.handle === newest?.handle ? "JUST DROPPED" : undefined)}
    />
  ),
});
