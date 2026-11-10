import { Link } from "@tanstack/react-router";
import { LayoutGrid, Rows3, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { collections, img, sortProducts, type SortKey } from "@/lib/catalog";
import type { CollectionHandle, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const SORTS: { k: SortKey; l: string }[] = [
  { k: "featured", l: "Featured" },
  { k: "newest", l: "Newest" },
  { k: "price-asc", l: "Price: low to high" },
  { k: "price-desc", l: "Price: high to low" },
  { k: "discount", l: "Biggest discount" },
];

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  tone = "ink",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  tone?: "paper" | "ink" | "sale" | "door";
  children?: ReactNode;
}) {
  const toneCls = {
    paper: "bg-background text-foreground",
    ink: "bg-foreground text-background",
    sale: "bg-sale text-sale-foreground",
    door: "bg-ivory text-foreground",
  }[tone];
  return (
    <section className={cn("grain overflow-hidden", toneCls)}>
      <div className={cn("mx-auto grid max-w-[1600px] px-4 md:px-8", image ? "md:grid-cols-[1.2fr_1fr]" : "")}>
        <div className="animate-rise flex flex-col justify-end py-12 md:py-20">
          <p className="eyebrow mb-5 opacity-70">{eyebrow}</p>
          <h1 className="font-wide text-mega">{title}</h1>
          {intro && <div className="mt-6 max-w-xl text-base opacity-80 md:text-lg">{intro}</div>}
          {children}
        </div>
        {image && (
          <div className="relative -mx-4 h-[52vh] md:mx-0 md:h-auto md:min-h-[520px]">
            <img src={img(image, 1400)} alt="" className="absolute inset-0 size-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

export function ListingPage({
  eyebrow,
  title,
  intro,
  heroImage,
  tone,
  items,
  defaultSort = "featured",
  note,
  labelFor,
  showCategoryFilter = true,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  heroImage?: string;
  tone?: "paper" | "ink" | "sale" | "door";
  items: Product[];
  defaultSort?: SortKey;
  note?: ReactNode;
  labelFor?: (p: Product) => string | undefined;
  showCategoryFilter?: boolean;
}) {
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [size, setSize] = useState<string | null>(null);
  const [cat, setCat] = useState<CollectionHandle | null>(null);
  const [inStock, setInStock] = useState(false);
  const [cols, setCols] = useState<2 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    let l = items;
    if (cat) l = l.filter((p) => p.collection === cat);
    if (size) l = l.filter((p) => p.sizes.some((s) => s.size === size && s.available));
    if (inStock) l = l.filter((p) => p.sizes.some((s) => s.available));
    return sortProducts(l, sort);
  }, [items, cat, size, inStock, sort]);

  const activeCount = [size, cat, inStock || null].filter(Boolean).length;
  const chip = (on: boolean) =>
    cn(
      "h-9 border px-4 text-xs font-bold uppercase tracking-wider transition",
      on ? "border-foreground bg-foreground text-background" : "border-foreground/30 hover:border-foreground",
    );

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        {...(heroImage ? { image: heroImage } : {})}
        {...(tone ? { tone } : {})}
      />
      <div className="sticky top-16 z-30 border-y border-foreground/15 bg-background/95 backdrop-blur md:top-[4.5rem]">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
          <button onClick={() => setShowFilters((v) => !v)} className="eyebrow inline-flex items-center gap-2" aria-expanded={showFilters}>
            <SlidersHorizontal className="size-4" /> Filter {activeCount > 0 && `(${activeCount})`}
          </button>
          <p className="hidden text-sm text-muted-foreground sm:block">
            {list.length} product{list.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="sort">
              Sort
            </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-9 border border-foreground/30 bg-transparent px-2 text-xs font-bold uppercase tracking-wider">
              {SORTS.map((s) => (
                <option key={s.k} value={s.k}>
                  {s.l}
                </option>
              ))}
            </select>
            <div className="hidden gap-1 md:flex">
              <button aria-label="Large grid" onClick={() => setCols(2)} className={cn("grid size-9 place-items-center", cols === 2 && "bg-foreground text-background")}>
                <Rows3 className="size-4" />
              </button>
              <button aria-label="Compact grid" onClick={() => setCols(4)} className={cn("grid size-9 place-items-center", cols === 4 && "bg-foreground text-background")}>
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>
        </div>
        {showFilters && (
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-4 px-4 pb-5 md:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-1 text-muted-foreground">Size</span>
              {["M", "L", "XL"].map((s) => (
                <button key={s} className={chip(size === s)} onClick={() => setSize(size === s ? null : s)}>
                  {s}
                </button>
              ))}
            </div>
            {showCategoryFilter && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow mr-1 text-muted-foreground">Category</span>
                {collections.map((c) => (
                  <button key={c.handle} className={chip(cat === c.handle)} onClick={() => setCat(cat === c.handle ? null : c.handle)}>
                    {c.handle === "knit-polo" ? "Polos" : "Cardigans"}
                  </button>
                ))}
              </div>
            )}
            <button className={chip(inStock)} onClick={() => setInStock(!inStock)}>
              In stock
            </button>
            {activeCount > 0 && (
              <button
                className="text-xs font-bold underline"
                onClick={() => {
                  setSize(null);
                  setCat(null);
                  setInStock(false);
                }}
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
      <section className="mx-auto max-w-[1600px] px-4 py-10 md:px-8 md:py-14">
        {note && <div className="mb-8 border-l-4 border-sale bg-muted px-4 py-3 text-sm">{note}</div>}
        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-wide text-big">Nothing here</p>
            <p className="mt-3 text-muted-foreground">No knits match those filters right now.</p>
            <Link to="/shop" className="mt-6 inline-block border-b border-foreground font-bold">
              Browse everything
            </Link>
          </div>
        ) : (
          <div className={cn("grid gap-x-4 gap-y-10 md:gap-x-6", cols === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2")}>
            {list.map((p, i) => {
              const label = labelFor?.(p);
              return (
                <ProductCard key={p.handle} p={p} priority={i < 4} variant={cols === 2 ? "tall" : "standard"} {...(label ? { label } : {})} />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
