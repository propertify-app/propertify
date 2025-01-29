"use client"

import RentalCard from "@/components/server/rental/rental-card";
import { Skeleton } from "@/components/ui/skeleton";
import { headerMolecule } from "@/lib/molecules/header";
import { rentalsMolecule } from "@/lib/molecules/rentals";
import { useMolecule } from "bunshi/react";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

export default function RentalList({page}: {page: string}) {
  const {rentalsQueryAtom} = useMolecule(rentalsMolecule);
  const {data, isLoading} = useAtomValue(rentalsQueryAtom)
  const {testAtom} = useMolecule(headerMolecule)
  useHydrateAtoms([[testAtom, page]])

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4'>
      {isLoading && Array.from({length: 5}).map((_, index) => <Skeleton key={index} className="w-full h-[200px] rounded-md" />)}
      {data?.map((rental) => (
        <RentalCard key={rental.id} rental={rental} />
      ))}
    </div>
  );
}