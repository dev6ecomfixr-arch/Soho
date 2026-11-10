import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
  separator = "/",
}: {
  items: string[];
  className?: string;
  separator?: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          {t}
          <span aria-hidden className="opacity-40">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("overflow-hidden", className)} aria-label={items.join(", ")}>
      <div className="animate-marquee flex w-max" aria-hidden>
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
