import { text, sqliteTable, primaryKey, integer } from 'drizzle-orm/sqlite-core';
import { createUUID } from '@/db/create-uuid';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const company = sqliteTable('company', {
  id: text('id', { length: 36 }).primaryKey().$defaultFn(() => createUUID()),
  name: text('name').notNull(),
});

export const companyRelations = relations(company, ({ many }) => ({
  userCompany: many(userCompanyAccess)
}))

export const userCompanyAccess = sqliteTable("user_company", {
  userId: text("user_id").notNull().references(() => users.id),
  companyId: text("company_id").notNull().references(() => company.id),
  isSelected: integer("is_selected", {mode: "boolean"}).notNull().default(false)
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.companyId] })
}))

export const userCompanyRelations = relations(userCompanyAccess, ({ one }) => ({
  user: one(users, {
    fields: [userCompanyAccess.userId],
    references: [users.id]
  }),
  company: one(company, {
    fields: [userCompanyAccess.companyId],
    references: [company.id]
  })
}))

export type Company = typeof company.$inferSelect // return type when queried
export type UserCompanyAccess = typeof userCompanyAccess.$inferSelect
export type InsertCompany = typeof company.$inferInsert // insert type

export type CompanyWithAccess = Company & Pick<UserCompanyAccess, "isSelected">;