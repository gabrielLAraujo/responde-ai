import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/SignInButton";
import { getSession, isGoogleConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "Entrar — RespondeAí" };

export default async function EntrarPage() {
  if (await getSession()) redirect("/painel");

  return (
    <div className="mx-auto max-w-sm px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Entrar</h1>
      <p className="mt-2 mb-8 text-black/60 dark:text-white/60">
        Salve as configurações dos seus negócios e gere respostas sem preencher tudo de novo.
      </p>
      {isGoogleConfigured ? (
        <SignInButton />
      ) : (
        <p className="rounded-lg bg-amber-50 p-4 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Login ainda não configurado.
        </p>
      )}
    </div>
  );
}
