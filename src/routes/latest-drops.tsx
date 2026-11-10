import { createFileRoute } from "@tanstack/react-router";

import { ListingPage } from "@/components/site/ListingPage";
import { byNewest, HERO_IMAGE } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/latest-drops")({
  head: () => seo("Knit Drop 0.1 — Latest Drop", "SOHO Knit Drop 0.1: ribbed raglan polos and striped full-button knit cardigans, cut unisex."),
  component: () => (
    <ListingPage
      eyebrow="Latest drop"
      title={<>Knit Drop 0.1</>}
      intro="Our knit capsule: two silhouettes, five colourways, one unisex fit. Ribbed raglan polos with tipped collars and open-knit striped cardigans."
      heroImage={HERO_IMAGE}
      tone="ink"
      items={byNewest}
    />
  ),
});
