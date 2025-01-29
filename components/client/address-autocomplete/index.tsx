'use client';

import { FormMessages } from '@/components/server/form-messages';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Delete, Loader2, Pencil } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AddressDialog from './address-dialog';

import { Command as CommandPrimitive } from 'cmdk';
import { addressAutocompleteMolecule, fieldScope } from './molecule';
import { ScopeProvider, useMolecule } from 'bunshi/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AddressType } from './autocomplete-validator';

interface AddressAutoCompleteProps {
  dialogTitle: string;
  showInlineError?: boolean;
  placeholder?: string;
  name: string;
  value?: AddressType;
  onChange?: (address: AddressType) => void;
  onBlur?: () => void;
}

export default function AddressAutoComplete(props: AddressAutoCompleteProps) {
  return (
    <ScopeProvider scope={fieldScope} value={props.name}>
      <AddressAutoCompleteInner {...props} />
    </ScopeProvider>
  );
}

function AddressAutoCompleteInner(props: AddressAutoCompleteProps) {
  const {
    dialogTitle,
    showInlineError = true,
    placeholder,
    onChange,
    onBlur,
    value,
  } = props;

  const { placeIdAtom, placeQueryAtom, addressAtom } = useMolecule(
    addressAutocompleteMolecule
  );
  const [selectedPlaceId, setSelectedPlaceId] = useAtom(placeIdAtom);
  const [address, setAddress] = useAtom(addressAtom);
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useAtomValue(placeQueryAtom);

  useEffect(() => {
    if (onChange && address.formattedAddress !== '') {
      onChange(address);
    }
  }, [address]);

  return (
    <>
      {selectedPlaceId !== '' || address.formattedAddress ? (
        <div className='flex items-center gap-2'>
          <Input value={address?.formattedAddress} readOnly />

          <AddressDialog
            adrAddress={data?.adrAddress || ''}
            isLoading={isLoading}
            dialogTitle={dialogTitle}
            open={isOpen}
            setOpen={setIsOpen}
          >
            <Button
              disabled={isLoading}
              size='icon'
              variant='outline'
              className='shrink-0'
            >
              <Pencil className='size-4' />
            </Button>
          </AddressDialog>
          <Button
            type='reset'
            onClick={() => {
              setSelectedPlaceId('');
              setAddress({
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
            }}
            size='icon'
            variant='outline'
            className='shrink-0'
          >
            <Delete className='size-4' />
          </Button>
        </div>
      ) : (
        <AddressAutoCompleteInput
          setIsOpenDialog={setIsOpen}
          showInlineError={showInlineError}
          placeholder={placeholder}
          onBlur={onBlur}
        />
      )}
    </>
  );
}

interface CommonProps {
  setIsOpenDialog: (isOpen: boolean) => void;
  showInlineError?: boolean;
  placeholder?: string;
  onBlur?: () => void;
}

function AddressAutoCompleteInput(props: CommonProps) {
  const { setIsOpenDialog, showInlineError, placeholder, onBlur } = props;

  const {
    autoCompleteAddressQueryAtom,
    currentSearchInputAtom,
    placeIdAtom,
    debouncedSearchInputAtom,
  } = useMolecule(addressAutocompleteMolecule);
  const [selectedPlaceId, setSelectedPlaceId] = useAtom(placeIdAtom);
  const [isOpen, setIsOpen] = useState(false);
  const setSearchInput = useSetAtom(debouncedSearchInputAtom);
  const searchInput = useAtomValue(currentSearchInputAtom);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    if (onBlur) {
      onBlur();
    }
  }, [onBlur]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  const { data: predictions, isLoading } = useAtomValue(
    autoCompleteAddressQueryAtom
  );

  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      className='overflow-visible'
    >
      <div className='flex w-full items-center justify-between rounded-lg border bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
        <CommandPrimitive.Input
          value={searchInput}
          onValueChange={setSearchInput}
          onBlur={close}
          onFocus={open}
          placeholder={placeholder || 'Enter address'}
          className='w-full rounded-lg p-3 outline-none'
        />
      </div>
      {searchInput !== '' && !isOpen && !selectedPlaceId && showInlineError && (
        <FormMessages
          type='error'
          className='pt-1 text-sm'
          messages={['Select a valid address from the list']}
        />
      )}

      {isOpen && (
        <div className='relative h-auto animate-in fade-in-0 zoom-in-95'>
          <CommandList>
            <div className='absolute top-1.5 z-50 w-full'>
              <CommandGroup className='relative z-50 h-auto min-w-[8rem] overflow-hidden rounded-md border bg-background shadow-md'>
                {isLoading ? (
                  <div className='flex h-28 items-center justify-center'>
                    <Loader2 className='size-6 animate-spin' />
                  </div>
                ) : (
                  <>
                    {predictions?.map(
                      (prediction: {
                        placePrediction: {
                          placeId: string;
                          place: string;
                          text: { text: string };
                        };
                      }) => (
                        <CommandPrimitive.Item
                          value={prediction.placePrediction.text.text}
                          onSelect={() => {
                            setSearchInput('');
                            setSelectedPlaceId(
                              prediction.placePrediction.place
                            );
                            setIsOpenDialog(true);
                          }}
                          className='flex h-max cursor-pointer select-text flex-col items-start gap-0.5 rounded-md p-2 px-3 hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground'
                          key={prediction.placePrediction.placeId}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {prediction.placePrediction.text.text}
                        </CommandPrimitive.Item>
                      )
                    )}
                  </>
                )}

                <CommandEmpty>
                  {!isLoading && predictions?.length === 0 && (
                    <div className='flex items-center justify-center py-4'>
                      {searchInput === ''
                        ? 'Please enter an address'
                        : 'No address found'}
                    </div>
                  )}
                </CommandEmpty>
              </CommandGroup>
            </div>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
