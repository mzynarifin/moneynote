import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DompetKu — Catatan Keuangan Pribadi",
  description: "Mencatat uang masuk, pengeluaran, dan saldo pribadi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} bg-background text-ink antialiased font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
