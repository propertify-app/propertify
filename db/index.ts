// db.ts
import { getRequestContext } from '@cloudflare/next-on-pages';
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import * as schema from '@/db/schema'

export const getDb = () => {
  const db = drizzle(getRequestContext().env.DB, {schema})
  return db
};