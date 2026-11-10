import { createFileRoute, Link } from "@tanstack/react-router";

import { Marquee } from "@/components/site/Marquee";
import { CONTACT, getProduct, HERO_IMAGE, img, lifestyleImage } from "@/lib/catalog";
import { seo } from "@/lib/seo";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/about")({
  head: () => seo("About SOHO", "SOHO is a unisex clothing label based in Banani, Dhaka, making bold knitwear for everyone."),
  component: About,
});

const brown = getProduct("brown-full-button-knit-polo") as Product;
const burgundy = getProduct("burgundy-knit-raglan-polo") as Product;
const bottle = getProduct("bottle-green-knit-raglan-polo") as Product;

function About() {
  return (
    <>
      <section className="relative h-[80vh] min-h-[520px] overflow-hidden">
        <img src={img(HERO_IMAGE, 2000)} alt="SOHO campaign" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-4 pb-14 text-paper md:px-8">
          <p className="eyebrow mb-4">About SOHO</p>
          <h1 className="font-wide text-mega">Clothes with<br />no rules.</h1>
        </div>
      </section>
      <Marquee items={["Unisex", "Knitwear", "Banani, Dhaka", "M · L · XL", "Check at the door"]} className="font-wide border-b border-foreground py-4 text-2xl md:text-3xl" />
      <section className="mx-auto grid max-w-[1600px] gap-10 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
        <h2 className="font-wide text-giga">One fit.<br /><span className="text-sale">Everybody.</span></h2>
        <div className="space-y-6 text-lg">
          <p>SOHO is a clothing label from Dhaka. Everything we make is unisex — sized M to XL, cut to sit right on any body, and styled to be shared, swapped and borrowed.</p>
          <p>Our first knit capsule, Knit Drop 0.1, brings together ribbed raglan polos with tipped collars and open-knit striped cardigans. Easy shapes, rich colours, made for the heat and the street.</p>
          <p className="text-muted-foreground">We'd rather make a few pieces properly than a hundred pieces badly.</p>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-1 md:grid-cols-3">
        {[lifestyleImage(brown, 2), lifestyleImage(burgundy, 1), lifestyleImage(bottle, 3)].map((s, i) => (
          <img key={i} src={img(s, 900)} alt="" loading="lazy" className={`aspect-[3/4] w-full object-cover ${i === 2 ? "col-span-2 aspect-video md:col-span-1 md:aspect-[3/4]" : ""}`} />
        ))}
      </section>
      <section className="mx-auto grid max-w-[1600px] gap-8 px-4 py-20 md:grid-cols-3 md:px-8">
        {[
          ["01", "Unisex by default", "No men's and women's aisles. Just your size."],
          ["02", "Check before you accept", "Inspect every order at the door while the delivery agent waits."],
          ["03", "Delivered everywhere", "Tk 80 inside Dhaka, Tk 200 anywhere else in Bangladesh."],
        ].map(([n, t, d]) => (
          <div key={n} className="border-t-2 border-foreground pt-5">
            <p className="eyebrow text-sale">{n}</p>
            <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <section className="bg-foreground text-background">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-6 px-4 py-16 md:px-8">
          <div>
            <p className="eyebrow mb-3 text-background/60">Find us</p>
            <p className="font-wide text-big">{CONTACT.address}</p>
          </div>
          <Link to="/shop" className="bg-background px-8 py-4 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background">Shop the knits</Link>
        </div>
      </section>
    </>
  );
}
