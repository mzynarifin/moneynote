"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { signInAction } from "@/actions/auth";

type ActionState = Awaited<ReturnType<typeof signInAction>>;

const initialState: ActionState = { success: true };

async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  return signInAction({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <Wallet className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-ink">DompetKu</h1>
          <p className="text-sm text-muted">Catatan keuangan pribadi, tetap sederhana.</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">Masuk ke akun</h2>
          <p className="mt-0.5 text-sm text-muted">Gunakan akunmu untuk melanjutkan.</p>

          <form action={formAction} noValidate className="mt-6 space-y-4">
            <Field
              id="login-email"
              name="email"
              label="Email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              required
            />
            <Field
              id="login-password"
              name="password"
              label="Password"
              type="password"
              placeholder="Minimal 6 karakter"
              autoComplete="current-password"
              required
              minLength={6}
            />
            {state.success === false && state.message ? (
              <p className="text-sm text-danger">{state.message}</p>
            ) : null}
            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Memproses…" : "Masuk"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}