import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Pause, Play, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Marquee } from "@/components/site/Marquee";
import { PriceLine, ProductCard } from "@/components/site/ProductCard";
import { SectionHead } from "@/components/site/SectionHead";
import { Newsletter } from "@/components/site/SiteFooter";
import { byNewest, CONTACT, discountPct, formatTk, getProduct, HERO_IMAGE, img, lifestyleImage, products } from "@/lib/catalog";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "SOHO — Your Style. Your Rules. Unisex Knitwear from Dhaka",
      "SOHO Knit Drop 0.1: ribbed raglan polos and striped knit cardigans, cut unisex. Season End Sale up to 20% off, delivered across Bangladesh.",
      `${HERO_IMAGE}?width=1200`,
    ),
  component: Home,
});

const P = (h: string) => getProduct(h) as Product;
const forest = P("forest-green-knit-raglan-polo");
const burgundy = P("burgundy-knit-raglan-polo");
const bottle = P("bottle-green-knit-raglan-polo");
const brown = P("brown-full-button-knit-polo");
const navy = P("navy-full-button-knit-polo");
const maxOff = Math.max(...products.map(discountPct));
const polos = products.filter((p) => p.collection === "knit-polo");
const cardigans = products.filter((p) => p.collection === "knit-shirt");
const minPrice = (l: Product[]) => Math.min(...l.map((p) => p.price));

const btn =
  "group inline-flex h-12 items-center gap-3 px-7 text-xs font-extrabold uppercase tracking-[0.16em] transition";

/* ═════════════════════ HERO — three distinct campaigns ═════════════════════ */
function HeroBrand() {
  return (
    <div className="absolute inset-0">
      <picture>
        <source media="(max-width: 767px)" srcSet={img(lifestyleImage(burgundy, 1), 900)} />
        <img src={img(HERO_IMAGE, 2000)} alt="SOHO models in Knit Drop 0.1" className="absolute inset-0 size-full object-cover object-[50%_30%]" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-4 pb-24 text-paper md:px-8 md:pb-20">
        <p className="eyebrow animate-rise mb-5 flex items-center gap-2"><span className="size-2 bg-sale" /> Knit Drop 0.1 · Unisex</p>
        <h1 className="font-wide text-mega animate-rise" style={{ animationDelay: "80ms" }}>
          Your style.
          <br />
          <span className="text-sale">Your rules.</span>
        </h1>
        <div className="animate-rise mt-7 flex flex-wrap items-center gap-6" style={{ animationDelay: "200ms" }}>
          <Link to="/shop" className={cn(btn, "bg-paper text-ink hover:bg-sale hover:text-sale-foreground")}>
            Shop now <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="max-w-xs text-sm text-paper/85">Discover the pieces that define your everyday look.</p>
        </div>
      </div>
    </div>
  );
}

