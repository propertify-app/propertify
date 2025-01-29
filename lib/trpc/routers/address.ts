import { t } from '@/lib/trpc/trpc';
import { z } from 'zod';
import { mockAddresses, mockPlaces } from '../_mock/mock';

export const addressRouter = t.router({
  mockAutocomplete: t.procedure.input(z.string()).query(async ({ input }) => {
    return mockAddresses
    }),
  mockPlace: t.procedure.input(z.string()).query(async ({ input }) => {
    const placeId = input
    const mockPlace = mockPlaces.find((place) => place.placeId === placeId);

    return {
      adrAddress: mockPlace?.adrAddress,
      address: mockPlace?.address,
    }
  }),
});
