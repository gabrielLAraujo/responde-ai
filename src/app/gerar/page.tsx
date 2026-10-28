import type { Metadata } from "next";
import Link from "next/link";
import { ReplyGenerator } from "@/components/ReplyGenerator";

export const metadata: Metadata = {
  title: "Gerar resposta — RespondeAí",
};

export default function GerarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Gerar resposta para avaliação</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">
        Cole a avaliação do Google e receba 3 opções de resposta prontas para publicar.{" "}
        <Link href="/entrar" className="text-emerald-700 underline dark:text-emerald-400">
          Crie sua conta
        </Link>{" "}
        para salvar o tom e o contato de cada negócio.
      </p>
      <ReplyGenerator />
    </div>
  );
}
