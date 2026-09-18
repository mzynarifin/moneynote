"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { MoneyInput } from "@/components/forms/money-input";
import { useToast } from "@/components/ui/toast";
import {
  createExpenseAction,
  createIncomeAction,
  updateTransactionAction,
} from "@/actions/transactions";
import { todayISO } from "@/lib/format";
import type { Transaction, TransactionType } from "@/lib/types";

interface TransactionFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: TransactionType;
  editing?: Transaction | null;
}

export function TransactionFormDialog({
  open,
  onClose,
  mode,
  editing,
}: TransactionFormDialogProps) {
  const { show } = useToast();
  const [isPending, startTransition] = useTransition();

  const isExpense = mode === "expense";
  const nameLabel = isExpense ? "Nama Pengeluaran" : "Keterangan";

  const [name, setName] = useState(editing?.name ?? "");
  const [amount, setAmount] = useState(editing?.amount ?? 0);
  const [date, setDate] = useState(editing?.transactionDate ?? todayISO());
  const [error, setError] = useState<{ name?: string; amount?: string }>({});
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setName(editing?.name ?? "");
      setAmount(editing?.amount ?? 0);
      setDate(editing?.transactionDate ?? todayISO());
      setError({});
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextError: { name?: string; amount?: string } = {};
    if (isExpense && !name.trim()) {
      nextError.name = "Nama pengeluaran wajib diisi.";
    }
    if (!amount || amount <= 0) {
      nextError.amount = "Jumlah harus lebih dari 0.";
    }
    if (!date) {
      nextError.name = nextError.name ?? "Tanggal wajib diisi.";
    }
    if (Object.values(nextError).some(Boolean)) {
      setError(nextError);
      return;
    }

    startTransition(async () => {
      if (editing) {
        const result = await updateTransactionAction({
          id: editing.id,
          name: name.trim(),
          amount,
          transactionDate: date,
        });
        if (!result.success) {
          setError({ amount: result.message });
          return;
        }
        show("success", "Transaksi berhasil diperbarui.");
      } else if (isExpense) {
        const result = await createExpenseAction({
          name: name.trim(),
          amount,
          transactionDate: date,
        });
        if (!result.success) {
          setError({ amount: result.message });
          return;
        }
        show("success", "Pengeluaran berhasil dicatat.");
      } else {
        const result = await createIncomeAction({
          name: name.trim(),
          amount,
          transactionDate: date,
        });
        if (!result.success) {
          setError({ amount: result.message });
          return;
        }
        show("success", "Uang berhasil ditambahkan.");
      }
      onClose();
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Transaksi" : isExpense ? "Catat Pengeluaran" : "Tambah Uang"}
      description={
        editing
          ? "Ubah detail transaksi berikut."
          : isExpense
            ? "Catat pengeluaran dan kurangi saldo otomatis."
            : "Tambahkan uang masuk ke saldo."
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <Field
            id="tx-name"
            label={nameLabel}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isExpense ? "Contoh: Makan Siang" : "Contoh: Uang tambahan"}
            error={error.name}
            autoComplete="off"
          />

          <MoneyInput
            id="tx-amount"
            label={isExpense ? "Jumlah Pengeluaran" : "Jumlah Uang"}
            value={amount}
            onChange={setAmount}
            error={error.amount}
          />

          <Field
            id="tx-date"
            label="Tanggal"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Menyimpan…"
              : editing
                ? "Simpan Perubahan"
                : isExpense
                  ? "Simpan Pengeluaran"
                  : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}