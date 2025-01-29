import { Rental } from "@/db/schema"
import { molecule } from "bunshi"
import { atomWithMutation, atomWithQuery, queryClientAtom } from "jotai-tanstack-query"
import { trpc } from "@/lib/trpc-query/client"
import { atom } from "jotai"
import { rentalsMolecule } from "./rentals"
import { globalModule } from "./global"


export const rentalMolecule = molecule((getMolecule) => {
  const {invalidateRentalsAtom} = getMolecule(rentalsMolecule)
  const {routerAtom} = getMolecule(globalModule)
  const idAtom = atom("")
  const rentalQueryAtom = atomWithQuery((get) => ({
    queryKey: ['rentals', 'getRental', get(idAtom)],
    queryFn: async () => {
      return trpc.rentals.getRental.query(get(idAtom))
    },
  }))

  const deleteRentalAtom = atomWithMutation((get) => ({
    mutationFn: async () => {
      return trpc.rentals.deleteRental.mutate(get(idAtom))
    },
    onMutate: () => {
    },
    onSuccess: () => {
      const router = get(routerAtom)
      get(queryClientAtom).removeQueries({queryKey: ['rentals', 'getRental', get(idAtom)]})
      get(invalidateRentalsAtom)()
      router?.back()
    }
  }))

  return {
    idAtom,
    rentalQueryAtom,
    deleteRentalAtom
  }
})