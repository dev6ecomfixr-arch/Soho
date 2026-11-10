import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Expand, Headphones, Heart, Ruler, RotateCcw, Scissors, Shirt, Sparkles, Truck } from "lucide-react";
import { useEffect, useState } from "react";

import { OutfitPicker } from "@/components/site/ProductBundles";
import { PriceLine, ProductCard } from "@/components/site/ProductCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { discountPct, formatTk, getProduct, img, products } from "@/lib/catalog";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$handle")({
  loader: ({ params }) => {
    const p = getProduct(params.handle);
    if (!p) throw notFound();
    return { handle: p.handle };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProduct(loaderData.handle) : undefined;
    if (!p) return { meta: [{ title: "Product unavailable | SOHO" }, { name: "robots", content: "noindex" }] };
    return seo(
      `${p.name} — Unisex`,
      `${p.name} in ${p.colour}. ${formatTk(p.price)}${p.compareAt ? ` (was ${formatTk(p.compareAt)})` : ""}. Unisex sizes M–XL, delivery across Bangladesh.`,
      `${p.images[0]}?width=1200`,
    );
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="font-wide text-giga">Sold out of existence</p>
      <p className="mt-4 text-muted-foreground">We couldn't find that product.</p>
      <Link to="/shop" className="mt-8 inline-block bg-foreground px-8 py-4 text-sm font-bold uppercase text-background">
        Shop all knits
      </Link>
    </div>
  ),
});

const SIZE_GUIDE = [
  { size: "M", chest: "38–40", length: "25.5" },
  { size: "L", chest: "40–42", length: "26.5" },
  { size: "XL", chest: "42–44", length: "27.5" },
];

const RV_KEY = "soho-recently-viewed";

