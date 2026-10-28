import { z } from "zod";
import { addToWaitlist, isDbConfigured } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.email().max(200),
  businessType: z.string().trim().max(100).default(""),
});

export async function POST(req: Request) {
  if (!rateLimit(`espera:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return Response.json({ error: "Muitas tentativas. Tente mais tarde." }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }
  if (!isDbConfigured()) {
    return Response.json({ error: "Lista de espera indisponível no momento." }, { status: 503 });
  }
  try {
    await addToWaitlist(parsed.data.email, parsed.data.businessType);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("lista-espera:", err);
    return Response.json({ error: "Não foi possível salvar. Tente novamente." }, { status: 500 });
  }
}
