'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { rentalFormSchema } from './schema';
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useRouter } from '@/lib/hooks/use-router';
import { useTransition } from 'react';
import { useMolecule } from 'bunshi/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { createRentalAction } from './action';
import { Loader2 } from 'lucide-react';
import { useFormLeaveConfirmation } from '@/lib/hooks/use-form-confirmation';
import { rentalsMolecule } from '@/lib/molecules/rentals';
import AddressAutoComplete from '@/components/client/address-autocomplete';

export function RentalForm() {
  const router = useRouter();
  const {invalidateRentalsAtom} = useMolecule(rentalsMolecule)
  const invalidateRentals = useAtomValue(invalidateRentalsAtom)
  const form = useForm<z.infer<typeof rentalFormSchema>>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      name: '',
      address: {},
      price: '',
      description: '',
    },
  });

  const confirmLeave = useFormLeaveConfirmation(form.formState);

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.output<typeof rentalFormSchema>) => {
    startTransition(async () => {
      try {
        const result = await createRentalAction(data);
        if (result.success) {
          confirmLeave(false);
          invalidateRentals()
          router.back(true)
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Form {...form}>
      <SheetContent
        className='flex w-screen flex-col sm:max-w-screen-sm'
        asChild
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SheetHeader className='border-b'>
            <SheetTitle>Add a rental</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-4 overflow-y-auto px-6 py-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Seaside Villa' {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your rental property.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <AddressAutoComplete
                      {...field}
                      dialogTitle="Enter Address"
                    />
                  </FormControl>
                  <FormDescription>
                    The full address of the property.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Night</FormLabel>
                  <FormControl>
                    <Input placeholder='150.00' {...field} />
                  </FormControl>
                  <FormDescription>
                    The nightly rate for the property.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='A beautiful seaside villa with panoramic ocean views...'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the property.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex-1'></div>
          <SheetFooter className='border-t'>
            <Button
              variant={'ghost'}
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                isPending ||
                (form.formState.submitCount > 0 && !form.formState.isValid)
              }
            >
              {isPending ? (
                <>
                  <Loader2 className='animate-spin' /> Please wait
                </>
              ) : (
                <>Create Rental</>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Form>
  );
}
