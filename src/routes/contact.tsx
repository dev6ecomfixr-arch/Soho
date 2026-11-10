import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { CONTACT } from "@/lib/catalog";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact SOHO", "Call +880 1305-426354, 11 AM–9 PM daily, or message SOHO on Facebook and Instagram."),
  component: Contact,
});

type F = { name: string; email: string; phone: string; topic: string; message: string };

function Contact() {
  const [f, setF] = useState<F>({ name: "", email: "", phone: "", topic: "Order tracking", message: "" });
  const [err, setErr] = useState<Partial<Record<keyof F, string>>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<keyof F, string>> = {};
    if (f.name.trim().length < 2) er.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email";
    if (f.message.trim().length < 10) er.message = "Tell us a bit more (10+ characters)";
    setErr(er);
    if (Object.keys(er).length) return;
    const prev = JSON.parse(localStorage.getItem("soho-contact") ?? "[]") as F[];
    localStorage.setItem("soho-contact", JSON.stringify([...prev, f]));
    setSent(true);
  };

  const field = "h-12 w-full border border-input bg-card px-3 outline-none focus:border-foreground";
  const cards = [
    { icon: Phone, t: "Call support", d: CONTACT.phone, href: CONTACT.phoneHref },
    { icon: Clock, t: "Hours", d: CONTACT.hours },
    { icon: MapPin, t: "Office", d: CONTACT.address },
    { icon: Instagram, t: "Instagram", d: "@soho__clothing", href: CONTACT.instagram },
    { icon: Facebook, t: "Facebook", d: "Message SOHO", href: CONTACT.facebook },
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-20">
      <p className="eyebrow mb-4 text-muted-foreground">Contact</p>
      <h1 className="font-wide text-mega">Talk to us.</h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">Tracking an order, swapping a size or just asking about fit — our team is around every day.</p>
      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <ul className="grid gap-3 self-start">
          {cards.map(({ icon: I, t, d, href }) => {
            const inner = (
              <>
                <I className="size-5 shrink-0" />
                <span>
                  <span className="eyebrow block text-muted-foreground">{t}</span>
                  <span className="mt-1 block font-semibold">{d}</span>
                </span>
              </>
            );
            return (
              <li key={t}>
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex gap-4 border border-foreground/15 p-5 transition hover:border-foreground">{inner}</a>
                ) : (
                  <div className="flex gap-4 border border-foreground/15 p-5">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
        {sent ? (
          <div className="flex flex-col justify-center bg-foreground p-10 text-background">
            <p className="font-wide text-giga">Thanks, {f.name.split(" ")[0]}.</p>
            <p className="mt-4 text-lg">Your message is saved (demo). For anything urgent, call {CONTACT.phone}.</p>
            <button onClick={() => { setSent(false); setF({ ...f, message: "" }); }} className="mt-8 w-fit border-b-2 border-door-foreground pb-1 font-bold">Send another</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4 bg-card p-6 ring-1 ring-foreground/10 md:grid-cols-2 md:p-10">
            {(["name", "email", "phone"] as const).map((k) => (
              <div key={k} className={k === "phone" ? "" : ""}>
                <label htmlFor={k} className="mb-1.5 block text-sm font-semibold capitalize">{k}{k === "phone" && <span className="font-normal text-muted-foreground"> (optional)</span>}</label>
                <input id={k} type={k === "email" ? "email" : k === "phone" ? "tel" : "text"} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={cn(field, err[k] && "border-destructive")} aria-invalid={!!err[k]} />
                {err[k] && <p className="mt-1 text-xs font-semibold text-destructive">{err[k]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="topic" className="mb-1.5 block text-sm font-semibold">Topic</label>
              <select id="topic" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} className={field}>
                {["Order tracking", "Size exchange", "Product question", "Other"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">Message</label>
              <textarea id="message" rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={cn(field, "h-auto py-2", err.message && "border-destructive")} aria-invalid={!!err.message} />
              {err.message && <p className="mt-1 text-xs font-semibold text-destructive">{err.message}</p>}
            </div>
            <button className="h-14 bg-foreground text-sm font-extrabold uppercase tracking-widest text-background hover:bg-foreground/85 md:col-span-2">Send message</button>
          </form>
        )}
      </div>
    </div>
  );
}
