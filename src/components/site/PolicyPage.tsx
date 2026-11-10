import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const LINKS = [
  ["/shipping", "Shipping"],
  ["/returns", "Returns & Exchange"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/faq", "FAQ"],
  ["/contact", "Contact"],
] as const;

export function PolicyPage({ eyebrow, title, children, updated }: { eyebrow: string; title: string; children: ReactNode; updated?: string }) {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-14 md:grid-cols-[220px_1fr] md:px-8 md:py-20">
      <aside className="md:sticky md:top-28 md:h-fit">
        <p className="eyebrow mb-4 text-muted-foreground">Customer care</p>
        <nav className="flex flex-wrap gap-2 md:flex-col md:gap-3">
          {LINKS.map(([to, l]) => (
            <Link key={to} to={to} className="text-sm font-semibold text-muted-foreground hover:text-foreground" activeProps={{ className: "!text-foreground underline underline-offset-4" }}>
              {l}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="max-w-3xl">
        <p className="eyebrow mb-4 text-muted-foreground">{eyebrow}</p>
        <h1 className="font-wide text-giga">{title}</h1>
        {updated && <p className="mt-4 text-sm text-muted-foreground">{updated}</p>}
        <div className="mt-10 space-y-5 text-[1.02rem] leading-relaxed [&_h2]:mt-10 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-normal [&_strong]:font-bold">
          {children}
        </div>
      </article>
    </div>
  );
}

/** Render lines of policy text; "Label: body" lines get a bold label. */
export function PolicyLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l, i) => {
        const m = /^([A-Z][^:]{2,48}):\s(.+)$/.exec(l);
        if (m) {
          return (
            <p key={i}>
              <strong>{m[1]}:</strong> {m[2]}
            </p>
          );
        }
        if (l.length < 70 && !/[.,]$/.test(l)) return <h2 key={i}>{l}</h2>;
        return <p key={i}>{l}</p>;
      })}
    </>
  );
}
