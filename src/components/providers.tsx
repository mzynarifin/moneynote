"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { UiProvider } from "@/store/ui-context";
import { AnonBootstrap } from "@/components/anon-bootstrap";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <UiProvider>
        <AnonBootstrap />
        {children}
      </UiProvider>
    </ToastProvider>
  );
}
