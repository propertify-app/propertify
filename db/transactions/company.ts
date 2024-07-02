import { DrizzleD1Database } from "drizzle-orm/d1";
import { company, userCompanyAccess } from "@/db/schema/company";
import { eq } from "drizzle-orm";

export function createCompanyRecord(db: DrizzleD1Database, name: string) {
  return db
    .insert(company)
    .values({
      name,
    })
    .returning();
}

export function clearSelectedCompanies(db: DrizzleD1Database, userId: string) {
  return db
    .update(userCompanyAccess)
    .set({ isSelected: false })
    .where(eq(userCompanyAccess.userId, userId));
}

export function createCompanyAccess(
  db: DrizzleD1Database, 
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
