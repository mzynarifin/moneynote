"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatLongDate, formatWeekdayLong, formatWeekdayShort } from "@/lib/format";

interface WeeklyChartProps {
  data: { date: string; total: number }[];
}

export function WeeklyExpenseChart({ data }: WeeklyChartProps) {
  return (
    <div className="h-48 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={formatWeekdayShort}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "var(--color-primary-soft)" }}
            formatter={(value) => [formatCurrency(Number(value)), "Pengeluaran"]}
            labelFormatter={(label) =>
              `${formatWeekdayLong(String(label))}, ${formatLongDate(String(label))}`
            }
            contentStyle={{
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="total" fill="#16a34a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
);
}
