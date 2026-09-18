import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { DashboardData, Transaction } from "@/lib/types";

function mapRow(row: {
  id: string;
  type: string;
  name: string;
  amount: number | string;
  transaction_date: string;
  created_at: string;
  updated_at: string | null;
}): Transaction {
  return {
    id: row.id,
    type: row.type === "income" ? "income" : "expense",
    name: row.name,
    amount: Number(row.amount),
    transactionDate: row.transaction_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const getDashboardData = cache(
  async (weekStart: string, weekEnd: string): Promise<DashboardData | null> => {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const [all, recentResult, weeklyResult] = await Promise.all([
      supabase
        .from("transactions")
        .select("type, amount, transaction_date"),
      supabase
        .from("transactions")
        .select(
          "id, type, name, amount, transaction_date, created_at, updated_at"
        )
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("transactions")
        .select("amount, transaction_date")
        .eq("type", "expense")
        .gte("transaction_date", weekStart)
        .lte("transaction_date", weekEnd),
    ]);

    if (all.error || !all.data) return null;

    let totalIncome = 0;
    let totalExpense = 0;
    for (const row of all.data) {
      const amount = Number(row.amount);
      if (row.type === "income") totalIncome += amount;
      else totalExpense += amount;
    }

    let weeklyExpense = 0;
    const weeklyMap = new Map<string, number>();
    for (const row of weeklyResult.data ?? []) {
      const amount = Number(row.amount);
      weeklyExpense += amount;
      weeklyMap.set(
        row.transaction_date,
        (weeklyMap.get(row.transaction_date) ?? 0) + amount
      );
    }
    const weeklyExpenses: { date: string; total: number }[] = Array.from(
      weeklyMap,
      ([date, total]) => ({ date, total })
    ).sort((a, b) => a.date.localeCompare(b.date));

    return {
      summary: {
        currentBalance: totalIncome - totalExpense,
        totalIncome,
        totalExpense,
        weeklyExpense,
      },
      recentTransactions: (recentResult.data ?? []).slice(0, 6).map(mapRow),
      weeklyExpenses,
    };
  }
);