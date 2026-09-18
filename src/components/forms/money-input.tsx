"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";

interface MoneyInputProps {
  id: string;
  label: string;
  error?: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}

function cleanNumberString(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

function formatText(value: number): string {
  return value > 0 ? formatNumber(value) : "";
}

export function MoneyInput({
  id,
  label,
  error,
  value,
  onChange,
  hint,
}: MoneyInputProps) {
  const [text, setText] = useState(() => formatText(value));
  const [prevValue, setPrevValue] = useState(value);

  if (prevValue !== value) {
    setPrevValue(value);
    setText(formatText(value));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = cleanNumberString(e.target.value);
    const next = cleaned ? parseInt(cleaned, 10) : 0;
    setText(next > 0 ? formatNumber(next) : "");
    onChange(next);
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          Rp
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={text}
          onChange={handleChange}
          placeholder="0"
          aria-invalid={Boolean(error)}
          className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
      </div>
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
      {error ? <p className="mt-1.5 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
