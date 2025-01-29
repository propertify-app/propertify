"use server"

import { protectedAction } from "@/lib/trpc/trpc";
import { rentalFormSchema } from "./schema";
import { getDb } from "@/db";
import { rentals } from "@/db/schema/rentals";
import { getCachedActiveCompany } from "@/lib/services/company/get-active-company";
import { addresses } from "@/db/schema/addresses";

export const createRentalAction = protectedAction
  .input(rentalFormSchema)
  .mutation(async ({ ctx, input }) => {
    const db = getDb();
    
    const company = await getCachedActiveCompany(ctx.user.userId)

    const address = await db.insert(addresses).values(input.address).returning({ id: addresses.id })

    // Insert a new rental record
    await db.insert(rentals).values({
      name: input.name,
      description: input.description,
      companyId: company.companyId,
      addressId: address[0].id,
    });

    return { success: true };
});
