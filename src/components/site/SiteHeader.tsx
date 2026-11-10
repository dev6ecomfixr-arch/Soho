import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/site/Logo";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { byNewest, formatTk, img, searchProducts } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/new-arrivals", label: "New In" },
  { to: "/shop", label: "Shop All" },
  { to: "/collections/$handle", params: { handle: "knit-polo" }, label: "Polos" },
  { to: "/collections/$handle", params: { handle: "knit-shirt" }, label: "Cardigans" },
] as const;

const ANNOUNCEMENTS = [
  "Season End Sale is live — up to 20% off every knit",
  "Delivery Tk 80 inside Dhaka · Tk 200 nationwide",
  "Check at the door — size exchange on delivery",
];

function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-foreground text-background">
      <Link
        to="/sale"
        className="mx-auto flex h-9 max-w-[1600px] items-center justify-center px-3 text-center text-[0.6rem] font-bold uppercase tracking-[0.12em] sm:text-[0.72rem] sm:tracking-[0.18em]"
      >
        <span key={i} className="animate-rise">
          {ANNOUNCEMENTS[i]}
        </span>
      </Link>
    </div>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 50);
  }, [open]);
  if (!open) return null;
  const results = searchProducts(q);
  const suggestions = ["polo", "cardigan", "burgundy", "green", "stripe"];
  return (
    <div className="fixed inset-0 z-50 bg-background/97 backdrop-blur" role="dialog" aria-label="Search">
      <div className="mx-auto max-w-5xl px-5 pt-6 md:pt-14">
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="Close search" className="grid size-10 place-items-center hover:bg-muted">
            <X />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            navigate({ to: "/search", search: { q } });
          }}
          className="mt-4 flex items-center gap-4 border-b-2 border-foreground pb-3"
        >
          <Search className="size-7 shrink-0" />
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search knits, colours…"
            className="font-wide w-full bg-transparent text-big outline-none placeholder:text-muted-foreground/50"
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />
        </form>
        {!q && (
          <div className="mt-8">
            <p className="eyebrow mb-3 text-muted-foreground">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQ(s)} className="border border-foreground px-4 py-2 text-sm font-semibold hover:bg-foreground hover:text-background">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {q && (
          <div className="mt-8">
            <p className="eyebrow mb-4 text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            {results.length === 0 ? (
              <p className="text-muted-foreground">No knits match “{q}”. Try “polo” or “cardigan”.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {results.map((p) => (
                  <li key={p.handle}>
                    <Link to="/products/$handle" params={{ handle: p.handle }} onClick={onClose} className="group block">
                      <img src={img(p.images[0], 400)} alt={p.name} className="aspect-[3/4] w-full object-cover" />
                      <p className="mt-2 text-sm font-semibold group-hover:underline">{p.name}</p>
                      <p className="text-sm">{formatTk(p.price)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const { cartCount, wishlist, setCartOpen, hydrated } = useStore();
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const newest = byNewest[0];
  const iconBtn = "relative grid size-10 place-items-center transition hover:bg-muted";

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-colors",
          scrolled ? "border-foreground/15 bg-background/90 backdrop-blur-md" : "border-transparent bg-background",
        )}
      >
        <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[4.5rem] md:px-8">
          <div className="flex items-center gap-1">
            <button className={cn(iconBtn, "lg:hidden")} aria-label="Open menu" onClick={() => setMenu(true)}>
              <Menu className="size-5" />
            </button>
            <nav className="hidden items-center gap-5 whitespace-nowrap lg:flex xl:gap-7" aria-label="Main">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  {...("params" in n ? { params: n.params } : {})}
                  className="eyebrow relative py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform hover:after:scale-x-100"
                  activeProps={{ className: "after:scale-x-100" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link to="/sale" className="eyebrow text-sale hover:opacity-70">
                Sale
              </Link>
            </nav>
          </div>
          <Logo className="text-[1.9rem] md:text-[2.2rem]" />
          <div className="flex items-center justify-end gap-0.5">
            <button className={iconBtn} aria-label="Search" onClick={() => setSearch(true)}>
              <Search className="size-5" />
            </button>
            <Link to="/wishlist" className={cn(iconBtn, "hidden sm:grid")} aria-label="Wishlist">
              <Heart className="size-5" />
              {hydrated && wishlist.length > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-sale text-[0.6rem] font-bold text-sale-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button className={iconBtn} aria-label={`Open bag, ${cartCount} items`} onClick={() => setCartOpen(true)}>
              <ShoppingBag className="size-5" />
              {hydrated && cartCount > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-foreground text-[0.6rem] font-bold text-background">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-full max-w-sm overflow-y-auto bg-background p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="border-b p-5">
            <span className="font-wide text-3xl">SOHO</span>
          </div>
          <nav className="flex flex-col p-5" aria-label="Mobile">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                {...("params" in n ? { params: n.params } : {})}
                onClick={() => setMenu(false)}
                className="font-wide border-b py-4 text-3xl"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/sale" onClick={() => setMenu(false)} className="font-wide border-b py-4 text-3xl text-sale">
              Sale
            </Link>
            {newest && (
              <Link to="/products/$handle" params={{ handle: newest.handle }} onClick={() => setMenu(false)} className="mt-6 block">
                <img src={img(newest.images[newest.lifestyle[0] ?? 0], 600)} alt={newest.name} className="aspect-[4/3] w-full object-cover" />
                <p className="eyebrow mt-2">Just dropped · {newest.name}</p>
              </Link>
            )}
            <div className="mt-8 flex flex-col gap-3 text-sm font-semibold">
              {(
                [
                  ["/latest-drops", "Knit Drop 0.1"],
                  ["/best-sellers", "Most Loved"],
                  ["/trending", "Trending"],
                  ["/wishlist", "Wishlist"],
                  ["/about", "About SOHO"],
                  ["/contact", "Contact"],
                  ["/faq", "FAQ"],
                ] as const
              ).map(([to, l]) => (
                <Link key={to} to={to} onClick={() => setMenu(false)} className="hover:underline">
                  {l}
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
