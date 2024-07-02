"use server"

import { protectedAction } from "@/lib/trpc/trpc";
import { createCompanyFormSchema } from "./schema";
import { getDb } from "@/db";
import { 
  createCompanyRecord, 
  clearSelectedCompanies, 
  createCompanyAccess 
} from "@/db/transactions/company";

export const createCompanyAction = protectedAction
  .input(createCompanyFormSchema)
  .mutation(async ({ ctx, input }) => {
    const db = getDb();
    
    // First create the company
    const [newCompany] = await createCompanyRecord(db, input.name);
    
    // Then batch the access operations
    await db.batch([
      clearSelectedCompanies(db, ctx.user.userId),
      createCompanyAccess(db, ctx.user.userId, newCompany.id, true),
    ]);

    return { success: true };
});
