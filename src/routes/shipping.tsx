import { createFileRoute } from "@tanstack/react-router";

import { PolicyLines, PolicyPage } from "@/components/site/PolicyPage";
import { policies } from "@/data/policies";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shipping")({
  head: () => seo("Shipping Policy", "Delivery charges and timelines for SOHO orders inside and outside Dhaka."),
  component: () => (
    <PolicyPage eyebrow="Customer care" title="Shipping Policy">
      <PolicyLines lines={policies["shipping_policy"] ?? []} />
    </PolicyPage>
  ),
});
