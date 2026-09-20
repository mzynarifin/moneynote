"use client";

import { useState } from "react";
import { ChevronRight, FileDown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const PERIODS = [
  { value: "month", label: "Bulan Ini", description: "Seluruh transaksi pada bulan berjalan." },
  { value: "all", label: "Semua Riwayat", description: "Seluruh transaksi sejak awal pencatatan." },
] as const;

type Period = (typeof PERIODS)[number]["value"];

export function ExportReportDialog() {
  const [open, setOpen] = useState(false);

  function openReport(period: Period) {
    setOpen(false);
    window.open(`/laporan?periode=${period}`, "_blank", "noopener");
  }

  return (
    <>
      <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <FileDown className="h-4 w-4" />
        Export PDF
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Export Laporan PDF"
        description="Pilih periode laporan yang ingin dicetak."
      >
        <div className="grid gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => openReport(p.value)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary-soft"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{p.label}</p>
                <p className="text-xs text-muted">{p.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted" />
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}