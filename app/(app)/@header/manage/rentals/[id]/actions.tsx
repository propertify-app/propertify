'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { rentalMolecule } from '@/lib/molecules/rental';
import { useMolecule } from 'bunshi/react';
import { useAtomValue } from 'jotai';
import { Trash } from 'lucide-react';

export default function RentalHeaderActions() {
  const { deleteRentalAtom } = useMolecule(rentalMolecule);
  const { mutate: deleteRental } = useAtomValue(deleteRentalAtom);
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size='icon-sm' variant='ghost' >
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              rental.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={() => deleteRental()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
