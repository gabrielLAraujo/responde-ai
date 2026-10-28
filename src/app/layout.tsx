import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RespondeAí — respostas para avaliações do Google com IA",
  description:
    "Responda todas as avaliações do Google do seu negócio em segundos, com respostas personalizadas geradas por IA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 dark:border-white/10">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold">
              Responde<span className="text-emerald-600">Aí</span>
            </Link>
            <Link
              href="/gerar"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Testar grátis
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 py-6 text-center text-sm text-black/50 dark:border-white/10 dark:text-white/50">
          © {new Date().getFullYear()} RespondeAí
        </footer>
      </body>
    </html>
  );
}
