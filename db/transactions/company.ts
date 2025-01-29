import { DrizzleD1Database } from "drizzle-orm/d1";
import { company, userCompanyAccess } from "@/db/schema/company";
import { eq } from "drizzle-orm";
import { getDb } from "..";

export function createCompanyRecord(db: ReturnType<typeof getDb>, name: string) {
  return db
    .insert(company)
    .values({
      name,
    })
    .returning();
}

export function clearSelectedCompanies(db: ReturnType<typeof getDb>, userId: string) {
  return db
    .update(userCompanyAccess)
    .set({ isSelected: false })
    .where(eq(userCompanyAccess.userId, userId));
}

export function createCompanyAccess(
  db: ReturnType<typeof getDb>, 
  userId: string, 
  companyId: string, 
  isSelected: boolean = false
) {
  return db
    .insert(userCompanyAccess)
    .values({
      userId,
      companyId,
      isSelected,
    });
}
