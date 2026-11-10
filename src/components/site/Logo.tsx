import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="SOHO home" className={cn("font-wide text-2xl leading-none tracking-tight", className)}>
      SOHO
    </Link>
  );
}
