import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Transaction, TransactionFilters, TransactionListResponse } from "@/lib/types";

const PAGE_SIZE = 20;

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

export const getTransactionsPage = cache(
  async (filters: TransactionFilters): Promise<TransactionListResponse> => {
    const supabase = await createClient();

    const search = filters.search.trim();
    let query = supabase.from("transactions").select(
      "id, type, name, amount, transaction_date, created_at, updated_at",
      { count: "exact" }
    );

    if (search) {
      const escaped = search.replace(/%/g, "\\%").replace(/_/g, "\\_");
      query = query.ilike("name", `%${escaped}%`);
    }
    if (filters.type !== "all") query = query.eq("type", filters.type);
    if (filters.startDate) query = query.gte("transaction_date", filters.startDate);
    if (filters.endDate) query = query.lte("transaction_date", filters.endDate);

    query = query
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false });

    const from = (filters.page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count, error } = await query.range(from, to);

    if (error || !data) {
      return {
        data: [],
        pagination: { page: filters.page, pageSize: PAGE_SIZE, total: 0, totalPages: 0 },
      };
    }

    const total = count ?? data.length;
    return {
      data: data.map(mapRow),
      pagination: {
        page: filters.page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      },
    };
  }
);

export const getTransactionCount = cache(async (): Promise<number> => {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true });
  return error ? 0 : (count ?? 0);
});