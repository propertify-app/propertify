import { getDb } from '@/db';
import { Rental, rentals } from '@/db/schema';
import { getCachedActiveCompany } from '@/lib/services/company/get-active-company';
import { t } from '@/lib/trpc/trpc';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const rentalRouter = t.router({
  getRentals: t.procedure.query(async ({ctx}): Promise<Rental[]> => {
    const db = getDb()
    const company = await getCachedActiveCompany(ctx.userId)

    const rentals = await db.query.rentals.findMany({
      where: (rentals, {eq}) => eq(rentals.companyId, company.companyId) 
    })

    return rentals
  }),
  getRental: t.procedure.input(z.string()).query(async ({input, ctx}) => {
    const db = getDb()
    const company = await getCachedActiveCompany(ctx.userId)
    const rental = await db.query.rentals.findFirst({
      where: (rentals, {eq, and}) => and(eq(rentals.companyId, company.companyId), eq(rentals.id, input)),
      with: {
        address: true
      }
    })
    if(!rental) {
      throw new Error("Rental not found")
    }
    return rental
  }),
  deleteRental: t.procedure.input(z.string()).mutation(async ({input, ctx}): Promise<void> => {
    const db = getDb()
    const company = await getCachedActiveCompany(ctx.userId)
    await db.delete(rentals).where(and(eq(rentals.companyId, company.companyId), eq(rentals.id, input)))
  })
});

