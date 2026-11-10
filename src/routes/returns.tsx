import { createFileRoute } from "@tanstack/react-router";

import { PolicyLines, PolicyPage } from "@/components/site/PolicyPage";
import { policies } from "@/data/policies";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/returns")({
  head: () => seo("Return & Exchange Policy", "How to check, exchange and swap sizes on your SOHO order."),
  component: () => (
    <PolicyPage eyebrow="Customer care" title="Return & Exchange Policy">
      <PolicyLines lines={policies["refund_policy"] ?? []} />
    </PolicyPage>
  ),
});
