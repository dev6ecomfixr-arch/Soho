import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { CONTACT, formatTk, getProduct, img } from "@/lib/catalog";
import { DELIVERY_ETA } from "@/lib/pricing";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => (typeof s["id"] === "string" ? { id: s["id"] } : {}),
  head: () => ({ meta: [...seo("Order Confirmed", "Your SOHO demo order confirmation.").meta, { name: "robots", content: "noindex" }] }),
  component: Confirmation,
});

function Confirmation() {
  const { id } = Route.useSearch();
  const { orders, hydrated } = useStore();
  if (!hydrated) return <div className="min-h-[60vh]" />;
  const order = orders.find((o) => o.id === id) ?? orders[0];

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-wide text-giga">No order found</h1>
        <Link to="/shop" className="mt-8 inline-block bg-foreground px-8 py-4 text-sm font-bold uppercase text-background">Shop all knits</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="grid size-16 place-items-center rounded-full bg-sale text-sale-foreground"><Check className="size-8" /></span>
          <p className="eyebrow mt-8 text-muted-foreground">Order {order.id}</p>
          <h1 className="font-wide text-mega mt-3">Got it, {order.customer.name.split(" ")[0]}.</h1>
          <p className="mt-6 max-w-lg text-lg">
            This is a demo confirmation — no payment was taken. In the real store, SOHO would deliver to {order.customer.address} within {DELIVERY_ETA[order.customer.zone]}.
          </p>
          <p className="mt-3 text-muted-foreground">Questions? Call {CONTACT.phone} ({CONTACT.hours}).</p>
          <Link to="/shop" className="mt-10 inline-block bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background hover:bg-foreground/85">
            Continue shopping
          </Link>
        </div>
        <div className="h-fit bg-card p-6 ring-1 ring-foreground/10 md:p-8">
          <h2 className="font-wide text-2xl">Order summary</h2>
          <ul className="mt-6 divide-y">
            {order.items.map((it) => {
              const p = getProduct(it.handle);
              return p ? (
                <li key={`${it.handle}-${it.size}`} className="flex gap-4 py-4">
                  <img src={img(p.images[0], 200)} alt={p.name} className="aspect-[3/4] w-16 object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-muted-foreground">Size {it.size} · Qty {it.qty}</p>
                  </div>
                  <p className="text-sm font-bold">{formatTk(p.price * it.qty)}</p>
                </li>
              ) : null;
            })}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-foreground/15 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatTk(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery ({order.customer.zone === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"})</dt><dd>{formatTk(order.shipping)}</dd></div>
            <div className="flex justify-between border-t border-foreground pt-3 text-lg font-bold"><dt>Total</dt><dd>{formatTk(order.total)}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
