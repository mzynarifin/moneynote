"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ManagementDialogs } from "@/components/dialogs/management-dialogs";

export type DialogKind = "income" | "expense";

export interface UiContextValue {
  open: DialogKind | null;
  setOpen: (kind: DialogKind | null) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<DialogKind | null>(null);

  const value = useMemo<UiContextValue>(() => ({ open, setOpen }), [open]);

  return (
    <UiContext.Provider value={value}>
      {children}
      <ManagementDialogs open={open} onClose={() => setOpen(null)} />
    </UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) {
    throw new Error("useUi harus dipakai di dalam <UiProvider>");
  }
  return ctx;
}