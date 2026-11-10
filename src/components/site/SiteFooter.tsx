import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONTACT } from "@/lib/catalog";

export function Newsletter({
  title = "Get the next drop first.",
  copy = "New knits, restocks and sale alerts before anywhere else. Unsubscribe anytime.",
  eyebrow = "Newsletter",
}: { title?: string; copy?: string; eyebrow?: string } = {}) {
  const [email, setEmail] = useState("");
  return (
    <section className="border-t border-foreground/10 bg-ivory">
      <div className="mx-auto grid max-w-[1600px] items-end gap-8 px-4 section-y md:grid-cols-[1fr_1fr] md:px-8">
        <div>
          <p className="eyebrow mb-3 text-muted-foreground">{eyebrow}</p>
          <h2 className="font-wide text-big">{title}</h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{copy}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              toast.error("Enter a valid email address");
              return;
            }
            const list = JSON.parse(localStorage.getItem("soho-newsletter") ?? "[]") as string[];
            localStorage.setItem("soho-newsletter", JSON.stringify([...new Set([...list, email])]));
            toast.success("You're on the list", { description: "Demo signup saved on this device." });
            setEmail("");
          }}
          className="flex border border-foreground/30 bg-background focus-within:border-foreground"
        >
          <label htmlFor="nl" className="sr-only">
            Email
          </label>
          <input
            id="nl"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="bg-foreground px-6 text-xs font-bold uppercase tracking-[0.14em] text-background hover:bg-foreground/85">Join</button>
        </form>
      </div>
    </section>
  );
}

const COLS = [
  {
    title: "Shop",
    links: [
      ["/new-arrivals", "New Arrivals"],
      ["/latest-drops", "Knit Drop 0.1"],
      ["/best-sellers", "Most Loved"],
      ["/sale", "Sale"],
      ["/shop", "Shop All"],
    ],
  },
  {
    title: "Support",
    links: [
      ["/contact", "Contact"],
      ["/faq", "FAQ"],
      ["/shipping", "Shipping"],
      ["/returns", "Returns & Exchange"],
    ],
  },
  {
    title: "SOHO",
    links: [
      ["/about", "About"],
      ["/wishlist", "Wishlist"],
      ["/privacy", "Privacy Policy"],
      ["/terms", "Terms of Service"],
    ],
  },
] as const;

function LinkList({ links }: { links: readonly (readonly [string, string])[] }) {
  return (
    <ul className="space-y-2.5 text-sm text-background/80">
      {links.map(([to, l]) => (
        <li key={to}>
          <Link to={to} className="hover:text-background">
            {l}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1600px] px-4 pt-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="max-w-xs text-sm text-background/70">Unisex knitwear from Dhaka. Made to be worn often and kept for years.</p>
            <div className="mt-5 space-y-1.5 text-xs text-background/60">
              <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-background">
                <Phone className="size-3.5" /> {CONTACT.phone}
              </a>
              <p>{CONTACT.hours}</p>
              <p>{CONTACT.address}</p>
            </div>
            <div className="mt-5 flex gap-2">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" aria-label="SOHO on Instagram" className="grid size-9 place-items-center border border-background/25 hover:bg-background hover:text-foreground">
                <Instagram className="size-4" />
              </a>
              <a href={CONTACT.facebook} target="_blank" rel="noreferrer" aria-label="SOHO on Facebook" className="grid size-9 place-items-center border border-background/25 hover:bg-background hover:text-foreground">
                <Facebook className="size-4" />
              </a>
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title} className="hidden md:block">
              <p className="eyebrow mb-4 text-background/50">{c.title}</p>
              <LinkList links={c.links} />
            </div>
          ))}
          <Accordion type="multiple" className="md:hidden">
            {COLS.map((c) => (
              <AccordionItem key={c.title} value={c.title} className="border-background/15">
                <AccordionTrigger className="eyebrow py-4">{c.title}</AccordionTrigger>
                <AccordionContent>
                  <LinkList links={c.links} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-background/15 py-5 text-xs text-background/50">
          <p>© {new Date().getFullYear()} SOHO. All rights reserved.</p>
          <p>Delivery across Bangladesh · Check your order at the door</p>
        </div>
      </div>
      <p aria-hidden className="font-wide select-none overflow-hidden whitespace-nowrap text-center text-[26vw] leading-[0.78] text-background min-[1600px]:text-[26rem]">
        SOHO
      </p>
    </footer>
  );
}
