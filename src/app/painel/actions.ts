"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { businessSchema, createBusiness, deleteBusiness, updateBusiness } from "@/lib/businesses";

export type BusinessFormState = { error?: string };

function parseForm(formData: FormData) {
  return businessSchema.safeParse({
    name: formData.get("name"),
    businessType: formData.get("businessType") ?? "",
    tone: formData.get("tone"),
    contactInfo: formData.get("contactInfo") ?? "",
    guidelines: formData.get("guidelines") ?? "",
  });
}

export async function saveBusinessAction(
  businessId: string | null,
  _prev: BusinessFormState,
  formData: FormData,
): Promise<BusinessFormState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Confira os campos." };
  }

  let id = businessId;
  if (id) {
    if (!(await updateBusiness(user.id, id, parsed.data))) return { error: "Negócio não encontrado." };
  } else {
    id = await createBusiness(user.id, parsed.data);
  }
  redirect(`/painel/negocios/${id}`);
}

export async function deleteBusinessAction(businessId: string) {
  const user = await requireUser();
  await deleteBusiness(user.id, businessId);
  redirect("/painel");
}
