"use client"

import { useAtomValue } from "jotai"
import { rentalMolecule } from "@/lib/molecules/rental"
import { useMolecule } from "bunshi/react"
import { useHydrateAtoms } from "jotai/utils"

export default function EditRentalClient({ id }: { id: string }) {
  const { rentalQueryAtom, idAtom } = useMolecule(rentalMolecule)
  useHydrateAtoms([[idAtom, id]], {dangerouslyForceHydrate: true})
  const {data} = useAtomValue(rentalQueryAtom)
  return <div>
    {data?.name}
    <br />
    {data?.address?.formattedAddress}
  </div>
}
