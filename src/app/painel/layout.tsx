import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { requireUser } from "@/lib/auth";

export default async function PainelLayout({ children }: LayoutProps<"/painel">) {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
        <Link href="/painel" className="font-semibold">
          Painel
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-black/60 dark:text-white/60">{user.name || user.email}</span>
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
