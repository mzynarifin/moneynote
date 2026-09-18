"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/actions/auth";

type ActionState = Awaited<ReturnType<typeof signUpAction>>;

const initialState: ActionState = { success: true };

async function registerAction(prev: ActionState, formData: FormData): Promise<ActionState> {
  return signUpAction({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  const fieldErrors =
    state.success === false ? state.fieldErrors ?? {} : {};

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <Wallet className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-ink">DompetKu</h1>
          <p className="text-sm text-muted">Mulai catat keuanganmu hari ini.</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">Buat akun</h2>
          <p className="mt-0.5 text-sm text-muted">Daftar untuk mulai mencatat.</p>

          {state.success && state.data?.requiresEmailConfirmation ? (
            <div className="mt-6 rounded-lg border border-border bg-background p-4 text-sm text-ink">
              Pendaftaran berhasil. Silakan cek emailmu untuk verifikasi, lalu{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                masuk
              </Link>
              .
            </div>
          ) : (
            <form action={formAction} noValidate className="mt-6 space-y-4">
              <Field
                id="register-name"
                name="name"
                label="Nama"
                placeholder="Nama lengkap"
                autoComplete="name"
                required
                error={fieldErrors.name?.[0]}
              />
              <Field
                id="register-email"
                name="email"
                label="Email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                required
                error={fieldErrors.email?.[0]}
              />
              <Field
                id="register-password"
                name="password"
                label="Password"
                type="password"
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
                required
                minLength={6}
                error={fieldErrors.password?.[0]}
              />
              <Field
                id="register-confirm"
                name="confirmPassword"
                label="Konfirmasi Password"
                type="password"
                placeholder="Ulangi password"
                autoComplete="new-password"
                required
                error={fieldErrors.confirmPassword?.[0]}
              />
              {state.success === false && state.message && !state.fieldErrors ? (
                <p className="text-sm text-danger">{state.message}</p>
              ) : null}
              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? "Mendaftar…" : "Buat Akun"}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}