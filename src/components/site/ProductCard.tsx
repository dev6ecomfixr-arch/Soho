import { Link } from "@tanstack/react-router";
import { Eye, Heart } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { discountPct, formatTk, img, isInStock, lifestyleImage } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PriceLine({ p, className }: { p: Product; className?: string }) {
  const off = discountPct(p);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className="font-semibold">{formatTk(p.price)}</span>
      {p.compareAt && off > 0 && (
        <>
          <span className="text-[0.85em] text-muted-foreground line-through">{formatTk(p.compareAt)}</span>
          <span className="text-[0.75em] font-bold text-sale">−{off}%</span>
        </>
      )}
    </div>
  );
}

export function WishButton({ handle, className }: { handle: string; className?: string }) {
  const { isWished, toggleWishlist } = useStore();
  const on = isWished(handle);
  return (
    <button
      type="button"
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(handle);
      }}
      className={cn("grid size-9 place-items-center bg-background/85 backdrop-blur transition hover:bg-background", className)}
    >
      <Heart className={cn("size-4 transition", on && "fill-sale text-sale")} />
    </button>
  );
}

function SizeButtons({ p, onAdded }: { p: Product; onAdded?: () => void }) {
  const { addToCart } = useStore();
  return (
    <div className="flex gap-1.5">
      {p.sizes.map((s) => (
        <button
          key={s.size}
          type="button"
          disabled={!s.available}
          aria-label={`Add size ${s.size}`}
          onClick={(e) => {
            e.preventDefault();
            addToCart(p.handle, s.size);
            onAdded?.();
          }}
          className="h-9 flex-1 border border-foreground/40 text-xs font-bold transition hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:line-through disabled:hover:bg-transparent"
        >
          {s.size}
        </button>
      ))}
    </div>
  );
}

function QuickView({ p, open, onOpenChange }: { p: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 rounded-none p-0 sm:rounded-none">
        <div className="grid md:grid-cols-2">
          <img src={img(p.images[0], 900)} alt={p.name} className="aspect-[3/4] w-full bg-muted object-cover" />
          <div className="flex flex-col p-6">
            <p className="eyebrow text-muted-foreground">Unisex · {p.colour}</p>
            <DialogTitle className="font-wide mt-2 text-sub">{p.name}</DialogTitle>
            <PriceLine p={p} className="mt-3" />
            <p className="eyebrow mb-2 mt-6">Add to bag</p>
            <SizeButtons p={p} onAdded={() => onOpenChange(false)} />
            <Link to="/products/$handle" params={{ handle: p.handle }} className="eyebrow mt-auto pt-8 underline underline-offset-4">
              View full details
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProductCard({
  p,
  variant = "standard",
  label,
  priority = false,
}: {
  p: Product;
  variant?: "standard" | "editorial" | "tall";
  label?: string;
  priority?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [qv, setQv] = useState(false);
  const off = discountPct(p);
  const primary = variant === "editorial" ? lifestyleImage(p, 0) : p.images[0];
  const secondary = variant === "editorial" ? p.images[0] : (p.images[1] ?? lifestyleImage(p, 0));
  const ratio = variant === "tall" ? "aspect-[3/4.3]" : "aspect-[4/5]";
  const available = p.sizes.filter((s) => s.available).map((s) => s.size);

  return (
    <article className="group relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link to="/products/$handle" params={{ handle: p.handle }} className="block">
        <div className={cn("relative overflow-hidden bg-muted", ratio)}>
          <img
            src={img(primary, 800)}
            alt={`${p.name} — ${p.colour}`}
            loading={priority ? "eager" : "lazy"}
            className={cn("absolute inset-0 size-full object-cover transition duration-700", hover ? "opacity-0" : "opacity-100")}
          />
          <img
            src={img(secondary, 800)}
            alt=""
            aria-hidden
            loading="lazy"
            className={cn("absolute inset-0 size-full object-cover transition duration-700", hover ? "scale-100 opacity-100" : "scale-105 opacity-0")}
          />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            {label && <span className="bg-background px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.14em]">{label}</span>}
            {off > 0 && <span className="bg-sale px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.14em] text-sale-foreground">−{off}%</span>}
            {!isInStock(p) && <span className="bg-foreground px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.14em] text-background">SOLD OUT</span>}
          </div>
          <div className="absolute right-2 top-2 flex flex-col gap-1.5">
            <WishButton handle={p.handle} />
            <button
              type="button"
              aria-label={`Quick view ${p.name}`}
              onClick={(e) => {
                e.preventDefault();
                setQv(true);
              }}
              className="grid size-9 place-items-center bg-background/85 opacity-100 backdrop-blur transition hover:bg-background md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
            >
              <Eye className="size-4" />
            </button>
          </div>
          {isInStock(p) && (
            <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-background/95 p-2.5 backdrop-blur transition-transform duration-300 group-focus-within:translate-y-0 group-hover:translate-y-0 md:block">
              <SizeButtons p={p} />
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-sans text-[0.875rem] font-semibold tracking-normal md:text-[0.95rem]">
            <Link to="/products/$handle" params={{ handle: p.handle }} className="hover:underline">
              {p.name}
            </Link>
          </h3>
          <PriceLine p={p} className="mt-1 text-[0.875rem]" />
        </div>
        <span aria-label={`Colour ${p.colour}`} className="mt-1 size-3.5 shrink-0 ring-1 ring-foreground/20 ring-offset-2 ring-offset-background" style={{ background: p.swatch }} />
      </div>
      <p className="mt-1 text-[0.7rem] tracking-wide text-muted-foreground">
        {available.length ? `Sizes ${available.join(" · ")}` : "Currently sold out"}
      </p>
      <QuickView p={p} open={qv} onOpenChange={setQv} />
    </article>
  );
}
