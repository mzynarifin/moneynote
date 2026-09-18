export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_INPUT"
  | "INSUFFICIENT_BALANCE"
  | "TRANSACTION_NOT_FOUND"
  | "FORBIDDEN"
  | "DELETE_CAUSES_NEGATIVE_BALANCE"
  | "UPDATE_CAUSES_NEGATIVE_BALANCE"
  | "DATABASE_ERROR";

export const ERROR_MESSAGES: Record<AppErrorCode, string> = {
  UNAUTHENTICATED: "Silakan login kembali.",
  INVALID_INPUT: "Data yang dikirim tidak valid.",
  INSUFFICIENT_BALANCE: "Saldo tidak mencukupi untuk pengeluaran ini.",
  TRANSACTION_NOT_FOUND: "Transaksi tidak ditemukan.",
  FORBIDDEN: "Anda tidak dapat mengakses data ini.",
  DELETE_CAUSES_NEGATIVE_BALANCE: "Saldo tidak boleh negatif.",
  UPDATE_CAUSES_NEGATIVE_BALANCE: "Saldo tidak boleh negatif.",
  DATABASE_ERROR: "Terjadi kesalahan. Silakan coba lagi.",
};

/** Extract our controlled error code from an unknown error (RPC exception, DB error, ...). */
export function extractErrorCode(err: unknown): AppErrorCode {
  const raw = err instanceof Object ? (err as Record<string, unknown>) : {};
  const message =
    typeof raw.message === "string"
      ? raw.message
      : typeof raw.error === "string"
        ? raw.error
        : "";

  for (const code of Object.keys(ERROR_MESSAGES) as AppErrorCode[]) {
    if (message.includes(code)) return code;
  }

  if (typeof raw.code === "string" && raw.code.startsWith("P0")) {
    return "DATABASE_ERROR";
  }

  return "DATABASE_ERROR";
}

export function toActionError(err: unknown): {
  success: false;
  code: AppErrorCode;
  message: string;
} {
  const code = extractErrorCode(err);
  return { success: false, code, message: ERROR_MESSAGES[code] };
}