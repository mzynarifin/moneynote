"use client";

import { TransactionFormDialog } from "@/components/dialogs/transaction-form-dialog";

interface ManagementDialogsProps {
  open: "income" | "expense" | null;
  onClose: () => void;
}

export function ManagementDialogs({ open, onClose }: ManagementDialogsProps) {
  return (
    <>
      <TransactionFormDialog open={open === "income"} onClose={onClose} mode="income" />
      <TransactionFormDialog open={open === "expense"} onClose={onClose} mode="expense" />
    </>
  );
}