function PhotoBanner({ photo, mobile, product, cardImage, alt, pos, tone, eyebrow, line1, line2, copy, cta, to, sticker }: { photo: string; mobile: string; product: Product; cardImage: string; alt: string; pos: string; tone: "wine" | "sale"; eyebrow: string; line1: string; line2: string; copy: string; cta: string; to: "/new-arrivals" | "/sale"; sticker: string }) {
  const panel = tone === "wine" ? "bg-wine text-wine-foreground" : "bg-sale text-sale-foreground";
  const accent = tone === "wine" ? "text-blush" : "text-sale md:text-ink";
  return (
    <div className={cn("absolute inset-0 overflow-hidden", panel)}>
      {/* mobile: full photo */}
      <div className="absolute inset-0 md:hidden">
        <img src={img(mobile, 900)} alt={alt} className={cn("absolute inset-0 size-full object-cover", pos)} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
      </div>
      {/* desktop: photo on the right ~58% with a slanted edge */}
      <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]">
        <img src={img(photo, 1800)} alt={alt} className={cn("animate-rise absolute inset-0 size-full object-cover", pos)} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
      </div>
      <div className="relative mx-auto flex h-full max-w-[1600px] items-end px-4 pb-24 text-paper md:items-center md:px-8 md:pb-16 md:text-inherit">
        <div className="relative z-10 md:max-w-[46%]">
          <span className="eyebrow animate-rise inline-flex -rotate-2 items-center gap-2 bg-ink px-3 py-1.5 text-paper">
            <span className={cn("size-2 animate-pulse", tone === "wine" ? "bg-blush" : "bg-sale")} /> {eyebrow}
          </span>
          <h2 className="font-wide text-mega animate-rise mt-5" style={{ animationDelay: "80ms" }}>
            {line1}
            <br />
            <span className={accent}>{line2}</span>
          </h2>
          <p className="animate-rise mt-5 max-w-sm text-base opacity-90" style={{ animationDelay: "140ms" }}>{copy}</p>
          <Link to={to} className={cn(btn, "animate-rise mt-7 bg-paper text-ink hover:bg-ink hover:text-paper")} style={{ animationDelay: "200ms" }}>
            {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      {/* floating product card on the seam */}
      <Link
        to="/products/$handle"
        params={{ handle: product.handle }}
        className="animate-rise group absolute bottom-28 right-10 z-10 hidden w-44 rotate-3 border-4 border-paper bg-paper text-ink shadow-2xl transition hover:rotate-0 lg:block"
        style={{ animationDelay: "260ms" }}
      >
        <img src={img(cardImage, 400)} alt={product.name} className="aspect-[4/5] w-full bg-muted object-cover" />
        <span className="block px-2 py-1.5 text-xs font-semibold">{product.colour}</span>
        <span className="block px-2 pb-2 text-xs font-bold">{formatTk(product.price)}{product.compareAt ? <s className="ml-1.5 font-normal text-muted-foreground">{formatTk(product.compareAt)}</s> : null}</span>
      </Link>
      <span className="font-wide absolute right-6 top-6 z-10 hidden size-28 rotate-12 place-items-center rounded-full bg-paper text-center text-sm leading-tight text-ink shadow-xl md:grid md:right-10 md:top-10">
        {sticker}
      </span>
    </div>
  );
}

function HeroNew() {
  return (
    <PhotoBanner
      photo={burgundy.images[7] ?? ""}
      mobile={burgundy.images[7] ?? ""}
      product={burgundy}
      cardImage={burgundy.images[0] ?? ""}
      alt="Man wearing the burgundy knit raglan polo"
      pos="object-[50%_20%]"
      tone="wine"
      eyebrow="Just dropped"
      line1="Burgundy"
      line2="mood."
      copy="Ribbed raglan polo with a cream-tipped collar and hem. Unisex M to XL."
      cta="Shop new in"
      to="/new-arrivals"
      sticker="New in"
    />
  );
}

function HeroDeals() {
  return (
    <PhotoBanner
      photo={brown.images[10] ?? ""}
      mobile={brown.images[10] ?? ""}
      product={brown}
      cardImage={brown.images[4] ?? ""}
      alt="Woman wearing the brown striped knit cardigan"
      pos="object-[50%_20%]"
      tone="sale"
      eyebrow={`Season end · up to ${maxOff}% off`}
      line1="Good style."
      line2="Better deals."
      copy={`Polos now from ${formatTk(minPrice(polos))}, cardigans from ${formatTk(minPrice(cardigans))}. Every knit marked down.`}
      cta="Shop sale"
      to="/sale"
      sticker={`−${maxOff}%`}
    />
  );
}

