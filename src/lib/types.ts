export type CollectionHandle = "knit-polo" | "knit-shirt";

export interface SizeOption {
  size: string;
  available: boolean;
}

export interface Product {
  handle: string;
  title: string;
  name: string;
  colour: string;
  swatch: string;
  collection: CollectionHandle;
  price: number;
  compareAt: number | null;
  sizes: SizeOption[];
  images: string[];
  /** Indices into `images` that are campaign / lifestyle shots. */
  lifestyle: number[];
  createdAt: string;
}

export interface CartItem {
  handle: string;
  size: string;
  qty: number;
}

export type DeliveryZone = "inside-dhaka" | "outside-dhaka";

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: { name: string; phone: string; address: string; zone: DeliveryZone; note: string };
  subtotal: number;
  shipping: number;
  total: number;
}
