"use client";

import { useState, useTransition } from "react";
import { Wallet } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { MoneyInput } from "@/components/forms/money-input";
import { useToast } from "@/components/ui/toast";
import { createIncomeAction } from "@/actions/transactions";
import { todayISO } from "@/lib/format";

export function InitialBalanceOnboarding() {
  const { show } = useToast();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(todayISO());
  const [amountError, setAmountError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setAmountError("Jumlah harus lebih dari 0.");
      return;
    }
    startTransition(async () => {
      const result = await createIncomeAction({
        name: "Saldo Awal",
        amount,
        transactionDate: date,
      });
      if (!result.success) {
        setAmountError(result.message);
        return;
      }
      show("success", "Saldo awal berhasil disimpan.");
    });
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <Wallet className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Mulai catat keuanganmu
            </h1>
            <p className="text-sm text-muted">
              Masukkan jumlah uang yang kamu miliki saat ini.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <MoneyInput
              id="initial-balance"
              label="Saldo Awal"
              value={amount}
              onChange={setAmount}
              error={amountError}
            />
            <Field
              id="initial-balance-date"
              label="Tanggal"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Menyimpan…" : "Simpan Saldo Awal"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}