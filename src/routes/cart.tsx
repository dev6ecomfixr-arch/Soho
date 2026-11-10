import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, X } from "lucide-react";
import { useState } from "react";

import { QtyStepper } from "@/components/site/CartDrawer";
import { ProductCard } from "@/components/site/ProductCard";
import { formatTk, getProduct, img, products } from "@/lib/catalog";
import { cartTotals, DELIVERY_ETA, DELIVERY_FEES } from "@/lib/pricing";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import type { DeliveryZone } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => seo("Your Bag & Checkout", "Review your SOHO bag, choose delivery inside or outside Dhaka and place your order."),
  component: CartPage,
});

type Errors = Partial<Record<"name" | "phone" | "address", string>>;

function CartPage() {
  const { cart, hydrated, updateQty, removeFromCart, placeOrder } = useStore();
  const navigate = useNavigate();
  const [zone, setZone] = useState<DeliveryZone>("inside-dhaka");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [errors, setErrors] = useState<Errors>({});
  const t = cartTotals(cart, getProduct, zone);

  if (!hydrated) return <div className="min-h-[60vh]" />;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8">
        <h1 className="font-wide text-mega outline-text">Bag empty</h1>
        <p className="mt-6 max-w-md text-lg text-muted-foreground">Nothing in here yet. Start with the knit everyone's wearing.</p>
        <Link to="/shop" className="mt-8 inline-block bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background hover:bg-foreground/85">
          Shop all knits
        </Link>
        <div className="mt-20 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {products.slice(0, 4).map((p) => <ProductCard key={p.handle} p={p} />)}
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (form.name.trim().length < 2) er.name = "Enter your full name";
    if (!/^(\+?880|0)1[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""))) er.phone = "Enter a valid Bangladeshi mobile number (e.g. 01XXXXXXXXX)";
    if (form.address.trim().length < 10) er.address = "Enter your full delivery address";
    setErrors(er);
    if (Object.keys(er).length) return;
    const id = `SOHO-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    placeOrder({
      id,
      createdAt: new Date().toISOString(),
      items: cart,
      customer: { ...form, zone },
      subtotal: t.subtotal,
      shipping: t.shipping,
      total: t.total,
    });
    navigate({ to: "/order-confirmation", search: { id } });
  };

  const field = "h-12 w-full border border-input bg-card px-3 outline-none focus:border-foreground";

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-wide text-giga">Your bag <span className="text-muted-foreground">({t.count})</span></h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <ul className="divide-y border-y border-foreground">
            {cart.map((c) => {
              const p = getProduct(c.handle);
              if (!p) return null;
              return (
                <li key={`${c.handle}-${c.size}`} className="flex gap-5 py-6">
                  <Link to="/products/$handle" params={{ handle: p.handle }} className="w-28 shrink-0 md:w-36">
                    <img src={img(p.images[0], 400)} alt={p.name} className="aspect-[3/4] w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link to="/products/$handle" params={{ handle: p.handle }} className="font-semibold hover:underline">{p.name}</Link>
                        <p className="mt-1 text-sm text-muted-foreground">{p.colour} · Size {c.size}</p>
                        <p className="mt-1 text-sm">
                          {formatTk(p.price)} {p.compareAt && <span className="text-muted-foreground line-through">{formatTk(p.compareAt)}</span>}
                        </p>
                      </div>
                      <button aria-label={`Remove ${p.name}`} onClick={() => removeFromCart(c.handle, c.size)} className="h-fit text-muted-foreground hover:text-foreground">
                        <X className="size-5" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <QtyStepper qty={c.qty} onChange={(n) => updateQty(c.handle, c.size, n)} />
                      <span className="font-bold">{formatTk(p.price * c.qty)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Link to="/shop" className="mt-6 inline-block text-sm font-semibold underline">← Continue shopping</Link>
        </div>

        <form onSubmit={submit} noValidate className="h-fit bg-card p-6 ring-1 ring-foreground/10 md:p-8 lg:sticky lg:top-24">
          <h2 className="font-wide text-2xl">Checkout</h2>
          <p className="mt-1 text-xs text-muted-foreground">Demo checkout — no payment is taken and no real order is sent.</p>

          <fieldset className="mt-6">
            <legend className="eyebrow mb-3">Delivery</legend>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(DELIVERY_FEES) as DeliveryZone[]).map((z) => (
                <label key={z} className={cn("cursor-pointer border p-3 text-sm transition", zone === z ? "border-foreground bg-background" : "border-input")}>
                  <input type="radio" name="zone" className="sr-only" checked={zone === z} onChange={() => setZone(z)} />
                  <span className="block font-bold">{z === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</span>
                  <span className="block text-muted-foreground">{formatTk(DELIVERY_FEES[z])} · {DELIVERY_ETA[z]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4">
            {(
              [
                ["name", "Full name", "text", "name"],
                ["phone", "Mobile number", "tel", "tel"],
              ] as const
            ).map(([k, l, type, ac]) => (
              <div key={k}>
                <label htmlFor={k} className="mb-1.5 block text-sm font-semibold">{l}</label>
                <input id={k} type={type} autoComplete={ac} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={cn(field, errors[k] && "border-destructive")} aria-invalid={!!errors[k]} />
                {errors[k] && <p className="mt-1 text-xs font-semibold text-destructive">{errors[k]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="address" className="mb-1.5 block text-sm font-semibold">Delivery address</label>
              <textarea id="address" rows={3} autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={cn(field, "h-auto py-2", errors.address && "border-destructive")} aria-invalid={!!errors.address} />
              {errors.address && <p className="mt-1 text-xs font-semibold text-destructive">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="note" className="mb-1.5 block text-sm font-semibold">Order note <span className="font-normal text-muted-foreground">(optional)</span></label>
              <input id="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={field} />
            </div>
          </div>

          <dl className="mt-8 space-y-2 border-t border-foreground/15 pt-5 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatTk(t.subtotal)}</dd></div>
            {t.savings > 0 && <div className="flex justify-between text-sale"><dt>Sale savings</dt><dd>−{formatTk(t.savings)}</dd></div>}
            <div className="flex justify-between"><dt>Delivery</dt><dd>{formatTk(t.shipping)}</dd></div>
            <div className="flex justify-between border-t border-foreground pt-3 text-lg font-bold"><dt>Total</dt><dd>{formatTk(t.total)}</dd></div>
          </dl>
          <button type="submit" className="mt-6 flex h-14 w-full items-center justify-center gap-2 bg-foreground text-sm font-extrabold uppercase tracking-widest text-background hover:bg-foreground/85">
            <Lock className="size-4" /> Place demo order · {formatTk(t.total)}
          </button>
        </form>
      </div>
    </div>
  );
}
