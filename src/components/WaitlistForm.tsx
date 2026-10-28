"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    const res = await fetch("/api/lista-espera", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), businessType: form.get("businessType") }),
    }).catch(() => null);
    if (res?.ok) {
      setStatus("done");
    } else {
      setError((await res?.json().catch(() => null))?.error ?? "Erro de conexão. Tente novamente.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-lg bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
        Pronto! Você está na lista. Avisaremos assim que a conexão automática com o Google estiver liberada.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        name="email"
        type="email"
        required
        placeholder="seu@email.com"
        className="flex-1 rounded-lg border border-black/20 bg-transparent px-4 py-3 dark:border-white/20"
      />
      <input
        name="businessType"
        placeholder="Tipo de negócio (ex.: restaurante)"
        className="flex-1 rounded-lg border border-black/20 bg-transparent px-4 py-3 dark:border-white/20"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Quero acesso"}
      </button>
      {status === "error" && <p className="text-sm text-red-600 sm:basis-full">{error}</p>}
    </form>
  );
}
