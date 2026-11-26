import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pglite = process.env.KULT_PGLITE_MODULE;
test('PostgreSQL migrations keep catalog saves private, idempotent, and separate from Naver places',
  { skip: !pglite && 'Set KULT_PGLITE_MODULE to an installed @electric-sql/pglite entry point to exercise SQL.' },
  async () => {
    const { PGlite } = await import(pglite);
    const db = await PGlite.create();
    try {
      for (const file of [
        './fixtures/catalog-archive-bootstrap.sql',
        '../supabase/migrations/202611220001_kult_accounts.sql',
        '../supabase/migrations/202611260001_kult_catalog_saves.sql',
        './fixtures/catalog-archive-isolation.sql',
      ]) await db.exec(await readFile(new URL(file, import.meta.url), 'utf8'));
    } finally { await db.close(); }
  });
