import { AddressSchema } from '@/components/client/address-autocomplete/autocomplete-validator';
import { rentalInsertSchema } from '@/db/schema/rentals';
import { z } from 'zod';

export const rentalFormSchema = rentalInsertSchema
  .pick({
    name: true,
    description: true,
  })
  .extend({
    address: AddressSchema,
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
      message: 'Price must be a valid number.',
    }),
  });
