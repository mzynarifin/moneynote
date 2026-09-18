import type { FilterType } from "@/lib/types";

export function buildTransactionsHref(values: {
  type?: FilterType;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
}): string {
  const params = new URLSearchParams();
  if (values.type && values.type !== "all") params.set("type", values.type);
  if (values.search) params.set("search", values.search);
  if (values.startDate) params.set("from", values.startDate);
  if (values.endDate) params.set("to", values.endDate);
  if (values.page && values.page > 1) params.set("page", String(values.page));
  const qs = params.toString();
  return qs ? `/transactions?${qs}` : "/transactions";
}