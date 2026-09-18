import AppShell from "@/components/layout/app-shell";
import { TransactionsClient } from "@/components/transactions/transactions-client";
import { getTransactionsPage } from "@/lib/queries/transactions";
import type { TransactionFilters } from "@/lib/types";

function asString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] : (value ?? "");
}

function asPage(value: string | string[] | undefined): number {
  const parsed = Number(asString(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parseFilters(sp: Record<string, string | string[] | undefined>): TransactionFilters {
  const type = asString(sp.type);
  const page = asPage(sp.page);
  return {
    type: type === "income" || type === "expense" ? type : "all",
    search: asString(sp.search).slice(0, 100),
    startDate: /^\d{4}-\d{2}-\d{2}$/.test(asString(sp.from)) ? asString(sp.from) : "",
    endDate: /^\d{4}-\d{2}-\d{2}$/.test(asString(sp.to)) ? asString(sp.to) : "",
    page,
  };
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const data = await getTransactionsPage(filters);

  return (
    <AppShell>
      <TransactionsClient initial={data} initialParams={filters} />
    </AppShell>
  );
}