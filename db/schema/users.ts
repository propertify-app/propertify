import { relations } from 'drizzle-orm';
import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { userCompanyAccess } from './company';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  clerkConnected: integer('clerk_connected', {mode: "boolean"}).notNull()
});

export const userRelations = relations(users, ({ many }) => ({
  userCompany: many(userCompanyAccess)
}))

export type User = typeof users.$inferSelect // return type when queried
export type InsertUser = typeof users.$inferInsert // insert type