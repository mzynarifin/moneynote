"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUi } from "@/store/ui-context";

export default function AppShell({ children }: { children: ReactNode }) {
  const { setOpen } = useUi();
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Wallet className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">DompetKu</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
            <NavLink href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </NavLink>
            <NavLink href="/transactions" active={pathname === "/transactions"}>
              Riwayat
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button variant="secondary" size="sm" onClick={() => setOpen("income")}>
                <ArrowUpRight className="h-4 w-4" />
                Tambah Uang
              </Button>
            </div>
            <Button variant="primary" size="sm" onClick={() => setOpen("expense")}>
              <ArrowDownRight className="h-4 w-4" />
              <span className="sm:hidden">Catat</span>
              <span className="hidden sm:inline">Catat Pengeluaran</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
        (active
          ? "bg-primary-soft text-primary"
          : "text-muted hover:bg-background hover:text-ink")
      }
    >
      {children}
    </Link>
  );
}