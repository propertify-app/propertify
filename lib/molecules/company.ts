import { trpc } from "@/lib/trpc-query/client";
import { createScope, molecule } from "bunshi";
import { atom, ExtractAtomValue } from "jotai";
import { atomWithQuery, queryClientAtom, atomWithMutation, AtomWithQueryResult } from "jotai-tanstack-query";
import { ExtractQueryDataFromAtom } from "@/types/types";
import { toast } from "sonner";
import { Company } from "@/db/schema/company";

type SelectCompanyContext = {
  previousSelectedCompanyId?: string;
  newCompany?: Company
}

export const CompanyScope = createScope<string | undefined>(undefined)

export const companyMolecule = molecule(() => {
  const companiesQueryAtom = atomWithQuery(() => ({
    queryKey: ["company", "getCompaniesWithAccess"],
    queryFn: async () => trpc.company.getCompaniesWithAccess.query()
  }))


  const companiesAtom = atom((get) => {
    const result = get(companiesQueryAtom)
    return result.data ?? []
  })

  const selectedCompanyAtom = atom((get) => {
    const companies = get(companiesAtom)
    return companies.find((company) => company.isSelected)
  })

  const invalidateCompanyQueriesAtom = atom(
    null,
    (get, set, specificKey?: string | string[]) => {
      const queryClient = get(queryClientAtom)
      const queryKey = specificKey 
        ? ['company', ...(Array.isArray(specificKey) ? specificKey : [specificKey])]
        : ['company']
      return queryClient.invalidateQueries({ queryKey })
    }
  )

  const selectCompanyMutationAtom = atomWithMutation<
    {success: boolean},
    string,
    Error
  >((get) => ({
    mutationKey: ['company', 'select'],
    mutationFn: async (companyId: string) => {
      const promise = trpc.company.selectCompany.mutate(companyId)
      toast.promise(promise, {
        loading: "Switching company...",
        success: "Switched companies",
        error: "Could not switch companies, try again"
      })
      return promise
    },
    onMutate: async () => {
      const client = get(queryClientAtom)
      await client.cancelQueries({queryKey: ["company", "getCompaniesWithAccess"]})
    },
    onSuccess: () => {
      const queryClient = get(queryClientAtom)
      queryClient.invalidateQueries({ queryKey: ['company'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  }))

  return {
    companiesAtom,
    selectedCompanyAtom,
    invalidateCompanyQueriesAtom,
    selectCompanyMutationAtom
  }
})