import { Pool } from "pg";

let pool: Pool | null = null;

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return pool;
}

// Tabelas do app. Roda depois das migrações do Better Auth, pois "businesses" referencia "user".
export async function migrateAppSchema() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      business_type TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS businesses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      business_type TEXT NOT NULL DEFAULT '',
      tone TEXT NOT NULL,
      contact_info TEXT NOT NULL DEFAULT '',
      guidelines TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON businesses (user_id);
    CREATE TABLE IF NOT EXISTS generations (
      id BIGSERIAL PRIMARY KEY,
      business_name TEXT NOT NULL,
      business_type TEXT,
      tone TEXT NOT NULL,
      rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      review_text TEXT NOT NULL,
      replies JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE generations ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL;
    ALTER TABLE generations ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE SET NULL;
    ALTER TABLE generations ADD COLUMN IF NOT EXISTS reviewer_name TEXT;
    CREATE INDEX IF NOT EXISTS generations_business_id_idx ON generations (business_id, created_at DESC);
  `);
}

export async function addToWaitlist(email: string, businessType: string) {
  await getPool().query(
    `INSERT INTO waitlist (email, business_type) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET business_type = EXCLUDED.business_type`,
    [email.toLowerCase(), businessType || null],
  );
}

export async function logGeneration(g: {
  businessName: string;
  businessType: string;
  tone: string;
  rating: number;
  reviewerName: string;
  reviewText: string;
  replies: string[];
  userId?: string;
  businessId?: string;
}) {
  await getPool().query(
    `INSERT INTO generations
       (business_name, business_type, tone, rating, reviewer_name, review_text, replies, user_id, business_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      g.businessName,
      g.businessType || null,
      g.tone,
      g.rating,
      g.reviewerName || null,
      g.reviewText,
      JSON.stringify(g.replies),
      g.userId ?? null,
      g.businessId ?? null,
    ],
  );
}
