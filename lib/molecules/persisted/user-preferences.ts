import { molecule } from 'bunshi'
import { atom } from 'jotai'
import { atomWithQuery, atomWithMutation, queryClientAtom, atomWithSuspenseQuery } from 'jotai-tanstack-query'
import { trpc } from '@/lib/trpc-query/client'
import type { UserPreferences } from '@/lib/services/user-preferences'

class NoChangesError extends Error {
  constructor() {
    super('No changes detected')
    this.name = 'NoChangesError'
  }
}

export const userPreferencesMolecule = molecule(() => {
  const preferencesQueryAtom = atomWithQuery<UserPreferences>(() => ({
    queryKey: ['user', 'getPreferences'],
    queryFn: async () => {
      return trpc.user.getPreferences.query()
    },
  }))

  const updatePreferencesMutationAtom = atomWithMutation<
    UserPreferences, 
    Partial<UserPreferences>
  >((get) => ({
    mutationKey: ["user", "setPreferences"],
    mutationFn: async (partialPreferences) => {
      const currentPreferences = get(preferencesQueryAtom).data
      
      const hasChanges = Object.entries(partialPreferences).some(
        ([key, value]) => currentPreferences?.[key as keyof UserPreferences] !== value
      )
      if (!hasChanges) {
        throw new NoChangesError()
      }

      const mergedPreferences = {
        ...currentPreferences,
        ...partialPreferences
      } as UserPreferences
      await trpc.user.setPreferences.mutate(mergedPreferences)
      return mergedPreferences as UserPreferences
    },
    onMutate: async (partialPreferences) => {
      const queryClient = get(queryClientAtom)
      await queryClient.cancelQueries({ queryKey: ['user', 'getPreferences'] })
      let previousPreferences = queryClient.getQueryData<UserPreferences>(['user', 'getPreferences'])
      queryClient.setQueryData(["user", "getPreferences"], {
        ...previousPreferences,
        ...partialPreferences
      })
      return { previousPreferences }
    },
    onError: (
      error, 
      variables: Partial<UserPreferences>, 
      context
    ) => {
      if (error instanceof NoChangesError) {
        return
      }
      if (context && typeof context === 'object' && 'previousPreferences' in context) {
        const queryClient = get(queryClientAtom)
        queryClient.setQueryData(['preferences'], (context as { previousPreferences: UserPreferences }).previousPreferences)
      }
    },
    onSettled: (data, error) => {
      if (error instanceof NoChangesError) {
        return
      }
      const queryClient = get(queryClientAtom)
      queryClient.invalidateQueries({ queryKey: ['preferences'] })
    }
  }))

  const preferencesDataAtom = atom((get) => {
    const result = get(preferencesQueryAtom)
    return result.data
  })

  const sidebarOpenAtom = atom(
    (get) => get(preferencesDataAtom)?.sidebarOpen ?? true,
    async (get, set, nextValueOrUpdater: boolean | ((prev: boolean) => boolean)) => {
      const mutate = get(updatePreferencesMutationAtom).mutate
      const currentValue = get(preferencesDataAtom)?.sidebarOpen ?? false
      const nextValue = typeof nextValueOrUpdater === 'function' 
        ? nextValueOrUpdater(currentValue)
        : nextValueOrUpdater
      
      mutate({ sidebarOpen: nextValue })
    }
  )

  return {
    preferencesQueryAtom,
    updatePreferencesMutationAtom,
    sidebarOpenAtom
  }
})
