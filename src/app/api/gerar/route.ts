import Anthropic from "@anthropic-ai/sdk";
import { AiRefusalError, generateReplies, reviewInputSchema } from "@/lib/ai";
import { isDbConfigured, logGeneration } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const LIMIT_PER_HOUR = Number(process.env.FREE_LIMIT_PER_HOUR ?? 10);

export async function POST(req: Request) {
  if (!rateLimit(`gerar:${clientIp(req)}`, LIMIT_PER_HOUR, 60 * 60 * 1000)) {
    return Response.json(
      { error: "Você atingiu o limite gratuito desta hora. Entre na lista de espera para acesso ilimitado." },
      { status: 429 },
    );
  }

  const parsed = reviewInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Dados inválidos. Confira os campos." }, { status: 400 });
  }

  try {
    const replies = await generateReplies(parsed.data);
    if (isDbConfigured()) {
      logGeneration({ ...parsed.data, replies }).catch((err) => console.error("logGeneration:", err));
    }
    return Response.json({ replies });
  } catch (err) {
    if (err instanceof AiRefusalError) {
      return Response.json({ error: err.message }, { status: 422 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Muitos pedidos agora. Tente de novo em instantes." }, { status: 503 });
    }
    console.error("gerar:", err);
    return Response.json({ error: "Não foi possível gerar as respostas. Tente novamente." }, { status: 500 });
  }
}
