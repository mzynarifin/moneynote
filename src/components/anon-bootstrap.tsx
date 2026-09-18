"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signInAnonAction } from "@/actions/auth";

export function AnonBootstrap() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) return;
        const result = await signInAnonAction();
        if (!cancelled && result.success) router.refresh();
      } catch (err) {
        console.error("Anonymous sign-in gagal:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}