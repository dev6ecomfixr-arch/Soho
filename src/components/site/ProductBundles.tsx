import { Link } from "@tanstack/react-router";
import { Check, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { formatTk, img, isInStock } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const firstSize = (p: Product) => p.sizes.find((s) => s.available)?.size ?? "";

function SizeSelect({ p, value, onChange }: { p: Product; value: string; onChange: (s: string) => void }) {
  return (
    <select
      aria-label={`Size for ${p.name}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 border border-foreground/25 bg-background px-1.5 text-xs font-semibold"
    >
      {p.sizes.map((s) => (
        <option key={s.size} value={s.size} disabled={!s.available}>
          {s.size}
          {s.available ? "" : " — sold out"}
        </option>
      ))}
    </select>
  );
}

/**
 * Complete the Look / Frequently bought together.
 * No bundle discount is configured for SOHO, so this shows a curated outfit total only.
 */
export function OutfitPicker({
  main,
  mainSize,
  recs,
  title = "Complete the look",
  subtitle = "Style it your way.",
  onNeedMainSize,
  className,
}: {
  main: Product;
  mainSize: string | null;
  recs: Product[];
  title?: string;
  subtitle?: string;
  onNeedMainSize: () => void;
  className?: string;
}) {
  const { addToCart } = useStore();
  const usable = useMemo(() => recs.filter(isInStock).slice(0, 3), [recs]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [sizes, setSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    setPicked(Object.fromEntries(usable.map((p, i) => [p.handle, i === 0])));
    setSizes(Object.fromEntries(usable.map((p) => [p.handle, firstSize(p)])));
  }, [usable]);

  const chosen = usable.filter((p) => picked[p.handle]);
  const total = main.price + chosen.reduce((n, p) => n + p.price, 0);

  const addAll = () => {
    if (!mainSize) {
      onNeedMainSize();
      toast.error("Pick a size for " + main.name + " first");
      return;
    }
    addToCart(main.handle, mainSize);
    chosen.forEach((p) => {
      const s = sizes[p.handle];
      if (s) addToCart(p.handle, s);
    });
  };

  if (!usable.length) return null;
  return (
    <div className={cn("border-2 border-foreground bg-card p-4", className)}>
      <p className="font-wide text-lg leading-none">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      <ul className="mt-4 divide-y divide-foreground/10">
        <li className="flex items-center gap-3 py-3">
          <span className="grid size-5 shrink-0 place-items-center bg-foreground text-background">
            <Check className="size-3" />
          </span>
          <img src={img(main.images[0], 160)} alt="" className="aspect-[4/5] w-12 bg-muted object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">This item</p>
            <p className="text-xs text-muted-foreground">{mainSize ? `Size ${mainSize}` : "Select size above"}</p>
          </div>
          <span className="text-xs font-semibold">{formatTk(main.price)}</span>
        </li>
        {usable.map((p) => (
          <li key={p.handle} className="flex items-center gap-3 py-3">
            <input
              type="checkbox"
              aria-label={`Include ${p.name}`}
              checked={!!picked[p.handle]}
              onChange={(e) => setPicked((s) => ({ ...s, [p.handle]: e.target.checked }))}
              className="size-5 shrink-0 accent-[var(--foreground)]"
            />
            <Link to="/products/$handle" params={{ handle: p.handle }} className="shrink-0">
              <img src={img(p.images[0], 160)} alt={p.name} className="aspect-[4/5] w-12 bg-muted object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link to="/products/$handle" params={{ handle: p.handle }} className="block truncate text-xs font-semibold hover:underline">
                {p.name}
              </Link>
              <div className="mt-1">
                <SizeSelect p={p} value={sizes[p.handle] ?? ""} onChange={(s) => setSizes((x) => ({ ...x, [p.handle]: s }))} />
              </div>
            </div>
            <span className="text-xs font-semibold">{formatTk(p.price)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-baseline justify-between border-t border-foreground/15 pt-3">
        <span className="text-xs text-muted-foreground">Outfit total · {chosen.length + 1} items</span>
        <span className="font-bold">{formatTk(total)}</span>
      </div>
      <button onClick={addAll} className="mt-3 h-12 w-full bg-foreground text-xs font-extrabold uppercase tracking-[0.14em] text-background hover:bg-sale hover:text-sale-foreground">
        Add selected to bag
      </button>
    </div>
  );
}

/** Build your bundle: one polo + one cardigan with quantities. No discount configured, so shows combined total. */
export function BundleBuilder({ polos, cardigans, className }: { polos: Product[]; cardigans: Product[]; className?: string }) {
  const { addToCart } = useStore();
  const rows = [
    { label: "Polo", list: polos.filter(isInStock) },
    { label: "Cardigan", list: cardigans.filter(isInStock) },
  ];
  const [sel, setSel] = useState(() => rows.map((r) => ({ handle: r.list[0]?.handle ?? "", size: r.list[0] ? firstSize(r.list[0]) : "", qty: 1 })));
  const products = sel.map((s, i) => rows[i]?.list.find((p) => p.handle === s.handle));
  const total = sel.reduce((n, s, i) => n + (products[i]?.price ?? 0) * s.qty, 0);
  const update = (i: number, patch: Partial<(typeof sel)[number]>) => setSel((x) => x.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  return (
    <div className={cn("border-2 border-foreground bg-ivory p-4", className)}>
      <p className="font-wide text-lg leading-none">Build your bundle</p>
      <p className="mt-1 text-xs text-muted-foreground">Polo under, cardigan over. Pick one of each.</p>
      <div className="mt-4 space-y-4">
        {rows.map((r, i) => {
          const p = products[i];
          const s = sel[i];
          if (!p || !s) return null;
          return (
            <div key={r.label} className="flex gap-3">
              <img src={img(p.images[0], 160)} alt="" className="aspect-[4/5] w-14 shrink-0 bg-muted object-cover" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{r.label}</p>
                <select
                  aria-label={`${r.label} colour`}
                  value={s.handle}
                  onChange={(e) => {
                    const np = r.list.find((x) => x.handle === e.target.value);
                    update(i, { handle: e.target.value, size: np ? firstSize(np) : "" });
                  }}
                  className="h-8 w-full border border-foreground/25 bg-background px-1.5 text-xs font-semibold"
                >
                  {r.list.map((x) => (
                    <option key={x.handle} value={x.handle}>
                      {x.colour} · {formatTk(x.price)}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <SizeSelect p={p} value={s.size} onChange={(v) => update(i, { size: v })} />
                  <div className="flex h-8 items-center border border-foreground/25">
                    <button aria-label={`Fewer ${r.label}`} onClick={() => update(i, { qty: Math.max(1, s.qty - 1) })} className="grid h-full w-7 place-items-center">
                      <Minus className="size-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold tabular-nums">{s.qty}</span>
                    <button aria-label={`More ${r.label}`} onClick={() => update(i, { qty: Math.min(10, s.qty + 1) })} className="grid h-full w-7 place-items-center">
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-baseline justify-between border-t border-foreground/15 pt-3">
        <span className="text-xs text-muted-foreground">Bundle total</span>
        <span className="font-bold">{formatTk(total)}</span>
      </div>
      <button
        onClick={() => sel.forEach((s) => s.handle && s.size && addToCart(s.handle, s.size, s.qty))}
        className="mt-3 h-12 w-full bg-foreground text-xs font-extrabold uppercase tracking-[0.14em] text-background hover:bg-sale hover:text-sale-foreground"
      >
        Add bundle to bag
      </button>
    </div>
  );
}
