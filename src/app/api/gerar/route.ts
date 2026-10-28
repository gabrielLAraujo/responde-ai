import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AiRefusalError, generateReplies, reviewInputSchema, type ReviewInput } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { getBusiness } from "@/lib/businesses";
import { isDbConfigured, logGeneration } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const FREE_LIMIT_PER_HOUR = Number(process.env.FREE_LIMIT_PER_HOUR ?? 10);
const ACCOUNT_LIMIT_PER_HOUR = Number(process.env.ACCOUNT_LIMIT_PER_HOUR ?? 100);
const HOUR = 60 * 60 * 1000;

// Geração para um negócio salvo: só os dados da avaliação vêm do formulário.
const businessReviewSchema = z.object({
  businessId: z.string(),
  rating: z.number().int().min(1).max(5),
  reviewerName: z.string().trim().max(100).default(""),
  reviewText: z.string().trim().max(4000).default(""),
});

type Resolved =
  | { ok: true; input: ReviewInput; userId?: string; businessId?: string }
  | { ok: false; response: Response };

async function resolveInput(req: Request, body: unknown): Promise<Resolved> {
  const forBusiness = businessReviewSchema.safeParse(body);
  if (forBusiness.success) {
    const session = isDbConfigured() ? await auth.api.getSession({ headers: req.headers }) : null;
    if (!session) {
      return { ok: false, response: Response.json({ error: "Faça login para continuar." }, { status: 401 }) };
    }
    if (!rateLimit(`gerar:user:${session.user.id}`, ACCOUNT_LIMIT_PER_HOUR, HOUR)) {
      return { ok: false, response: Response.json({ error: "Limite de gerações desta hora atingido." }, { status: 429 }) };
    }
    const business = await getBusiness(session.user.id, forBusiness.data.businessId);
    if (!business) {
      return { ok: false, response: Response.json({ error: "Negócio não encontrado." }, { status: 404 }) };
    }
    return {
      ok: true,
      userId: session.user.id,
      businessId: business.id,
      input: {
        businessName: business.name,
        businessType: business.businessType,
        tone: business.tone,
        contactInfo: business.contactInfo,
        extraInstructions: business.guidelines,
        rating: forBusiness.data.rating,
        reviewerName: forBusiness.data.reviewerName,
        reviewText: forBusiness.data.reviewText,
      },
    };
  }

  if (!rateLimit(`gerar:${clientIp(req)}`, FREE_LIMIT_PER_HOUR, HOUR)) {
    return {
      ok: false,
      response: Response.json(
        { error: "Você atingiu o limite gratuito desta hora. Crie sua conta para continuar gerando respostas." },
        { status: 429 },
      ),
    };
  }
  const parsed = reviewInputSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, response: Response.json({ error: "Dados inválidos. Confira os campos." }, { status: 400 }) };
  }
  return { ok: true, input: parsed.data };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const resolved = await resolveInput(req, body);
  if (!resolved.ok) return resolved.response;
  const { input, userId, businessId } = resolved;

  try {
    const replies = await generateReplies(input);
    if (isDbConfigured()) {
      logGeneration({ ...input, replies, userId, businessId }).catch((err) => console.error("logGeneration:", err));
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
