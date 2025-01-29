import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { createUUID } from "../create-uuid";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const addresses = sqliteTable("addresses", {
  id: text('id', { length: 36 }).primaryKey().$defaultFn(() => createUUID()),
  address1: text("address1").notNull(),
  address2: text("address2"),
  formattedAddress: text("formatted_address").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  lat: real("latitude").notNull(),
  lng: real("longitude").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

export const AddressSchema = createInsertSchema(addresses, {
  address1: z.string().min(1, "Address line 1 is required"),
  formattedAddress: z.string().min(1, "Formatted address is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
})