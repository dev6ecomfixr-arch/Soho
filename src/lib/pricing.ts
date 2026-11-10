import type { CartItem, DeliveryZone, Product } from "@/lib/types";

/** SOHO's published delivery charges (BDT). */
export const DELIVERY_FEES: Record<DeliveryZone, number> = {
  "inside-dhaka": 80,
  "outside-dhaka": 200,
};

export const DELIVERY_ETA: Record<DeliveryZone, string> = {
  "inside-dhaka": "1–2 business days",
  "outside-dhaka": "2–5 business days",
};

export function shippingFee(zone: DeliveryZone, itemCount: number): number {
  return itemCount > 0 ? DELIVERY_FEES[zone] : 0;
}

export function cartTotals(
  items: CartItem[],
  lookup: (handle: string) => Product | undefined,
  zone: DeliveryZone,
) {
  let subtotal = 0;
  let savings = 0;
  let count = 0;
  for (const it of items) {
    const p = lookup(it.handle);
    if (!p) continue;
    subtotal += p.price * it.qty;
    if (p.compareAt && p.compareAt > p.price) savings += (p.compareAt - p.price) * it.qty;
    count += it.qty;
  }
  const shipping = shippingFee(zone, count);
  return { subtotal, savings, count, shipping, total: subtotal + shipping };
}
