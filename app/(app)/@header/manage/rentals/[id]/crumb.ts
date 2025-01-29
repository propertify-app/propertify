"use server"

import { getDb } from "@/db"
import { rentals } from "@/db/schema"
import { protectedAction } from "@/lib/trpc/trpc"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const getCrumb = protectedAction.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
  const db = getDb()
  const rental = await db.query.rentals.findFirst({
    columns: {
      name: true,
      id: true,
    },
    where: (rentals, { eq }) => eq(rentals.id, input.id)
  })

  if (!rental) {
    throw new Error('Rental not found');
  }

  return {
    name: rental.name,
    href: `/manage/rentals/${rental.id}`
  }
})
