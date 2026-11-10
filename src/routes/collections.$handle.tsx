import { createFileRoute, notFound } from "@tanstack/react-router";

import { ListingPage } from "@/components/site/ListingPage";
import { getCollection, getProduct, inCollection, lifestyleImage } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/collections/$handle")({
  loader: ({ params }) => {
    const c = getCollection(params.handle);
    if (!c) throw notFound();
    return { handle: c.handle };
  },
  head: ({ loaderData }) => {
    const c = loaderData ? getCollection(loaderData.handle) : undefined;
    return c ? seo(c.title, c.blurb) : { meta: [{ title: "Collection not found | SOHO" }, { name: "robots", content: "noindex" }] };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { handle } = Route.useLoaderData();
  const c = getCollection(handle);
  if (!c) return null;
  const hero = getProduct(c.heroHandle);
  return (
    <ListingPage
      key={c.handle}
      eyebrow={c.kicker}
      title={c.title}
      intro={c.blurb}
      {...(hero ? { heroImage: lifestyleImage(hero, 1) } : {})}
      items={inCollection(c.handle)}
      showCategoryFilter={false}
    />
  );
}
