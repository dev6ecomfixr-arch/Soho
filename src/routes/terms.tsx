import { createFileRoute } from "@tanstack/react-router";

import { PolicyLines, PolicyPage } from "@/components/site/PolicyPage";
import { policies } from "@/data/policies";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms of Service", "The terms that apply when you browse and buy from SOHO."),
  component: () => (
    <PolicyPage eyebrow="Customer care" title="Terms of Service">
      <PolicyLines lines={policies["terms_of_service"] ?? []} />
    </PolicyPage>
  ),
});
