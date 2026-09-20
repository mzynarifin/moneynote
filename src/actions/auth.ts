"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/actions/types";

export async function signInAction(input: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  const validated = loginSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, message: "Email atau password tidak valid." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { success: false, message: "Email atau password tidak valid." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signUpAction(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult<{ requiresEmailConfirmation: boolean }>> {
  const validated = registerSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Data pendaftaran tidak valid.",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: { name: validated.data.name },
    },
  });

  if (error) {
    return toActionError(error);
  }

  // Auto sign-in when email confirmation is disabled.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return { success: true, data: { requiresEmailConfirmation: true } };
}

export async function signOutAction(): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, message: "Terjadi kesalahan saat keluar. Silakan coba lagi." };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}