function ProductPage() {
  const { handle } = Route.useLoaderData();
  const p = getProduct(handle) as Product;
  const { addToCart, isWished, toggleWishlist } = useStore();
  const navigate = useNavigate();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setSize(null);
    setActive(0);
    setQty(1);
    try {
      const prev = (JSON.parse(localStorage.getItem(RV_KEY) ?? "[]") as string[]).filter((h) => h !== p.handle);
      setRecent(prev.filter((h) => getProduct(h)).slice(0, 4));
      localStorage.setItem(RV_KEY, JSON.stringify([p.handle, ...prev].slice(0, 8)));
    } catch {
      /* ignore */
    }
  }, [p.handle]);

  const off = discountPct(p);
  const wished = isWished(p.handle);
  const siblings = products.filter((x) => x.collection === p.collection);
  const others = products.filter((x) => x.collection !== p.collection);

  const add = (buyNow = false) => {
    if (!size) {
      setSizeError(true);
      document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addToCart(p.handle, size, qty);
    if (buyNow) navigate({ to: "/cart" });
  };
  const needSize = () => {
    setSizeError(true);
    document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const recs = [...others, ...siblings.filter((s) => s.handle !== p.handle)];
  const go = (d: number) => setActive((a) => (a + d + p.images.length) % p.images.length);

  return (
    <div className="pb-20 lg:pb-0">
      <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[1600px] items-center gap-1.5 px-4 py-4 text-xs text-muted-foreground md:px-8">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-3" />
        <Link to="/collections/$handle" params={{ handle: p.collection }} className="hover:text-foreground">
          {p.collection === "knit-polo" ? "Raglan Polos" : "Knit Cardigans"}
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{p.name}</span>
      </nav>

      <div className="mx-auto grid max-w-[1600px] items-start gap-8 px-4 pb-16 md:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24">
          <div className="relative overflow-hidden bg-muted lg:hidden">
            <div className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]" onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
              {p.images.map((src, i) => (
                <img key={src} src={img(src, 900)} alt={`${p.name} photo ${i + 1}`} loading={i < 2 ? "eager" : "lazy"} className="aspect-[4/5] w-full shrink-0 snap-center object-cover" />
              ))}
            </div>
            <span className="absolute bottom-3 right-3 bg-background px-2 py-1 text-xs font-bold tabular-nums">
              {active + 1} / {p.images.length}
            </span>
          </div>
          <div className="hidden gap-3 lg:grid lg:grid-cols-[72px_1fr]">
            <div className="flex max-h-[760px] flex-col gap-2 overflow-y-auto [scrollbar-width:none]">
              {p.images.map((src, i) => (
                <button key={src} aria-label={`Show photo ${i + 1}`} onClick={() => setActive(i)} className={cn("shrink-0 border", i === active ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100")}>
                  <img src={img(src, 160)} alt="" className="aspect-[4/5] w-full object-cover" />
                </button>
              ))}
            </div>
            <div
              className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-muted"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom(null)}
              onClick={() => setFull(true)}
            >
              <img
                src={img(p.images[active], 1400)}
                alt={`${p.name} photo ${active + 1}`}
                className="absolute inset-0 size-full object-cover transition-transform duration-200"
                style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
              <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-background/85 opacity-0 transition group-hover:opacity-100"><ChevronLeft className="size-4" /></button>
              <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-background/85 opacity-0 transition group-hover:opacity-100"><ChevronRight className="size-4" /></button>
              <span className="absolute bottom-3 right-3 flex items-center gap-2 bg-background/90 px-2.5 py-1 text-xs font-semibold"><Expand className="size-3.5" /> {active + 1} / {p.images.length}</span>
            </div>
          </div>
        </div>

        {/* Buy box */}
        <div>
          <div className="flex items-center gap-2">
            {off > 0 && <span className="bg-sale px-2.5 py-1 text-xs font-extrabold text-sale-foreground">SALE −{off}%</span>}
            <span className="eyebrow text-muted-foreground">Unisex · Knit Drop 0.1</span>
          </div>
          <h1 className="font-wide mt-3 text-[clamp(1.9rem,3vw,3.25rem)] leading-[0.95]">{p.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{p.sizes.some((s) => s.available) ? "In stock" : "Sold out"} · {p.colour}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 border-y-2 border-foreground py-4">
            <PriceLine p={p} className="font-wide text-2xl" />
            {p.compareAt && <span className="-rotate-2 bg-sale px-3 py-1 text-xs font-extrabold uppercase text-sale-foreground">You save {formatTk(p.compareAt - p.price)}</span>}
          </div>

          <div className="mt-8">
            <p className="eyebrow mb-3">
              Colour — <span className="text-muted-foreground">{p.colour}</span>
            </p>
            <div className="flex gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.handle}
                  to="/products/$handle"
                  params={{ handle: s.handle }}
                  aria-label={s.colour}
                  title={s.colour}
                  className={cn("block w-14 border-2 p-0.5", s.handle === p.handle ? "border-foreground" : "border-transparent hover:border-foreground/40")}
                >
                  <img src={img(s.images[0], 150)} alt="" className="aspect-[3/4] w-full object-cover" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8" id="size-picker">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow">
                Size {size && <span className="text-muted-foreground">— {size}</span>}
              </p>
              <a href="#size-guide" className="inline-flex items-center gap-1 text-xs font-semibold underline">
                <Ruler className="size-3.5" /> Size guide
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {p.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={!s.available}
                  aria-pressed={size === s.size}
                  onClick={() => {
                    setSize(s.size);
                    setSizeError(false);
                  }}
                  className={cn(
                    "relative h-14 border text-sm font-bold transition",
                    size === s.size ? "border-foreground bg-foreground text-background" : "border-foreground/30 hover:border-foreground",
                    !s.available && "cursor-not-allowed text-muted-foreground line-through hover:border-foreground/30",
                  )}
                >
                  {s.size}
                  {!s.available && <span className="absolute inset-x-0 bottom-1 text-[0.6rem] font-semibold no-underline">Sold out</span>}
                </button>
              ))}
            </div>
            {sizeError && <p className="mt-2 text-sm font-semibold text-destructive">Please pick a size first.</p>}
          </div>

          <div className="mt-6 flex gap-2">
            <div className="flex h-14 items-center border-2 border-foreground">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-full w-11 text-lg">−</button>
              <span className="w-8 text-center font-bold tabular-nums">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="h-full w-11 text-lg">+</button>
            </div>
            <button onClick={() => add(false)} className="h-14 flex-1 bg-foreground text-xs font-extrabold uppercase tracking-[0.14em] text-background transition hover:bg-sale hover:text-sale-foreground">
              Add to bag · {formatTk(p.price * qty)}
            </button>
            <button
              aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={wished}
              onClick={() => toggleWishlist(p.handle)}
              className="grid h-14 w-14 place-items-center border-2 border-foreground hover:bg-muted"
            >
              <Heart className={cn("size-5", wished && "fill-sale text-sale")} />
            </button>
          </div>
          <button onClick={() => add(true)} className="mt-2 h-14 w-full bg-sale text-xs font-extrabold uppercase tracking-[0.14em] text-sale-foreground transition hover:bg-foreground hover:text-background">
            Buy it now
          </button>

          <ul className="mt-6 grid gap-3 bg-ivory p-5 text-sm">
            <li className="flex gap-3"><Truck className="size-5 shrink-0" /> Tk 80 inside Dhaka (1–2 days) · Tk 200 nationwide (2–5 days)</li>
            <li className="flex gap-3"><RotateCcw className="size-5 shrink-0" /> Check at the door — exchange sizes on delivery</li>
          </ul>


          {/* Complete the look + bundle, inside the buy column */}
          <div className="mt-8">
            <Accordion type="multiple" className="mb-8 border-t-2 border-foreground" defaultValue={["details"]}>
              <AccordionItem value="details">
                <AccordionTrigger className="eyebrow">Description</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm leading-relaxed">
                    {p.collection === "knit-polo" ? (
                      <p>Ribbed knit raglan polo with a contrast cream collar, cuffs and hem. Short sleeves, relaxed unisex fit.</p>
                    ) : (
                      <p>Open-knit full button cardigan with bold vertical stripes and contrast collar, cuffs and hem. Short sleeves, relaxed unisex fit — wear it buttoned or open.</p>
                    )}
                    <p className="text-muted-foreground">Colour: {p.colour}. Fabric composition not listed by SOHO — message us for details.</p>
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="size" id="size-guide">
                <AccordionTrigger className="eyebrow">Fit and sizing</AccordionTrigger>
                <AccordionContent>
                    <p className="mb-3 text-sm text-muted-foreground">All measurements are in inches.</p>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-foreground">
                          <th className="py-2">Size</th><th>Chest</th><th>Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SIZE_GUIDE.map((r) => (
                          <tr key={r.size} className="border-b border-foreground/15">
                            <td className="py-2 font-bold">{r.size}</td><td>{r.chest}</td><td>{r.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="material">
                <AccordionTrigger className="eyebrow">Material & care</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed">
                    <p>SOHO doesn't list fabric composition or care instructions online. Message SOHO on {""}<a href="https://www.instagram.com/soho__clothing/" target="_blank" rel="noreferrer" className="underline">Instagram</a> for details before you order.</p>
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="delivery">
                <AccordionTrigger className="eyebrow">Shipping</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm leading-relaxed">
                    <p>Inside Dhaka: Tk 80, 1–2 business days. Outside Dhaka: Tk 200, 2–5 business days.</p>
                    <p><Link to="/shipping" className="underline">Shipping policy</Link></p>
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="returns">
                <AccordionTrigger className="eyebrow">Returns & exchange</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm leading-relaxed">
                    <p>Check your item while the delivery agent is present. Need another size? Message SOHO with your order details and preferred size. <Link to="/returns" className="underline">Full policy</Link></p>
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="reviews">
                <AccordionTrigger className="eyebrow">Reviews (0)</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm leading-relaxed">
                    <p>No reviews yet for the {p.name}.</p>
                    <p className="text-muted-foreground">Bought one? Tag <a href="https://www.instagram.com/soho__clothing/" target="_blank" rel="noreferrer" className="underline">@soho__clothing</a> on Instagram and tell us how it fits.</p>
                  </AccordionContent>
                </AccordionItem>
            </Accordion>
            <OutfitPicker main={p} mainSize={size} recs={recs} onNeedMainSize={needSize} />
          </div>
        </div>
      </div>

      {/* Why you'll love it */}
      <section className="border-t border-foreground/10 bg-ivory section-y">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <h2 className="font-wide text-big mb-8">Why you'll love it</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Shirt, t: "Unisex fit", d: "Relaxed cut in M, L and XL, designed to work on any body." },
              { i: Scissors, t: "Contrast details", d: p.collection === "knit-polo" ? "Cream-tipped collar, cuffs and hem on a ribbed knit body." : "Bold vertical stripes with contrast collar, cuffs and hem." },
              { i: Sparkles, t: "Easy to style", d: p.collection === "knit-polo" ? "Wear it alone or under an open knit cardigan." : "Buttoned up as a shirt, or open over a polo." },
              { i: Ruler, t: "Clear sizing", d: "Chest and length in inches for every size — see the size guide." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="border-t border-foreground/20 pt-4">
                <Icon className="size-5" />
                <p className="mt-3 text-sm font-semibold">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="border-t border-foreground/10 section-y">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <h2 className="font-wide text-big mb-8">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-5">
            {recs.slice(0, 4).map((x) => (
              <ProductCard key={x.handle} p={x} />
            ))}
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-8">
          <h2 className="font-wide text-big mb-8">Recently viewed</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-5">
            {recent.map((h) => {
              const r = getProduct(h);
              return r ? <ProductCard key={h} p={r} /> : null;
            })}
          </div>
        </section>
      )}

      <section className="border-y border-foreground/10 bg-ivory">
        <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-8 sm:grid-cols-3 md:px-8">
          <div className="flex gap-3 text-sm"><Truck className="size-5 shrink-0" /><span><b className="block">Delivery</b>Tk 80 inside Dhaka (1–2 days) · Tk 200 outside (2–5 days)</span></div>
          <div className="flex gap-3 text-sm"><RotateCcw className="size-5 shrink-0" /><span><b className="block">Check at the door</b>Inspect before you accept; size exchanges by message</span></div>
          <div className="flex gap-3 text-sm"><Headphones className="size-5 shrink-0" /><span><b className="block">Support</b>7 days, 11 AM – 9 PM · +880 1305-426354</span></div>
        </div>
      </section>


      <Dialog open={full} onOpenChange={setFull}>
        <DialogContent className="max-w-5xl rounded-none border-0 bg-background p-2 sm:rounded-none">
          <DialogTitle className="sr-only">{p.name} gallery</DialogTitle>
          <div className="relative">
            <img src={img(p.images[active], 1800)} alt={`${p.name} photo ${active + 1}`} className="max-h-[85vh] w-full object-contain" />
            <button aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-background/85"><ChevronLeft className="size-4" /></button>
            <button aria-label="Next photo" onClick={() => go(1)} className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-background/85"><ChevronRight className="size-4" /></button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-foreground/15 bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{p.name}</p>
          <p className="text-sm font-bold">{formatTk(p.price)}{size ? ` · ${size}` : ""}</p>
        </div>
        <button onClick={() => add(false)} className="h-12 bg-foreground px-6 text-xs font-bold uppercase tracking-[0.14em] text-background">
          {size ? "Add to bag" : "Select size"}
        </button>
      </div>
    </div>
  );
}
