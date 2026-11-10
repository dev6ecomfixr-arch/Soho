import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHead({
  index,
  eyebrow,
  title,
  linkTo,
  linkLabel = "View all",
  aside,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  linkTo?: LinkProps["to"];
  linkLabel?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
      <div className="min-w-0 max-w-full">
        <p className="eyebrow mb-3 flex items-center gap-3 text-muted-foreground">
          {index && <span className="text-foreground">{index}</span>}
          <span className="h-px w-8 bg-foreground/40" />
          {eyebrow}
        </p>
        <h2 className="font-wide text-big [overflow-wrap:anywhere]">{title}</h2>
      </div>
      <div className="flex items-center gap-6">
        {aside}
        {linkTo && (
          <Link
            to={linkTo}
            className="eyebrow group inline-flex items-center gap-1.5 border-b border-foreground/40 pb-1 hover:border-foreground"
          >
            {linkLabel}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
