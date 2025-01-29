import 'server-only';
import { getDb } from '@/db';
import { Company, company, CompanyWithAccess, UserCompanyAccess, userCompanyAccess } from '@/db/schema/company';
import { memoize } from '@/lib/memoize';
import { and, eq } from 'drizzle-orm';

export const getActiveCompanyIdByUser = async (
  userId: string
): Promise<UserCompanyAccess> => {
  const db = getDb();

  const company = await db.query.userCompanyAccess.findFirst({
    where: (userCompanyAccess, { eq, and }) =>
      and(
        eq(userCompanyAccess.userId, userId),
        eq(userCompanyAccess.isSelected, true)
      ),
  });
  if(!company) {
    throw new Error("Company not selected")
  }
  return company;
};

export const getCachedActiveCompany = memoize(getActiveCompanyIdByUser, {
  additionalCacheKey: (userId) => [userId],
  revalidateTags: (userId) => [`company-active-${userId}`],
});
