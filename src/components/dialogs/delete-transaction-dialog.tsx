"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { deleteTransactionAction } from "@/actions/transactions";
import type { Transaction } from "@/lib/types";

interface DeleteTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function DeleteTransactionDialog({
  open,
  onClose,
  transaction,
}: DeleteTransactionDialogProps) {
  const { show } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!transaction) return;
    startTransition(async () => {
      const result = await deleteTransactionAction(transaction.id);
      if (!result.success) {
        setError(result.message);
        return;
      }
      show("success", "Transaksi berhasil dihapus.");
      onClose();
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hapus transaksi?"
      description="Transaksi ini akan dihapus dari riwayat."
    >
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
          Batal
        </Button>
        <Button type="button" variant="danger" onClick={handleDelete} disabled={isPending}>
          {isPending ? "Menghapus…" : "Hapus"}
        </Button>
      </div>
    </Modal>
  );
}