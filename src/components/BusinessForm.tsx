"use client";

import { useActionState } from "react";
import { saveBusinessAction, type BusinessFormState } from "@/app/painel/actions";
import type { Business } from "@/lib/businesses";

const inputClass = "w-full rounded-lg border border-black/20 bg-transparent px-3 py-2 dark:border-white/20";

export function BusinessForm({ business }: { business?: Business }) {
  const [state, formAction, pending] = useActionState<BusinessFormState, FormData>(
    saveBusinessAction.bind(null, business?.id ?? null),
    {},
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Nome do negócio *
        <input
          name="name"
          required
          maxLength={100}
          defaultValue={business?.name}
          className={inputClass}
          placeholder="Selava Express Kobrasol"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Tipo de negócio
        <input
          name="businessType"
          maxLength={100}
          defaultValue={business?.businessType}
          className={inputClass}
          placeholder="Lavanderia self-service"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Tom das respostas
        <select name="tone" defaultValue={business?.tone ?? "amigavel"} className={inputClass}>
          <option value="profissional">Profissional</option>
          <option value="amigavel">Amigável</option>
          <option value="descontraido">Descontraído</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Contato para reclamações
        <input
          name="contactInfo"
          maxLength={200}
          defaultValue={business?.contactInfo}
          className={inputClass}
          placeholder="WhatsApp (48) 98868-1008"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
        Orientações para a IA
        <textarea
          name="guidelines"
          rows={4}
          maxLength={1000}
          defaultValue={business?.guidelines}
          className={inputClass}
          placeholder="Ex.: não oferecer reembolso nem ciclo grátis; assinar como Equipe Selava; mencionar que funcionamos 24h."
        />
      </label>
      {state.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-60 sm:col-span-2"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
