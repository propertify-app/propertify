import "server-only"
import { getDb } from "@/db";
import { Company, company, userCompanyAccess } from "@/db/schema/company";
import authOrThrow from "@/lib/helpers/get-auth-user";
import { memoize } from "@/lib/memoize";
import { eq } from "drizzle-orm";

export const getActiveCompanyByUser = async (userId: string): Promise<Company[]> => {
  const db = getDb()
  const results = await db.select({
    id: company.id,
    name: company.name
  }).from(company)
    .innerJoin(userCompanyAccess, eq(userCompanyAccess.companyId, company.id))
    .where(
      eq(userCompanyAccess.userId, userId)
    )

  return results
}

export const getActiveCachedCompany = async () => {
  const {userId} = await authOrThrow()
  return memoize(() => getActiveCompanyByUser(userId), {
    additionalCacheKey: [userId],
    revalidateTags: [`company-${userId}`]
  })()
}

export const getActiveCompany = async () => {
  const {userId} = await authOrThrow()
  return getActiveCompanyByUser(userId)
}

