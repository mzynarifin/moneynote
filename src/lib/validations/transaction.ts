import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid");

const baseTransaction = {
  amount: z.number().positive("Jumlah harus lebih dari 0").max(999_999_999_999),
  transactionDate: dateString,
};

export const incomeSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  ...baseTransaction,
});

export const expenseSchema = z.object({
  name: z.string().trim().min(1, "Nama pengeluaran wajib diisi").max(100),
  ...baseTransaction,
});

export const updateTransactionSchema = z.object({
  id: z.string().uuid("ID transaksi tidak valid"),
  name: z.string().trim().min(1).max(100),
  ...baseTransaction,
});

export type IncomeFormValues = z.infer<typeof incomeSchema>;
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
export type UpdateTransactionFormValues = z.infer<typeof updateTransactionSchema>;