import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavProps {
  startLabel: string;
  prevHref: string;
  nextHref: string;
  todayHref: string;
}

export function WeekNavigation({ startLabel, prevHref, nextHref, todayHref }: WeekNavProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm font-semibold">{startLabel}</p>
      <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
        <Link
          href={prevHref}
          className="rounded-md px-2 py-1 text-muted transition-colors hover:bg-background hover:text-ink"
          aria-label="Minggu sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <Link
          href={todayHref}
          className="rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-background"
        >
          Minggu ini
        </Link>
        <Link
          href={nextHref}
          className="rounded-md px-2 py-1 text-muted transition-colors hover:bg-background hover:text-ink"
          aria-label="Minggu berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}