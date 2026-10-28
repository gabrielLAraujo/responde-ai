export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) return;

  const { getMigrations } = await import("better-auth/db/migration");
  const { auth } = await import("./lib/auth");
  const { migrateAppSchema } = await import("./lib/db");

  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
  await migrateAppSchema();
}
