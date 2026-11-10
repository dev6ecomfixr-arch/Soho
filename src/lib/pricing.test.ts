import { describe, expect, it } from "vitest";

import { discountPct, getProduct } from "@/lib/catalog";
import { cartTotals, shippingFee } from "@/lib/pricing";

describe("SOHO pricing rules", () => {
  it("charges BDT 80 delivery inside Dhaka", () => {
    expect(shippingFee("inside-dhaka", 1)).toBe(80);
  });

  it("charges BDT 200 delivery outside Dhaka", () => {
    expect(shippingFee("outside-dhaka", 2)).toBe(200);
  });

  it("charges no delivery for an empty bag", () => {
    expect(shippingFee("outside-dhaka", 0)).toBe(0);
  });

  it("totals real prices plus delivery", () => {
    const t = cartTotals(
      [
        { handle: "burgundy-knit-raglan-polo", size: "M", qty: 2 },
        { handle: "navy-full-button-knit-polo", size: "L", qty: 1 },
      ],
      getProduct,
      "inside-dhaka",
    );
    expect(t.subtotal).toBe(1199 * 2 + 1499);
    expect(t.savings).toBe(301 * 2 + 301);
    expect(t.total).toBe(1199 * 2 + 1499 + 80);
  });

  it("shows the real discount on a raglan polo (Tk 1,500 → Tk 1,199)", () => {
    expect(discountPct({ price: 1199, compareAt: 1500 })).toBe(20);
  });
});
