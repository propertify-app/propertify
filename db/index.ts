// db.ts
import { getRequestContext } from '@cloudflare/next-on-pages';
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';

export const getDb = (): DrizzleD1Database => {
  const db = drizzle(getRequestContext().env.DB)
  return db
};