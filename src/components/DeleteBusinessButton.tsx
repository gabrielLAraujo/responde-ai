"use client";

import { deleteBusinessAction } from "@/app/painel/actions";

export function DeleteBusinessButton({ businessId }: { businessId: string }) {
  return (
    <form
      action={deleteBusinessAction.bind(null, businessId)}
      onSubmit={(e) => {
        if (!confirm("Excluir este negócio e suas configurações?")) e.preventDefault();
      }}
      className="mt-10 border-t border-black/10 pt-6 dark:border-white/10"
    >
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Excluir este negócio
      </button>
    </form>
  );
}
