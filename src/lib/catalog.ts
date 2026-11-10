import { products } from "@/data/products";
import type { CollectionHandle, Product } from "@/lib/types";

export { products };

export const CDN_FALLBACK = "https://cdn.shopify.com";

/** Shopify CDN resize. */
export function img(src: string | undefined, width = 900): string {
  if (!src) return "";
  return `${src}?width=${width}`;
}

export const HERO_IMAGE = "https://www.sohobd.com/cdn/shop/files/DSC00647-Edit_copy.jpg";

export function formatTk(n: number): string {
  return `Tk ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function discountPct(p: Pick<Product, "price" | "compareAt">): number {
  if (!p.compareAt || p.compareAt <= p.price) return 0;
  return Math.round(((p.compareAt - p.price) / p.compareAt) * 100);
}

export function getProduct(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function lifestyleImage(p: Product, n = 0): string {
  const idx = p.lifestyle[n % Math.max(p.lifestyle.length, 1)] ?? 0;
  return p.images[idx] ?? p.images[0] ?? "";
}

export function isInStock(p: Product): boolean {
  return p.sizes.some((s) => s.available);
}

export const byNewest = [...products].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

export interface CollectionDef {
  handle: CollectionHandle;
  title: string;
  kicker: string;
  blurb: string;
  heroHandle: string;
}

export const collections: CollectionDef[] = [
  {
    handle: "knit-polo",
    title: "Knit Raglan Polos",
    kicker: "Knit Drop 0.1",
    blurb:
      "Ribbed raglan knits with contrast-tipped collars and hems. Cut unisex, made for long Dhaka afternoons.",
    heroHandle: "burgundy-knit-raglan-polo",
  },
  {
    handle: "knit-shirt",
    title: "Full Button Knit Cardigans",
    kicker: "Knit Drop 0.1",
    blurb:
      "Bold vertical stripes, open knit, full button placket. The shirt you wear open over everything.",
    heroHandle: "brown-full-button-knit-polo",
  },
];

export function getCollection(handle: string): CollectionDef | undefined {
  return collections.find((c) => c.handle === handle);
}

export function inCollection(handle: CollectionHandle): Product[] {
  return products.filter((p) => p.collection === handle);
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "discount";

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const l = [...list];
  switch (sort) {
    case "newest":
      return l.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "price-asc":
      return l.sort((a, b) => a.price - b.price);
    case "price-desc":
      return l.sort((a, b) => b.price - a.price);
    case "discount":
      return l.sort((a, b) => discountPct(b) - discountPct(a));
    default:
      return l;
  }
}

export function searchProducts(q: string): Product[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const words = t.split(/\s+/);
  return products.filter((p) => {
    const hay = `${p.name} ${p.colour} ${p.collection} knit unisex ${p.collection === "knit-polo" ? "polo raglan" : "cardigan shirt stripe button"}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export const CONTACT = {
  phone: "+880 1305-426354",
  phoneHref: "tel:+8801305426354",
  hours: "7 days a week, 11:00 AM – 9:00 PM (Dhaka time)",
  address: "Road 17/A, House 28, Block E, Banani, Dhaka",
  instagram: "https://www.instagram.com/soho__clothing/",
  facebook: "https://www.facebook.com/profile.php?id=61582139752568",
};
