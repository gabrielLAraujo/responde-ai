import type { Metadata } from "next";
import { BusinessForm } from "@/components/BusinessForm";

export const metadata: Metadata = { title: "Novo negócio — RespondeAí" };

export default function NovoNegocioPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Novo negócio</h1>
      <BusinessForm />
    </>
  );
}
