"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { UiProvider } from "@/store/ui-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <UiProvider>{children}</UiProvider>
    </ToastProvider>
  );
}
