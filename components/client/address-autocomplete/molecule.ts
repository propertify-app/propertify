import atomWithDebounce from '@/lib/atoms/atomWithDebounce';
import { trpc } from '@/lib/trpc-query/client';
import { ComponentScope, createScope, molecule, use } from 'bunshi';
import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { atomWithImmer } from 'jotai-immer';
import { withAtomEffect } from 'jotai-effect';
import { AddressType } from './autocomplete-validator';
export const fieldScope = createScope<unknown>(undefined);

export const addressAutocompleteMolecule = molecule((get) => {
  use(fieldScope);
  const placeIdAtom = atom('');
  const {
    debouncedValueAtom: debouncedSearchInputAtom,
    currentValueAtom: currentSearchInputAtom,
  } = atomWithDebounce('');

  const addressAtom = atomWithImmer<AddressType>({
    address1: '',
    address2: '',
    formattedAddress: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    lat: 0,
    lng: 0,
  });

  const placeQueryAtom = withAtomEffect(
    atomWithQuery((get) => ({
      queryKey: ['address', 'mockPlace', get(placeIdAtom)],
      queryFn: () => trpc.address.mockPlace.query(get(placeIdAtom)),
    })),
    (get, set) => {
      const { data } = get(placeQueryAtom);
      if (data?.address) {
        set(addressAtom, data.address);
      }
    }
  );
  const autoCompleteAddressQueryAtom = atomWithQuery((get) => ({
    queryKey: ['address', 'mockAutocomplete', get(debouncedSearchInputAtom)],
    queryFn: () =>
      trpc.address.mockAutocomplete.query(get(debouncedSearchInputAtom)),
  }));

  return {
    debouncedSearchInputAtom,
    currentSearchInputAtom,
    placeQueryAtom,
    placeIdAtom,
    addressAtom,
    autoCompleteAddressQueryAtom,
  };
});
