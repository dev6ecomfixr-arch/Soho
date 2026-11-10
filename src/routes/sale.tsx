import { createFileRoute } from "@tanstack/react-router";

import { ListingPage } from "@/components/site/ListingPage";
import { discountPct, products } from "@/lib/catalog";
import { seo } from "@/lib/seo";

const onSale = products.filter((p) => discountPct(p) > 0);
const max = Math.max(...onSale.map(discountPct));

export const Route = createFileRoute("/sale")({
  head: () => seo("Season End Sale — Up to 20% Off", "SOHO Season End Sale: raglan polos Tk 1,199 (was Tk 1,500), knit cardigans Tk 1,499 (was Tk 1,800)."),
  component: () => (
    <ListingPage
      eyebrow="Season End Sale is live"
      title={<>Up to {max}% off</>}
      intro={
        <div className="mt-2 grid max-w-lg grid-cols-2 gap-4 text-base">
          <div className="border-t-2 border-sale-foreground pt-3">
            <p className="font-wide text-3xl">Tk 1,199</p>
            <p className="text-sm">Raglan polos · was Tk 1,500</p>
          </div>
          <div className="border-t-2 border-sale-foreground pt-3">
            <p className="font-wide text-3xl">Tk 1,499</p>
            <p className="text-sm">Knit cardigans · was Tk 1,800</p>
          </div>
        </div>
      }
      tone="sale"
      items={onSale}
      defaultSort="discount"
    />
  ),
});
