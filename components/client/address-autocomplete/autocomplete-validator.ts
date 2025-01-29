import { z } from 'zod';
import { AddressSchema as AddressSchemaType } from '@/db/schema/addresses';

export const AddressSchema = AddressSchemaType.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AddressType = z.infer<typeof AddressSchema>;

export const isValidAutocomplete = (
  address: AddressType,
  searchInput: string
) => {
  if (searchInput.trim() === '') {
    return true;
  }

  const result = AddressSchema.safeParse(address);
  return result.success;
};
