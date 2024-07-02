import "server-only"

import { getDb } from '@/db';
import { insertStateSchema, state } from '@/db/schema/state';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';

export async function getValue(key: string, userId: string) {
  const db = getDb();
  
  const results = await db
    .select({ value: state.value })
    .from(state)
    .where(and(eq(state.key, key), eq(state.userId, userId)))
    .limit(1);
  
  return results.length > 0 ? JSON.parse(results[0].value) : {};
}

export async function setValue(key: string, data: unknown, userId: string) {
  const db = getDb();
  
  const validationResult = insertStateSchema.safeParse({ 
    key, 
    value: data, 
    userId 
  });

  if (!validationResult.success) {
    throw new Error('Invalid data format');
  }

  await db
    .insert(state)
    .values({
      key: validationResult.data.key,
      value: validationResult.data.value,
      userId: validationResult.data.userId
    })
    .onConflictDoUpdate({
      target: [state.key, state.userId],
      set: { value: validationResult.data.value }
    })
    .execute();

  return true;
}
