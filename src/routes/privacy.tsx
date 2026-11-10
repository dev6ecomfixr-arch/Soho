import { createFileRoute } from "@tanstack/react-router";

import { PolicyLines, PolicyPage } from "@/components/site/PolicyPage";
import { policies } from "@/data/policies";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy", "How SOHO collects, uses and protects your personal information."),
  component: () => (
    <PolicyPage eyebrow="Customer care" title="Privacy Policy">
      <PolicyLines lines={policies["privacy_policy"] ?? []} />
    </PolicyPage>
  ),
});
