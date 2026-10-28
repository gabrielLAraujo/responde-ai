"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
      }}
      className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
    >
      Sair
    </button>
  );
}
