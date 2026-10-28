import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listBusinesses } from "@/lib/businesses";
import { TONES } from "@/lib/ai";

export const metadata: Metadata = { title: "Meus negócios — RespondeAí" };

export default async function PainelPage() {
  const user = await requireUser();
  const businesses = await listBusinesses(user.id);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus negócios</h1>
        <Link
          href="/painel/negocios/novo"
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + Novo negócio
        </Link>
      </div>

      {businesses.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-black/20 p-8 text-center text-black/60 dark:border-white/20 dark:text-white/60">
          Cadastre seu primeiro negócio para salvar o tom, o contato e as orientações das respostas.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {businesses.map((b) => (
            <li key={b.id}>
              <Link
                href={`/painel/negocios/${b.id}`}
                className="block rounded-xl border border-black/10 p-5 hover:border-emerald-600 dark:border-white/10"
              >
                <p className="font-semibold">{b.name}</p>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  {[b.businessType, `Tom ${TONES[b.tone].split(" ")[0]}`, b.contactInfo].filter(Boolean).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
