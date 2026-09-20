"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TransactionFormDialog } from "@/components/dialogs/transaction-form-dialog";
import { DeleteTransactionDialog } from "@/components/dialogs/delete-transaction-dialog";
import { ExportReportDialog } from "@/components/transactions/export-report-dialog";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { buildTransactionsHref } from "@/lib/query-params";
import type { FilterType, Transaction, TransactionListResponse } from "@/lib/types";

interface TransactionsClientProps {
  initial: TransactionListResponse;
  initialParams: {
    type: FilterType;
    search: string;
    startDate: string;
    endDate: string;
    page: number;
  };
}

export function TransactionsClient({ initial, initialParams }: TransactionsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initialParams.search);
  const [type, setType] = useState(initialParams.type);
  const [from, setFrom] = useState(initialParams.startDate);
  const [to, setTo] = useState(initialParams.endDate);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [prevParams, setPrevParams] = useState(initialParams);

  if (prevParams !== initialParams) {
    setPrevParams(initialParams);
    setQ(initialParams.search);
    setType(initialParams.type);
    setFrom(initialParams.startDate);
    setTo(initialParams.endDate);
  }

  const push = useCallback(
    (params: { type?: FilterType; search?: string; startDate?: string; endDate?: string; page?: number }) => {
      startTransition(() => {
        router.push(
          buildTransactionsHref({
            search: params.search ?? q,
            type: params.type ?? type,
            startDate: params.startDate ?? from,
            endDate: params.endDate ?? to,
            page: params.page,
          })
        );
      });
    },
    [router, q, type, from, to]
  );

  useEffect(() => {
    if (q === initialParams.search) return;
    const id = setTimeout(() => {
      push({ page: 1 });
    }, 350);
    return () => clearTimeout(id);
  }, [q, initialParams.search, push]);

  const { data, pagination } = initial;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Riwayat Transaksi
          </h1>
          <p className="text-sm text-muted">Lihat seluruh uang masuk dan pengeluaranmu.</p>
        </div>
        <ExportReportDialog />
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Field
            id="transaction-search"
            aria-label="Cari transaksi"
            className="pl-9"
            placeholder="Cari transaksi..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            id="filter-type"
            label="Jenis"
            aria-label="Filter jenis transaksi"
            value={type}
            onChange={(e) => {
              const next = e.target.value as FilterType;
              setType(next);
              push({ type: next, page: 1 });
            }}
            options={[
              { value: "all", label: "Semua" },
              { value: "income", label: "Uang Masuk" },
              { value: "expense", label: "Pengeluaran" },
            ]}
          />
          <Field
            id="filter-from"
            label="Dari Tanggal"
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              push({ startDate: e.target.value, page: 1 });
            }}
          />
          <Field
            id="filter-to"
            label="Sampai Tanggal"
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              push({ endDate: e.target.value, page: 1 });
            }}
          />
        </div>
      </div>

      {isPending ? (
        <div className="flex min-h-[200px] items-center justify-center text-sm text-muted">Memuat…</div>
      ) : pagination.total === 0 ? (
        initialParams.type === "all" && !initialParams.search && !initialParams.startDate && !initialParams.endDate ? (
          <EmptyState
            title="Belum ada transaksi"
            description="Catat uang masuk atau pengeluaran pertama kamu."
          />
        ) : (
          <EmptyState
            title="Transaksi tidak ditemukan"
            description="Coba gunakan kata pencarian atau filter yang berbeda."
          />
        )
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Jenis</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 text-right font-medium">Nominal</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((t) => (
                  <tr key={t.id} className="hover:bg-background">
                    <td className="px-4 py-3 font-medium text-ink">{t.name}</td>
                    <td className="px-4 py-3">
                      <TypeBadge type={t.type} />
                    </td>
                    <td className="px-4 py-3 text-muted">{formatShortDate(t.transactionDate)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      <span className={t.type === "income" ? "text-primary" : "text-danger"}>
                        {t.type === "income" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RowActions onEdit={() => setEditing(t)} onDelete={() => setDeleting(t)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-border rounded-xl border border-border bg-surface md:hidden">
            {data.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
                    (t.type === "income" ? "bg-primary-soft text-primary" : "bg-danger-soft text-danger")
                  }
                >
                  {t.type === "income" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-muted">{formatShortDate(t.transactionDate)}</p>
                </div>
                <p className={"text-sm font-semibold " + (t.type === "income" ? "text-primary" : "text-danger")}>
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </p>
                <RowActions onEdit={() => setEditing(t)} onDelete={() => setDeleting(t)} />
              </li>
            ))}
          </ul>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => push({ page: p })}
          />
        </>
      )}

      <TransactionFormDialog open={Boolean(editing)} onClose={() => setEditing(null)} mode={editing?.type ?? "expense"} editing={editing} />
      <DeleteTransactionDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} transaction={deleting} />
    </div>
  );
}

function TypeBadge({ type }: { type: "income" | "expense" }) {
  const isIncome = type === "income";
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium " +
        (isIncome ? "bg-primary-soft text-primary" : "bg-danger-soft text-danger")
      }
    >
      {isIncome ? "Uang Masuk" : "Pengeluaran"}
    </span>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex justify-end">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 cursor-default"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <Button
        variant="ghost"
        size="sm"
        aria-label="Aksi transaksi"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-40"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open ? (
        <div className="absolute right-0 top-full z-40 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-white shadow-sm">
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-background"
          >
            <Pencil className="h-4 w-4 text-muted" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onDelete(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-danger-soft"
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted">
        Halaman {page} dari {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Berikutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}