const SLIDES = [
  { key: "brand", label: "Your style", C: HeroBrand, dark: true },
  { key: "new", label: "New arrivals", C: HeroNew, dark: true },
  { key: "deals", label: "Sale", C: HeroDeals, dark: true },
] as const;

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef<number | null>(null);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [paused, i]);
  const go = (d: number) => setI((n) => (n + d + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative h-[min(calc(100svh-4.5rem),980px)] min-h-[620px] overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="SOHO campaigns"
      onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const x = e.changedTouches[0]?.clientX;
        if (touch.current != null && x != null && Math.abs(x - touch.current) > 50) go(x < touch.current ? 1 : -1);
        touch.current = null;
      }}
    >
      {SLIDES.map((s, idx) => (
        <div
          key={s.key}
          aria-hidden={idx !== i}
          aria-roledescription="slide"
          className={cn("absolute inset-0 transition-[opacity,transform] duration-1000", idx === i ? "opacity-100" : "pointer-events-none scale-[1.02] opacity-0")}
        >
          {idx === i && <s.C />}
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1600px] items-center gap-3 px-4 pb-6 text-paper md:px-8">
        <div className="flex flex-1 gap-2">
          {SLIDES.map((s, idx) => (
            <button key={s.key} onClick={() => setI(idx)} aria-label={`Show slide ${idx + 1}: ${s.label}`} aria-current={idx === i} className="group flex-1 text-left">
              <span className="block h-[3px] overflow-hidden bg-paper/30">
                <span key={`${i}-${paused}`} className={cn("block h-full bg-paper", idx < i && "w-full", idx > i && "w-0", idx === i && (paused ? "w-full" : "animate-[progress_7s_linear_forwards]"))} />
              </span>
              <span className={cn("eyebrow mt-2 hidden md:block", idx === i ? "opacity-100" : "opacity-60")}>{s.label}</span>
            </button>
          ))}
        </div>
        <button aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused((p) => !p)} className="grid size-10 place-items-center border border-paper/40 hover:bg-paper hover:text-ink">
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
        <button aria-label="Previous slide" onClick={() => go(-1)} className="grid size-10 place-items-center border border-paper/40 hover:bg-paper hover:text-ink">
          <ArrowLeft className="size-4" />
        </button>
        <button aria-label="Next slide" onClick={() => go(1)} className="grid size-10 place-items-center border border-paper/40 hover:bg-paper hover:text-ink">
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

/* ═════════════════════ CATEGORIES ═════════════════════ */
function Categories() {
  const newest = byNewest[0] ?? forest;
  return (
    <section className="mx-auto max-w-[1600px] px-4 section-y md:px-8">
      <SectionHead eyebrow="Shop by category" title="Pick your knit" linkTo="/shop" linkLabel="Shop all" />
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr] md:grid-rows-2">
        <Link to="/collections/$handle" params={{ handle: "knit-polo" }} className="group relative block min-h-[460px] overflow-hidden md:row-span-2 md:min-h-[640px]">
          <img src={img(lifestyleImage(burgundy, 1), 1400)} alt="Knit raglan polos" loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <ArrowUpRight className="absolute right-5 top-5 size-6 text-paper transition group-hover:rotate-45" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-paper md:p-8">
            <p className="eyebrow mb-2">{polos.length} colourways · from {formatTk(minPrice(polos))}</p>
            <h3 className="font-wide text-mega">Raglan<br />polos</h3>
          </div>
        </Link>
        <Link to="/collections/$handle" params={{ handle: "knit-shirt" }} className="group relative block min-h-[300px] overflow-hidden">
          <img src={img(lifestyleImage(brown, 1), 1100)} alt="Knit cardigans" loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_20%] transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-paper md:p-6">
            <p className="eyebrow mb-2">{cardigans.length} stripes · from {formatTk(minPrice(cardigans))}</p>
            <h3 className="font-wide text-big">Knit<br />cardigans</h3>
          </div>
        </Link>
        <div className="grid min-h-[300px] grid-cols-2 gap-3">
          <Link to="/sale" className="group flex flex-col justify-between bg-sale p-5 text-sale-foreground">
            <p className="eyebrow">Season end</p>
            <div>
              <p className="font-wide text-big">−{maxOff}%</p>
              <p className="eyebrow mt-2 inline-flex items-center gap-1.5 transition group-hover:gap-3">Shop sale <ArrowRight className="size-3.5" /></p>
            </div>
          </Link>
          <Link to="/products/$handle" params={{ handle: newest.handle }} className="group relative block overflow-hidden bg-muted">
            <img src={img(newest.images[0], 700)} alt={newest.name} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="eyebrow absolute inset-x-0 bottom-0 bg-ink px-3 py-2 text-paper">New in →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════ FRESH DROPS (rail) ═════════════════════ */
function FreshDrops() {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.6, behavior: "smooth" });
  return (
    <section className="bg-muted section-y">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionHead
          eyebrow="New pieces. New energy."
          title="Fresh drops."
          aside={
            <div className="hidden gap-2 md:flex">
              <button aria-label="Scroll left" onClick={() => scroll(-1)} className="grid size-10 place-items-center border border-foreground hover:bg-foreground hover:text-background"><ArrowLeft className="size-4" /></button>
              <button aria-label="Scroll right" onClick={() => scroll(1)} className="grid size-10 place-items-center border border-foreground hover:bg-foreground hover:text-background"><ArrowRight className="size-4" /></button>
            </div>
          }
        />
      </div>
      <div ref={rail} className="mx-auto flex max-w-[1600px] snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:scroll-px-8 md:gap-6 md:px-8 [scrollbar-width:none]">
        {byNewest.map((p, i) => (
          <div key={p.handle} className="w-[64vw] shrink-0 snap-start sm:w-[40vw] md:w-[calc((100%-4.5rem)/4)] lg:w-[calc((100%-6rem)/4.3)]">
            <ProductCard p={p} priority={i < 2} label={i === 0 ? "NEW" : "DROP 0.1"} />
          </div>
        ))}
        <Link to="/new-arrivals" className="group grid w-[64vw] shrink-0 snap-start place-items-center bg-foreground p-6 text-center text-background sm:w-[40vw] md:w-[calc((100%-4.5rem)/4)] lg:w-[calc((100%-6rem)/4.3)]">
          <span>
            <span className="font-wide block text-big">View all</span>
            <ArrowUpRight className="mx-auto mt-4 size-8 transition group-hover:rotate-45" />
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ═════════════════════ NEW SEASON BANNER ═════════════════════ */
function NewSeason() {
  const big = burgundy.images[10] ?? "";
  const small = brown.images[13] ?? "";
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 md:hidden">
        <img src={img(big, 900)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      </div>
      <div className="relative mx-auto grid max-w-[1600px] items-center gap-10 md:grid-cols-[1fr_1fr]">
        <div className="flex min-h-[70vh] flex-col justify-end px-4 py-16 md:min-h-0 md:justify-center md:px-8 md:py-24">
          <p className="eyebrow mb-5">Campaign · Knit Drop 0.1</p>
          <h2 className="font-wide text-giga max-w-3xl">
            New season.
            <br />
            <span className="text-sale">New energy.</span>
          </h2>
          <p className="mt-5 max-w-md text-paper/85">Burgundy raglans and striped cardigans — the colours of Knit Drop 0.1, shot in the Dhaka sun.</p>
          <Link to="/latest-drops" className={cn(btn, "mt-8 w-fit bg-paper text-ink hover:bg-sale hover:text-sale-foreground")}>
            Shop the drop <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="relative hidden h-[720px] md:block">
          <Link to="/products/$handle" params={{ handle: burgundy.handle }} className="group absolute inset-y-0 right-0 w-[72%] overflow-hidden">
            <img src={img(big, 1400)} alt="Woman wearing the burgundy knit raglan polo" className="size-full object-cover object-[50%_15%] transition duration-700 group-hover:scale-105" />
            <span className="font-wide absolute bottom-6 right-6 rotate-2 bg-sale px-3 py-2 text-sm text-sale-foreground">{burgundy.colour} · {formatTk(burgundy.price)}</span>
          </Link>
          <Link to="/products/$handle" params={{ handle: brown.handle }} className="group absolute left-0 top-1/2 w-[42%] -translate-y-1/2 -rotate-3 border-[6px] border-paper bg-paper shadow-2xl transition hover:rotate-0">
            <img src={img(small, 800)} alt="Woman wearing the brown striped knit cardigan" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <span className="eyebrow block px-1 pt-2 text-ink">{brown.colour} cardigan · {formatTk(brown.price)}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════ TRENDING (feature + stack) ═════════════════════ */
function Trending() {
  const { addToCart } = useStore();
  const hero = burgundy;
  const size = hero.sizes.find((s) => s.available)?.size;
  return (
    <section className="mx-auto max-w-[1600px] px-4 section-y md:px-8">
      <SectionHead eyebrow="Demo curation" title="What's trending." linkTo="/trending" />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="group relative overflow-hidden bg-muted">
          <Link to="/products/$handle" params={{ handle: hero.handle }}>
            <img src={img(lifestyleImage(hero, 1), 1400)} alt={hero.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105 lg:aspect-auto lg:h-full" />
          </Link>
          <span className="absolute left-0 top-0 bg-foreground px-3 py-1.5 text-[0.7rem] font-extrabold tracking-wider text-background">TRENDING</span>
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-3 bg-background p-4 md:inset-x-5 md:bottom-5 md:p-5">
            <div>
              <p className="eyebrow text-muted-foreground">Featured</p>
              <Link to="/products/$handle" params={{ handle: hero.handle }} className="font-wide mt-1 block text-sub hover:underline">{hero.name}</Link>
              <PriceLine p={hero} className="mt-1" />
            </div>
            {size && (
              <button onClick={() => addToCart(hero.handle, size)} className="inline-flex h-11 items-center gap-2 bg-foreground px-5 text-xs font-extrabold uppercase tracking-wider text-background hover:bg-sale">
                <Plus className="size-4" /> Add {size}
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {[brown, bottle, navy, forest].map((p) => (
            <ProductCard key={p.handle} p={p} variant="editorial" label="TRENDING" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════ FAVOURITES (index + image) ═════════════════════ */
function Favourites() {
  const [active, setActive] = useState(0);
  const list = [burgundy, brown, bottle, navy, forest];
  return (
    <section className="bg-ink text-paper section-y">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 md:grid-cols-[1fr_1fr] md:px-8">
        <div className="flex flex-col">
          <p className="eyebrow mb-3 text-paper/60">Best sellers · demo curation</p>
          <h2 className="font-wide text-big mb-10">The SOHO favourites.</h2>
          <ol className="border-t border-paper/20">
            {list.map((p, i) => (
              <li key={p.handle}>
                <Link
                  to="/products/$handle"
                  params={{ handle: p.handle }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn("group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-paper/20 py-4 transition md:py-5", active === i ? "text-paper" : "text-paper/45")}
                >
                  <span className="font-wide text-sub tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="font-wide block truncate text-sub">{p.name.replace(" Knit", "")}</span>
                    <span className="mt-1 flex items-center gap-2 text-xs">
                      <span className="size-3 ring-1 ring-paper/40" style={{ background: p.swatch }} /> {p.colour}
                    </span>
                  </span>
                  <span className="text-right text-sm">
                    <b>{formatTk(p.price)}</b>
                    {p.compareAt && <s className="ml-2 opacity-60">{formatTk(p.compareAt)}</s>}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <Link to="/best-sellers" className={cn(btn, "mt-8 w-fit bg-paper text-ink hover:bg-sale hover:text-sale-foreground")}>
            View all best sellers <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto">
          {list.map((p, i) => (
            <img key={p.handle} src={img(lifestyleImage(p, 0), 1200)} alt={i === active ? p.name : ""} loading="lazy" className={cn("absolute inset-0 size-full object-cover transition duration-700", i === active ? "scale-100 opacity-100" : "scale-105 opacity-0")} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════ MID PROMO ═════════════════════ */
function Hotspot({ p, x, y }: { p: Product; x: string; y: string }) {
  const [open, setOpen] = useState(false);
  const { addToCart } = useStore();
  const size = p.sizes.find((s) => s.available)?.size;
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <button aria-label={`Show ${p.name}`} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="relative grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lg">
        <span className="absolute inset-0 animate-ping rounded-full bg-paper/60" />
        <Plus className={cn("relative size-4 transition", open && "rotate-45")} />
      </button>
      {open && (
        <div className="animate-rise absolute left-4 top-4 z-10 w-60 bg-background p-3 text-foreground shadow-xl">
          <div className="flex gap-3">
            <img src={img(p.images[0], 200)} alt="" className="aspect-[3/4] w-16 object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">{p.name}</p>
              <PriceLine p={p} className="mt-1 text-sm" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {size && (
              <button onClick={() => addToCart(p.handle, size)} className="h-9 flex-1 bg-foreground text-xs font-bold uppercase text-background hover:bg-sale">Add {size}</button>
            )}
            <Link to="/products/$handle" params={{ handle: p.handle }} className="grid h-9 flex-1 place-items-center border border-foreground text-xs font-bold uppercase">View</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ShopTheLook() {
  const looks = [brown, bottle];
  return (
    <section className="mx-auto max-w-[1600px] px-4 section-y md:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.4fr_1fr]">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="eyebrow mb-3 text-muted-foreground">Editorial</p>
            <h2 className="font-wide text-big">Shop the look.</h2>
            <p className="mt-4 max-w-xs text-muted-foreground">Tap the dots to see what the models are wearing — and add it straight to your bag.</p>
          </div>
          <ul className="divide-y divide-foreground/15 border-y border-foreground/15">
            {looks.map((p) => (
              <li key={p.handle}>
                <Link to="/products/$handle" params={{ handle: p.handle }} className="group flex items-center gap-3 py-3">
                  <img src={img(p.images[0], 200)} alt="" className="aspect-[3/4] w-14 object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold group-hover:underline">{p.name}</span>
                    <PriceLine p={p} className="text-sm" />
                  </span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden">
          <img src={img(lifestyleImage(brown, 4), 1400)} alt="Model in the brown striped knit cardigan" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          <Hotspot p={brown} x="42%" y="48%" />
          <span className="eyebrow absolute bottom-0 left-0 bg-background px-4 py-3">Golden hour</span>
        </div>
        <div className="relative overflow-hidden lg:mt-32">
          <img src={img(lifestyleImage(bottle, 0), 1000)} alt="Model in the bottle green knit raglan polo" loading="lazy" className="aspect-[4/5] w-full object-cover object-top lg:aspect-[3/4.4]" />
          <Hotspot p={bottle} x="50%" y="34%" />
          <span className="eyebrow absolute bottom-0 left-0 bg-background px-4 py-3">Market run</span>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════ OFFERS ═════════════════════ */
/* ═════════════════════ ON SALE ═════════════════════ */
function OnSale() {
  const sale = [...products].filter((p) => discountPct(p) > 0).sort((a, b) => discountPct(b) - discountPct(a));
  return (
    <section className="mx-auto max-w-[1600px] px-4 section-y md:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-4 border-sale pb-6 md:mb-12">
        <div>
          <p className="eyebrow mb-3 text-sale">On sale now</p>
          <h2 className="font-wide text-big">Price dropped.<br />Style up.</h2>
        </div>
        <Link to="/sale" className={cn(btn, "bg-sale text-sale-foreground hover:bg-ink hover:text-paper")}>
          Shop all sale <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-5">
        {sale.map((p) => (
          <ProductCard key={p.handle} p={p} />
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════ EDITORIAL ═════════════════════ */
function Editorial() {
  return (
    <section className="grain overflow-hidden bg-secondary section-y">
      <div className="relative mx-auto grid max-w-[1600px] gap-6 px-4 md:grid-cols-12 md:px-8">
        <img src={img(lifestyleImage(navy, 1), 1200)} alt="Navy striped cardigan campaign" loading="lazy" className="aspect-[3/4] w-full object-cover md:col-span-5 md:row-span-2" />
        <div className="md:col-span-7 md:pl-6 md:pt-10">
          <p className="eyebrow mb-5">Campaign</p>
          <h2 className="font-wide text-giga md:-ml-28 md:mix-blend-multiply">
            Not just
            <br />
            another <span className="text-sale">outfit.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg">Find the pieces that feel like you.</p>
          <Link to="/shop" className={cn(btn, "mt-8 bg-foreground text-background hover:bg-sale")}>
            Find yours <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-6 md:col-start-7 md:self-end">
          <img src={img(lifestyleImage(burgundy, 3), 800)} alt="Burgundy raglan polo" loading="lazy" className="aspect-square w-full object-cover" />
          <img src={img(lifestyleImage(forest, 0), 800)} alt="Forest green raglan polo" loading="lazy" className="aspect-square w-full translate-y-8 object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════ MORE TO EXPLORE ═════════════════════ */
function MoreToExplore() {
  const tiles = [
    { to: "/latest-drops", t: "Knit Drop 0.1", s: "The full capsule", img: lifestyleImage(bottle, 3) },
    { to: "/collections/knit-shirt", t: "Cardigans", s: "Stripes, open knit", img: lifestyleImage(brown, 2) },
    { to: "/collections/knit-polo", t: "Raglan polos", s: "Three colourways", img: lifestyleImage(forest, 3) },
    { to: "/wishlist", t: "Your wishlist", s: "Saved for later", img: lifestyleImage(burgundy, 4) },
  ] as const;
  return (
    <section className="mx-auto max-w-[1600px] px-4 section-y md:px-8">
      <SectionHead eyebrow="Keep scrolling" title="More to explore" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-[320px_320px]">
        {tiles.map((t, i) => (
          <a key={t.to} href={t.to} className={cn("group relative overflow-hidden", i === 0 && "col-span-2 lg:row-span-2", i === 1 && "col-span-2")}>
            <img src={img(t.img, 1000)} alt="" loading="lazy" className={cn("h-full w-full object-cover transition duration-700 group-hover:scale-105 lg:aspect-auto", i < 2 ? "aspect-[4/3]" : "aspect-[3/4]")} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-paper md:p-6">
              <div>
                <p className="font-wide text-sub">{t.t}</p>
                <p className="mt-1 text-xs md:text-sm">{t.s}</p>
              </div>
              <ArrowUpRight className="size-6 transition group-hover:rotate-45" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════ BRAND STORY ═════════════════════ */
function BrandStory() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-2">
        <img src={img(lifestyleImage(burgundy, 2), 1400)} alt="SOHO in Dhaka" loading="lazy" className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full" />
        <div className="flex flex-col justify-center gap-6 px-4 py-16 md:px-14 md:py-24">
          <p className="eyebrow text-paper/60">About SOHO</p>
          <h2 className="font-wide text-big">Made for your everyday expression.</h2>
          <p className="max-w-lg text-paper/85">
            SOHO makes unisex clothing for people who'd rather not choose between comfortable and interesting. Every piece is sized M to XL and cut to work on any body.
          </p>
          <p className="max-w-lg text-paper/60">Based in Banani, Dhaka. Delivered everywhere in Bangladesh — check every order at your door before you accept it.</p>
          <Link to="/about" className={cn(btn, "w-fit bg-paper text-ink hover:bg-sale hover:text-sale-foreground")}>
            Learn more <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="mx-auto grid max-w-[1600px] items-end gap-10 px-4 section-y md:grid-cols-2 md:px-8">
      <h2 className="font-wide text-giga">From Dhaka.<br /><span className="text-sale">Worn by</span><br />anyone.</h2>
      <div className="max-w-md space-y-4 text-sm text-muted-foreground md:pb-4">
        <p className="text-foreground">SOHO makes unisex clothing for people who'd rather not choose between comfortable and interesting. Every piece is sized M to XL and cut to work on any body.</p>
        <p>Based in Banani, Dhaka. We deliver everywhere in Bangladesh, and you can check every order at your door before you accept it.</p>
        <Link to="/about" className="eyebrow inline-flex items-center gap-2 border-b border-foreground pb-1 text-foreground">Our story <ArrowRight className="size-3.5" /></Link>
      </div>
    </section>
  );
}

/* ═════════════════════ SOCIAL ═════════════════════ */
function Social() {
  const shots = [lifestyleImage(brown, 5), lifestyleImage(burgundy, 3), lifestyleImage(bottle, 4), lifestyleImage(forest, 0), lifestyleImage(navy, 1), lifestyleImage(burgundy, 5)];
  return (
    <section className="section-y">
      <div className="mx-auto mb-6 flex max-w-[1600px] items-end justify-between gap-4 border-b border-foreground/20 px-4 pb-4 md:px-8">
        <div>
          <p className="eyebrow mb-2 text-muted-foreground">Community</p>
          <h2 className="font-wide text-big [overflow-wrap:anywhere]">@soho__clothing</h2>
        </div>
        <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="eyebrow inline-flex shrink-0 items-center gap-2 bg-foreground px-4 py-2.5 text-background hover:bg-sale">
          <Instagram className="size-4" /> Follow
        </a>
      </div>
      <div className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {shots.map((s, i) => (
          <a key={i} href={CONTACT.instagram} target="_blank" rel="noreferrer" aria-label="Open SOHO on Instagram" className="group relative block overflow-hidden">
            <img src={img(s, 600)} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-110" />
            <span className="absolute inset-0 grid place-items-center bg-ink/0 opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
              <Instagram className="size-7 text-paper" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Marquee
        items={["SOHO culture", "Wear your energy", "New season new style", "SOHO culture", "Wear your energy"]}
        separator="✦"
        className="font-wide bg-ink py-4 text-xl text-paper md:text-3xl [&_[aria-hidden]>span>span]:text-sale"
      />
      <Categories />
      <FreshDrops />
      <NewSeason />
      <Trending />
      <Favourites />
      <Marquee
        items={["Season end sale", `Up to ${maxOff}% off`, "Every knit marked down", "Tk 80 delivery in Dhaka"]}
        separator="●"
        className="font-wide bg-sale py-3 text-lg text-sale-foreground md:text-2xl [&_[aria-hidden]>span>span]:text-[0.5em] [&_[aria-hidden]>span>span]:opacity-70"
      />
      <ShopTheLook />
      <OnSale />
      <Editorial />
      <MoreToExplore />
      <BrandStory />
      <Statement />
      <Social />
      <Newsletter eyebrow="Newsletter" title="Stay in the loop." copy="Get the latest drops, exclusive offers and SOHO updates." />
    </>
  );
}
