import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PrintReportButton } from "@/components/laporan/print-button";
import { formatCurrency, formatLongDate, toISO } from "@/lib/format";
import type { Transaction } from "@/lib/types";

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

function currentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toISO(start), end: toISO(end) };
}

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>;
}) {
  const sp = await searchParams;
  const periode = sp.periode === "month" ? "month" : "all";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("transactions")
    .select("id, name, type, amount, transaction_date, created_at, updated_at")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  let periodLabel = "Semua Riwayat";
  let rangeLabel = "Seluruh transaksi sejak awal.";
  if (periode === "month") {
    const { start, end } = currentMonthRange();
    query = query.gte("transaction_date", start).lte("transaction_date", end);
    periodLabel = "Bulan Ini";
    rangeLabel = "Transaksi pada bulan berjalan.";
  }

  const { data, error } = await query;
  const transactions = (error ? [] : data ?? []).map(mapRow);

  let totalIncome = 0;
  let totalExpense = 0;
  for (const t of transactions) {
    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;
  }
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-dvh bg-background px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
          <Link href="/transactions" className="text-sm font-medium text-primary hover:underline">
            ← Kembali
          </Link>
          <PrintReportButton />
        </div>

        <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
          <div className="border-b border-border pb-4">
            <p className="text-sm font-medium text-primary">DompetKu</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-ink">
              Laporan Keuangan — {periodLabel}
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              {rangeLabel} Dicetak {formatLongDate(toISO(new Date()))}.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-primary-soft p-3">
              <p className="text-xs text-muted">Uang Masuk</p>
              <p className="mt-1 text-sm font-bold text-primary sm:text-base">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="rounded-lg bg-danger-soft p-3">
              <p className="text-xs text-muted">Pengeluaran</p>
              <p className="mt-1 text-sm font-bold text-danger sm:text-base">
                {formatCurrency(totalExpense)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">Saldo</p>
              <p className="mt-1 text-sm font-bold text-ink sm:text-base">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-3 py-2 font-medium">Tanggal</th>
                  <th className="px-3 py-2 font-medium">Keterangan</th>
                  <th className="px-3 py-2 font-medium">Jenis</th>
                  <th className="px-3 py-2 text-right font-medium">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t) => (
                  <tr key={t.id} className="break-inside-avoid">
                    <td className="px-3 py-2 text-muted">{formatLongDate(t.transactionDate)}</td>
                    <td className="px-3 py-2 font-medium text-ink">{t.name}</td>
                    <td className="px-3 py-2 text-muted">
                      {t.type === "income" ? "Uang Masuk" : "Pengeluaran"}
                    </td>
                    <td
                      className={
                        "px-3 py-2 text-right font-semibold " +
                        (t.type === "income" ? "text-primary" : "text-danger")
                      }
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-muted">
                      Tidak ada transaksi pada periode ini.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}