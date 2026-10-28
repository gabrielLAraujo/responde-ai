import { notFound } from "next/navigation";
import { BusinessForm } from "@/components/BusinessForm";
import { DeleteBusinessButton } from "@/components/DeleteBusinessButton";
import { requireUser } from "@/lib/auth";
import { getBusiness } from "@/lib/businesses";

export default async function EditarNegocioPage({ params }: PageProps<"/painel/negocios/[id]/editar">) {
  const { id } = await params;
  const user = await requireUser();
  const business = await getBusiness(user.id, id);
  if (!business) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Configurações de {business.name}</h1>
      <BusinessForm business={business} />
      <DeleteBusinessButton businessId={business.id} />
    </>
  );
}
