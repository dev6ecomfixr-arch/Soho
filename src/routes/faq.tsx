import { createFileRoute, Link } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONTACT } from "@/lib/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => seo("FAQ", "Answers on SOHO sizing, delivery charges, delivery times and size exchanges."),
  component: Faq,
});

const QA: [string, React.ReactNode][] = [
  ["How much is delivery?", "Tk 80 inside Dhaka and Tk 200 for anywhere else in Bangladesh."],
  ["How long does delivery take?", "Usually 1–2 business days inside Dhaka and 2–5 business days outside Dhaka."],
  ["What sizes do you make?", "Every SOHO piece is unisex and comes in M (chest 38–40″, length 25.5″), L (40–42″, 26.5″) and XL (42–44″, 27.5″)."],
  ["Is the fit unisex?", "Yes — every piece is cut to work on any body. If you're between sizes, size up for a relaxed fit."],
  ["Can I check my order before accepting it?", "Yes. Please check your item while the delivery agent is present to confirm you received the correct product and size."],
  ["How do I exchange a size?", <>Message SOHO with your full order details, a short reason and your preferred size. For an exchange right at delivery, return the item to the agent and pay only the delivery charge (Tk 80 Dhaka / Tk 200 outside). <Link to="/returns" className="underline">Read the policy</Link>.</>],
  ["How do I contact you?", <>Call {CONTACT.phone}, {CONTACT.hours}, or message us on Facebook or Instagram.</>],
  ["Is the sale price final?", "Sale prices shown are the current Season End Sale prices from SOHO's store."],
];

function Faq() {
  return (
    <PolicyPage eyebrow="Help" title="FAQ">
      <Accordion type="single" collapsible className="border-t border-foreground">
        {QA.map(([q, a], i) => (
          <AccordionItem key={i} value={`q${i}`}>
            <AccordionTrigger className="py-5 text-left font-sans text-lg font-bold">{q}</AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PolicyPage>
  );
}
