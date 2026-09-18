import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { SummaryCard, SummaryGrid } from "@/components/dashboard/summary-grid";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { InitialBalanceOnboarding } from "@/components/dashboard/initial-balance-onboarding";
import { WeeklyChartCard } from "@/components/dashboard/weekly-chart-card";
import { MobileActions } from "@/components/dashboard/mobile-actions";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/queries/dashboard";
import { addWeeks, buildWeek, parseISO, weekLabel } from "@/lib/format";

function weekHref(weekStart: string): string {
  return weekStart === buildWeek(new Date()).start
    ? "/dashboard"
    : `/dashboard?week=${weekStart}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const anchor =
    sp.week && /^\d{4}-\d{2}-\d{2}$/.test(sp.week) ? sp.week : buildWeek(new Date()).start;
  const week = buildWeek(parseISO(anchor));

  const data = await getDashboardData(week.start, week.end);

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .maybeSingle();
  const displayName =
    profile?.name ||
    (typeof user.user_metadata?.name === "string" ? user.user_metadata.name : "") ||
    user.email?.split("@")[0] ||
    "Pengguna";

  const hasTransactions = (data?.recentTransactions.length ?? 0) > 0;

  const weeklyDates = new Map(data?.weeklyExpenses.map((d) => [d.date, d.total] as const) ?? []);
  const weeklyChartData = week.days.map((date) => ({
    date,
    total: weeklyDates.get(date) ?? 0,
  }));
  const weeklyTotal = weeklyChartData.reduce((sum, d) => sum + d.total, 0);

  const summary = data?.summary ?? {
    currentBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    weeklyExpense: 0,
  };

  return (
    <AppShell>
      {!hasTransactions ? (
        <InitialBalanceOnboarding />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Halo, {displayName}
              </h1>
              <p className="text-sm text-muted">Ringkasan keuangan pribadimu.</p>
            </div>
            <MobileActions />
          </div>

          <BalanceCard
            balance={summary.currentBalance}
            income={summary.totalIncome}
            expense={summary.totalExpense}
            negative={summary.currentBalance < 0}
          />

          <SummaryGrid>
            <SummaryCard
              label="Uang Masuk"
              value={summary.totalIncome}
              accent="text-primary"
              icon={<ArrowUpRight className="h-4 w-4" />}
            />
            <SummaryCard
              label="Total Pengeluaran"
              value={summary.totalExpense}
              accent="text-danger"
              icon={<ArrowDownRight className="h-4 w-4" />}
            />
            <SummaryCard
              label="Pengeluaran Minggu Ini"
              value={summary.weeklyExpense}
              accent="text-ink"
            />
          </SummaryGrid>

          <WeeklyChartCard
            startLabel={weekLabel(week)}
            prevHref={weekHref(addWeeks(week, -1).start)}
            nextHref={weekHref(addWeeks(week, 1).start)}
            todayHref="/dashboard"
            data={weeklyChartData}
            weeklyTotal={weeklyTotal}
          />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Transaksi Terbaru</h2>
              <Link
                href="/transactions"
                className="text-sm font-medium text-primary hover:underline"
              >
                Lihat Semua
              </Link>
            </div>
            <RecentTransactions transactions={data?.recentTransactions ?? []} />
          </div>
        </div>
      )}
    </AppShell>
  );
}