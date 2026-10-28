import Link from "next/link";
import { notFound } from "next/navigation";
import { ReplyGenerator } from "@/components/ReplyGenerator";
import { requireUser } from "@/lib/auth";
import { getBusiness } from "@/lib/businesses";

export default async function NegocioPage({ params }: PageProps<"/painel/negocios/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const business = await getBusiness(user.id, id);
  if (!business) notFound();

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Cole a avaliação: o tom, o contato e as orientações salvas são aplicados automaticamente.
          </p>
        </div>
        <Link
          href={`/painel/negocios/${business.id}/editar`}
          className="shrink-0 rounded-full border border-black/20 px-4 py-2 text-sm dark:border-white/20"
        >
          Configurações
        </Link>
      </div>
      <ReplyGenerator businessId={business.id} />
    </>
  );
}
