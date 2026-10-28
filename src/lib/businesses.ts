import { z } from "zod";
import { TONES } from "./ai";
import { getPool } from "./db";

export const businessSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do negócio").max(100),
  businessType: z.string().trim().max(100),
  tone: z.enum(Object.keys(TONES) as [keyof typeof TONES, ...(keyof typeof TONES)[]]),
  contactInfo: z.string().trim().max(200),
  guidelines: z.string().trim().max(1000),
});

export type BusinessInput = z.infer<typeof businessSchema>;

export type Business = BusinessInput & { id: string };

const COLUMNS = `id, name, business_type AS "businessType", tone, contact_info AS "contactInfo", guidelines`;

// Todas as consultas filtram por user_id: um usuário nunca enxerga negócios de outro.
export async function listBusinesses(userId: string): Promise<Business[]> {
  const { rows } = await getPool().query(
    `SELECT ${COLUMNS} FROM businesses WHERE user_id = $1 ORDER BY created_at`,
    [userId],
  );
  return rows;
}

export async function getBusiness(userId: string, id: string): Promise<Business | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const { rows } = await getPool().query(
    `SELECT ${COLUMNS} FROM businesses WHERE user_id = $1 AND id = $2`,
    [userId, id],
  );
  return rows[0] ?? null;
}

export async function createBusiness(userId: string, b: BusinessInput): Promise<string> {
  const { rows } = await getPool().query(
    `INSERT INTO businesses (user_id, name, business_type, tone, contact_info, guidelines)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [userId, b.name, b.businessType, b.tone, b.contactInfo, b.guidelines],
  );
  return rows[0].id;
}

export async function updateBusiness(userId: string, id: string, b: BusinessInput): Promise<boolean> {
  if (!z.uuid().safeParse(id).success) return false;
  const { rowCount } = await getPool().query(
    `UPDATE businesses
     SET name = $3, business_type = $4, tone = $5, contact_info = $6, guidelines = $7, updated_at = now()
     WHERE user_id = $1 AND id = $2`,
    [userId, id, b.name, b.businessType, b.tone, b.contactInfo, b.guidelines],
  );
  return rowCount === 1;
}

export async function deleteBusiness(userId: string, id: string): Promise<void> {
  if (!z.uuid().safeParse(id).success) return;
  await getPool().query(`DELETE FROM businesses WHERE user_id = $1 AND id = $2`, [userId, id]);
}
