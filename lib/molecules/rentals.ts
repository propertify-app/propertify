import { molecule } from 'bunshi';
import { atomWithQuery, queryClientAtom } from 'jotai-tanstack-query';
import { trpc } from '@/lib/trpc-query/client';
import { companyMolecule } from './company';
import { atom } from 'jotai';

export const rentalsMolecule = molecule((getMol) => {
  const { selectedCompanyAtom } = getMol(companyMolecule);
  const rentalsQueryAtom = atomWithQuery((get) => ({
    queryKey: ['rentals', 'getRentals', get(selectedCompanyAtom)?.id],
    queryFn: async () => trpc.rentals.getRentals.query(),
  }));

  const invalidateRentalsAtom = atom((get) => () => {
    get(queryClientAtom).invalidateQueries({queryKey: ["rentals"]})
  })

  return {
    rentalsQueryAtom,
    invalidateRentalsAtom,
  };
});
