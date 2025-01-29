import "server-only"

import { getDb } from "@/db";
import { company, CompanyWithAccess, userCompanyAccess } from "@/db/schema/company";
import authOrThrow from "@/lib/helpers/get-auth-user";
import { memoize } from "@/lib/memoize";
import { eq } from "drizzle-orm";

export const getCompaniesByUser = async (userId: string): Promise<CompanyWithAccess[]> => {
  const db = getDb();
  const results = await db
    .select({
      id: company.id,
      name: company.name,
      isSelected: userCompanyAccess.isSelected,
    })
    .from(company)
    .innerJoin(userCompanyAccess, eq(userCompanyAccess.companyId, company.id))
    .where(eq(userCompanyAccess.userId, userId));

  return results;
};

export const getCachedCompanies = memoize(getCompaniesByUser, {
  additionalCacheKey: (userId) => [userId],
  revalidateTags: (userId) => [`company-${userId}`]
})

