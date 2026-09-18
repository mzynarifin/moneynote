"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted">
        Belum ada transaksi.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
      {transactions.map((t) => {
        const isIncome = t.type === "income";
        return (
          <li
            key={t.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span
              className={
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
                (isIncome ? "bg-primary-soft text-primary" : "bg-danger-soft text-danger")
              }
            >
              {isIncome ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{t.name}</p>
              <p className="text-xs text-muted">{formatShortDate(t.transactionDate)}</p>
            </div>
            <p
              className={
                "text-sm font-semibold " + (isIncome ? "text-primary" : "text-danger")
              }
            >
              {isIncome ? "+" : "-"}
              {formatCurrency(t.amount)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}