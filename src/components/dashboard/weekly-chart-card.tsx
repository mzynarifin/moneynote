"use client";

import { Card } from "@/components/ui/card";
import { WeekNavigation } from "@/components/dashboard/week-navigation";
import { WeeklyExpenseChart } from "@/components/dashboard/weekly-expense-chart";
import { EmptyState } from "@/components/ui/empty-state";
import { EmptyWeeklyAction } from "@/components/dashboard/mobile-actions";

interface WeeklyChartCardProps {
  startLabel: string;
  prevHref: string;
  nextHref: string;
  todayHref: string;
  data: { date: string; total: number }[];
  weeklyTotal: number;
}

export function WeeklyChartCard({
  startLabel,
  prevHref,
  nextHref,
  todayHref,
  data,
  weeklyTotal,
}: WeeklyChartCardProps) {
  return (
    <Card>
      <div className="mb-4 space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Pengeluaran Mingguan</h2>
          <p className="text-sm text-muted">Pengeluaran harian pada minggu ini</p>
        </div>
        <WeekNavigation
          startLabel={startLabel}
          prevHref={prevHref}
          nextHref={nextHref}
          todayHref={todayHref}
        />
      </div>
      {weeklyTotal === 0 ? (
        <EmptyState
          title="Belum ada pengeluaran minggu ini"
          description="Pengeluaran yang kamu catat akan muncul di sini."
          action={<EmptyWeeklyAction />}
        />
      ) : (
        <WeeklyExpenseChart data={data} />
      )}
    </Card>
  );
}