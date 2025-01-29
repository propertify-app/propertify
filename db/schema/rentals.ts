import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { company } from './company';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { createUUID } from '../create-uuid';
import { z } from 'zod';
import { addresses } from './addresses';

export const rentals = sqliteTable('rentals', {
  id: text('id', { length: 36 }).primaryKey().$defaultFn(() => createUUID()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  companyId: text('company_id').notNull().references(() => company.id),
  addressId: text('address_id').notNull().references(() => addresses.id),
});

export const rentalRelations = relations(rentals, ({ one }) => ({
  company: one(company, {
    fields: [rentals.companyId],
    references: [company.id]
  }),
  address: one(addresses, {
    fields: [rentals.addressId],
    references: [addresses.id]
  })
}));


export type Rental = typeof rentals.$inferSelect // return type when queried
export type InsertRental = typeof rentals.$inferInsert // insert type

export const rentalInsertSchema = createInsertSchema(rentals, {
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})