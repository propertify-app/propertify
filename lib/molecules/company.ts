import { trpc } from "@/lib/trpc-query/client";
import { molecule } from "bunshi";
import { atom, ExtractAtomValue } from "jotai";
import { atomWithQuery, queryClientAtom, atomWithMutation, AtomWithQueryResult } from "jotai-tanstack-query";
import { ExtractQueryDataFromAtom } from "@/types/types";
import { toast } from "sonner";

type SelectCompanyContext = {
  previousSelectedCompanyId?: string;
}

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
    Error,
    SelectCompanyContext
  >((get) => ({
    mutationKey: ['company', 'select'],
    mutationFn: async (companyId: string) => {
      return trpc.company.selectCompany.mutate(companyId)
    },
    onMutate: async (companyId): Promise<SelectCompanyContext> => {
      const client = get(queryClientAtom)
      await client.cancelQueries({queryKey: ["company", "getCompaniesWithAccess"]})
      let previousSelectedCompanyId;
      client.setQueryData<ExtractQueryDataFromAtom<typeof companiesQueryAtom>>(["company", "getCompaniesWithAccess"], (old) => {
        if (!old) return old;
        previousSelectedCompanyId = old.find((company) => company.isSelected)?.id
        return old.map(company => ({
          ...company,
          isSelected: company.id === companyId
        }));
      })
      return {previousSelectedCompanyId}
    },
    onSuccess: () => {
      const queryClient = get(queryClientAtom)
      queryClient.invalidateQueries({ queryKey: ['company'] })
    },
    onError: (error: Error, variables: string, context: SelectCompanyContext | undefined) => {
      const client = get(queryClientAtom)
      client.setQueryData<ExtractQueryDataFromAtom<typeof companiesQueryAtom>>(["company", "getCompaniesWithAccess"], (old) => {
        if (!old || !context?.previousSelectedCompanyId) return old;
        return old.map(company => ({
          ...company,
          isSelected: company.id === context.previousSelectedCompanyId
        }));
      })
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