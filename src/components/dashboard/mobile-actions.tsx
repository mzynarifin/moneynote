"use client";

import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUi } from "@/store/ui-context";

export function MobileActions() {
  const { setOpen } = useUi();
  return (
    <div className="flex shrink-0 gap-2 sm:hidden">
      <Button variant="secondary" size="sm" onClick={() => setOpen("income")}>
        <ArrowUpRight className="h-4 w-4" />
        Tambah Uang
      </Button>
      <Button size="sm" onClick={() => setOpen("expense")}>
        <ArrowDownRight className="h-4 w-4" />
        Catat
      </Button>
    </div>
  );
}

export function EmptyWeeklyAction() {
  const { setOpen } = useUi();
  return (
    <Button size="sm" onClick={() => setOpen("expense")}>
      <Plus className="h-4 w-4" />
      Catat Pengeluaran
    </Button>
  );
}