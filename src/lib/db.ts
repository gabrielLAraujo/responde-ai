import { Pool } from "pg";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

async function getPool(): Promise<Pool> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  schemaReady ??= pool
    .query(
      `CREATE TABLE IF NOT EXISTS waitlist (
         id BIGSERIAL PRIMARY KEY,
         email TEXT NOT NULL UNIQUE,
         business_type TEXT,
         created_at TIMESTAMPTZ NOT NULL DEFAULT now()
       );
       CREATE TABLE IF NOT EXISTS generations (
         id BIGSERIAL PRIMARY KEY,
         business_name TEXT NOT NULL,
         business_type TEXT,
         tone TEXT NOT NULL,
         rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
         review_text TEXT NOT NULL,
         replies JSONB NOT NULL,
         created_at TIMESTAMPTZ NOT NULL DEFAULT now()
       );`,
    )
    .then(() => undefined)
    .catch((err) => {
      schemaReady = null;
      throw err;
    });
  await schemaReady;
  return pool;
}

export async function addToWaitlist(email: string, businessType: string) {
  const db = await getPool();
  await db.query(
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
  reviewText: string;
  replies: string[];
}) {
  const db = await getPool();
  await db.query(
    `INSERT INTO generations (business_name, business_type, tone, rating, review_text, replies)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [g.businessName, g.businessType || null, g.tone, g.rating, g.reviewText, JSON.stringify(g.replies)],
  );
}
