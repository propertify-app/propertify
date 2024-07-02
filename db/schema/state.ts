// schema.ts
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';


export const state = sqliteTable('state', {
  userId: text('userId').notNull().references(() => users.id),
  key: text('key').notNull(),
  value: text('value').notNull(),
}, (table) => {
  return {
    pk: primaryKey({columns: [table.key, table.userId]})
  }
});

// Schema for inserting a user - can be used to validate API requests
export const insertStateSchema = createInsertSchema(state, {
  value: z.any().transform((value) => JSON.stringify(value)),
});
// Schema for selecting a user - can be used to validate API responses
export const selectStateSchema = createSelectSchema(state, {
  value: z.any().transform((value) => JSON.parse(value)) 
});

export const insertStateValues = insertStateSchema.extend({
  userId: z.any().nullable()
})

