"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setLoading(true);
    setError("");
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/painel" });
    if (error) {
      setError("Não foi possível entrar com o Google. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="w-full rounded-lg border border-black/20 px-6 py-3 font-medium hover:bg-black/5 disabled:opacity-60 dark:border-white/20 dark:hover:bg-white/10"
      >
        {loading ? "Redirecionando..." : "Entrar com Google"}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </>
  );
}
