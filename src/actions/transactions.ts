"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  expenseSchema,
  incomeSchema,
  updateTransactionSchema,
} from "@/lib/validations/transaction";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/actions/types";
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

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return { supabase, user };
}

export async function createIncomeAction(input: {
  name?: string;
  amount: number;
  transactionDate: string;
}): Promise<ActionResult<Transaction>> {
  const validated = incomeSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, message: "Data transaksi tidak valid." };
  }

  try {
    const { supabase, user } = await requireUser();
    const name = validated.data.name.trim() || "Uang Masuk";

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "income",
        name,
        amount: validated.data.amount,
        transaction_date: validated.data.transactionDate,
      })
      .select(
        "id, type, name, amount, transaction_date, created_at, updated_at"
      )
      .single();

    if (error) throw error;

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: true, data: mapRow(data) };
  } catch (err) {
    return toActionError(err);
  }
}

export async function createExpenseAction(input: {
  name: string;
  amount: number;
  transactionDate: string;
}): Promise<ActionResult<Transaction>> {
  const validated = expenseSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, message: "Data transaksi tidak valid." };
  }

  try {
    const { supabase } = await requireUser();

    const { data, error } = await supabase.rpc("create_expense", {
      p_name: validated.data.name,
      p_amount: validated.data.amount,
      p_transaction_date: validated.data.transactionDate,
    });

    if (error) throw error;

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: true, data: mapRow(data) };
  } catch (err) {
    return toActionError(err);
  }
}

export async function updateTransactionAction(input: {
  id: string;
  name: string;
  amount: number;
  transactionDate: string;
}): Promise<ActionResult<Transaction>> {
  const validated = updateTransactionSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, message: "Data transaksi tidak valid." };
  }

  try {
    const { supabase } = await requireUser();

    const { data, error } = await supabase.rpc("update_transaction", {
      p_id: validated.data.id,
      p_name: validated.data.name,
      p_amount: validated.data.amount,
      p_transaction_date: validated.data.transactionDate,
    });

    if (error) throw error;

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: true, data: mapRow(data) };
  } catch (err) {
    return toActionError(err);
  }
}

export async function deleteTransactionAction(
  id: string
): Promise<ActionResult> {
  const parsedId = z.string().uuid("ID transaksi tidak valid").safeParse(id);
  if (!parsedId.success) {
    return { success: false, message: "ID transaksi tidak valid." };
  }

  try {
    const { supabase } = await requireUser();

    const { error } = await supabase.rpc("delete_transaction", {
      p_id: parsedId.data,
    });

    if (error) throw error;

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: true };
  } catch (err) {
    return toActionError(err);
  }
}