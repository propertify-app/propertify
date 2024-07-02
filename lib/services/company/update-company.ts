import { getDb } from '@/db';
import { userCompanyAccess } from '@/db/schema/company';
import { eq, and } from 'drizzle-orm';

export async function updateSelectedCompany(userId: string, companyId: string) {
  const db = getDb();
  
  // First, unselect all companies for this user
  await db
    .update(userCompanyAccess)
    .set({ isSelected: false })
    .where(eq(userCompanyAccess.userId, userId));

  // Then select the specified company
  await db
    .update(userCompanyAccess)
    .set({ isSelected: true })
    .where(
      and(
        eq(userCompanyAccess.userId, userId),
        eq(userCompanyAccess.companyId, companyId)
      )
    );

  return true;
}
