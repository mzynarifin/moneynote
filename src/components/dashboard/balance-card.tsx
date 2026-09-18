"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
  negative?: boolean;
}

export function BalanceCard({ balance, income, expense, negative }: BalanceCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-primary p-5 text-white shadow-sm sm:p-6",
        negative && "bg-danger"
      )}
    >
      <p className="text-sm font-medium text-white/80">Saldo Saat Ini</p>
      <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
        {formatCurrency(balance)}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-4">
        <div>
          <p className="text-xs text-white/70">Uang Masuk</p>
          <p className="mt-0.5 text-sm font-semibold">+{formatCurrency(income)}</p>
        </div>
        <div>
          <p className="text-xs text-white/70">Uang Keluar</p>
          <p className="mt-0.5 text-sm font-semibold">-{formatCurrency(expense)}</p>
        </div>
      </div>
    </div>
  );
}
