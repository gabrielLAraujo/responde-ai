"use client";

import { useState } from "react";

const inputClass = "w-full rounded-lg border border-black/20 bg-transparent px-3 py-2 dark:border-white/20";

export function ReplyGenerator() {
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    setReplies([]);
    const res = await fetch("/api/gerar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: form.get("businessName"),
        businessType: form.get("businessType"),
        tone: form.get("tone"),
        rating,
        reviewerName: form.get("reviewerName"),
        reviewText: form.get("reviewText"),
        extraInstructions: form.get("extraInstructions"),
      }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (res?.ok && data?.replies) {
      setReplies(data.replies);
    } else {
      setError(data?.error ?? "Erro de conexão. Tente novamente.");
    }
    setLoading(false);
  }

  async function copy(text: string, i: number) {
    await navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nome do negócio *
          <input name="businessName" required maxLength={100} className={inputClass} placeholder="Pizzaria do Zé" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Tipo de negócio
          <input name="businessType" maxLength={100} className={inputClass} placeholder="Pizzaria" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nome do cliente
          <input name="reviewerName" maxLength={100} className={inputClass} placeholder="Maria Silva" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Tom da resposta
          <select name="tone" defaultValue="amigavel" className={inputClass}>
            <option value="profissional">Profissional</option>
            <option value="amigavel">Amigável</option>
            <option value="descontraido">Descontraído</option>
          </select>
        </label>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium">Nota da avaliação</legend>
          <div className="mt-1 flex gap-1" role="radiogroup">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className={`text-3xl ${n <= rating ? "text-amber-400" : "text-black/20 dark:text-white/20"}`}
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Texto da avaliação
          <textarea
            name="reviewText"
            rows={5}
            maxLength={4000}
            className={inputClass}
            placeholder="Cole aqui a avaliação do cliente. Pode deixar em branco se ele só deu a nota."
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Instruções extras (opcional)
          <input
            name="extraInstructions"
            maxLength={500}
            className={inputClass}
            placeholder="Ex.: para reclamações, peça contato no WhatsApp (11) 99999-9999"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-60 sm:col-span-2"
        >
          {loading ? "Gerando respostas..." : "Gerar respostas"}
        </button>
      </form>

      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">{error}</p>}

      {replies.length > 0 && (
        <section className="mt-10 space-y-4" aria-live="polite">
          <h2 className="text-xl font-semibold">Escolha uma resposta</h2>
          {replies.map((reply, i) => (
            <div key={i} className="rounded-xl border border-black/10 p-5 dark:border-white/10">
              <p className="whitespace-pre-line">{reply}</p>
              <button
                type="button"
                onClick={() => copy(reply, i)}
                className="mt-3 rounded-full border border-black/20 px-4 py-1 text-sm dark:border-white/20"
              >
                {copied === i ? "Copiado!" : "Copiar"}
              </button>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
