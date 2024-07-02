import { getCachedCompanies, getCompaniesByUser } from '@/lib/services/company';
import { updateSelectedCompany } from '@/lib/services/company/update-company';
import { t } from '@/lib/trpc/trpc';
import { z } from 'zod';

export const companyRouter = t.router({
  getCompaniesWithAccess: t.procedure.query(async (opts) => {
    const companies = await getCompaniesByUser(opts.ctx.userId)
    return companies;
  }),

  selectCompany: t.procedure
    .input(z.string())  // companyId as input
    .mutation(async ({ ctx, input: companyId }) => {
      // First verify user has access to this company
      const companies = await getCompaniesByUser(ctx.userId);
      const company = companies.find(c => c.id === companyId);
      
      if (!company) {
        throw new Error('Company not found or access denied');
      }


      await updateSelectedCompany(ctx.userId, companyId);

      return { success: true };
    }),
});

