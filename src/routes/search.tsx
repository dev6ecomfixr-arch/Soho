import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { products, searchProducts } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q: string } => ({ q: typeof s["q"] === "string" ? s["q"] : "" }),
  head: () => seo("Search", "Search SOHO knit polos and cardigans by name or colour."),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [val, setVal] = useState(q);
  const results = searchProducts(q);
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-8">
      <form onSubmit={(e) => { e.preventDefault(); navigate({ search: { q: val } }); }} className="flex items-center gap-4 border-b-2 border-foreground pb-3">
        <Search className="size-7" />
        <label htmlFor="sq" className="sr-only">Search</label>
        <input id="sq" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Search knits, colours…" className="font-wide w-full bg-transparent text-big outline-none placeholder:text-muted-foreground/50" />
      </form>
      <p className="eyebrow mt-6 text-muted-foreground">
        {q ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”` : "Type to search"}
      </p>
      {q && results.length === 0 && (
        <div className="mt-10">
          <p className="text-lg">Nothing matches that. Here's everything we've got:</p>
        </div>
      )}
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {(q && results.length ? results : products).map((p) => <ProductCard key={p.handle} p={p} />)}
      </div>
    </div>
  );
}
