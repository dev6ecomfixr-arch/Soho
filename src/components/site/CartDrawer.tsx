import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatTk, getProduct, img, products } from "@/lib/catalog";
import { cartTotals } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export function QtyStepper({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex h-9 items-center border border-foreground">
      <button aria-label="Decrease quantity" onClick={() => onChange(qty - 1)} className="grid h-full w-9 place-items-center hover:bg-muted">
        <Minus className="size-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
      <button aria-label="Increase quantity" onClick={() => onChange(qty + 1)} disabled={qty >= 10} className="grid h-full w-9 place-items-center hover:bg-muted disabled:opacity-40">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, addToCart } = useStore();
  const t = cartTotals(cart, getProduct, "inside-dhaka");
  const suggestion = products.find((p) => !cart.some((c) => c.handle === p.handle));

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md">
        <div className="flex items-center justify-between border-b p-5">
          <SheetTitle className="font-wide text-2xl">Your Bag ({t.count})</SheetTitle>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
            <p className="font-wide text-giga outline-text">Empty</p>
            <p className="text-muted-foreground">Your bag is waiting for its first knit.</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background hover:bg-foreground/85">
              Shop the drop
            </Link>
          </div>
        ) : (
          <>
            {t.savings > 0 && (
              <div className="bg-sale px-5 py-2.5 text-sm font-bold text-sale-foreground">
                You're saving {formatTk(t.savings)} with the Season End Sale
              </div>
            )}
            <ul className="flex-1 divide-y overflow-y-auto px-5">
              {cart.map((c) => {
                const p = getProduct(c.handle);
                if (!p) return null;
                return (
                  <li key={`${c.handle}-${c.size}`} className="flex gap-4 py-5">
                    <Link to="/products/$handle" params={{ handle: p.handle }} onClick={() => setCartOpen(false)} className="w-24 shrink-0">
                      <img src={img(p.images[0], 300)} alt={p.name} className="aspect-[3/4] w-full object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug">{p.name}</p>
                        <button aria-label={`Remove ${p.name}`} onClick={() => removeFromCart(c.handle, c.size)} className="h-fit text-muted-foreground hover:text-foreground">
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p.colour} · Size {c.size}
                      </p>
                      <div className="mt-auto flex items-end justify-between pt-3">
                        <QtyStepper qty={c.qty} onChange={(n) => updateQty(c.handle, c.size, n)} />
                        <span className="text-sm font-bold">{formatTk(p.price * c.qty)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
              {suggestion && (
                <li className="py-5">
                  <p className="eyebrow mb-3 text-muted-foreground">Complete the look</p>
                  <div className="flex items-center gap-3 bg-muted p-3">
                    <img src={img(suggestion.images[0], 200)} alt={suggestion.name} className="aspect-[3/4] w-14 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{suggestion.name}</p>
                      <p className="text-sm">{formatTk(suggestion.price)}</p>
                    </div>
                    {(() => {
                      const size = suggestion.sizes.find((s) => s.available)?.size;
                      return size ? (
                        <button onClick={() => addToCart(suggestion.handle, size)} className="border border-foreground px-3 py-2 text-xs font-bold uppercase hover:bg-foreground hover:text-background">
                          Add {size}
                        </button>
                      ) : null;
                    })()}
                  </div>
                </li>
              )}
            </ul>
            <div className="border-t p-5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-bold">{formatTk(t.subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Delivery Tk 80 inside Dhaka · Tk 200 outside. Calculated at checkout.</p>
              <Link
                to="/cart"
                onClick={() => setCartOpen(false)}
                className="mt-4 flex h-14 items-center justify-center bg-foreground text-sm font-bold uppercase tracking-widest text-background transition hover:bg-foreground/85"
              >
                Checkout · {formatTk(t.subtotal)}
              </Link>
              <button onClick={() => setCartOpen(false)} className="mt-3 w-full text-center text-xs font-semibold underline">
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
