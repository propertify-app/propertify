import { molecule } from 'bunshi'
import { atom, ExtractAtomArgs, ExtractAtomValue } from 'jotai'
import { userPreferencesMolecule } from './persisted/user-preferences'
import { atomWithImmer } from 'jotai-immer'

export const layoutMolecule = molecule((getMol) => {
  const { sidebarOpenAtom } = getMol(userPreferencesMolecule)

  const sidebarStateBaseAtom = atomWithImmer({
    mobileOpen: false,
    isMobile: false,
    state: "collapsed",
    open: false
  })

  const sidebarStateAtom = atom<ExtractAtomValue<typeof sidebarStateBaseAtom>, ExtractAtomArgs<typeof sidebarStateBaseAtom>, void>(
    (get) => {
      const baseState = get(sidebarStateBaseAtom)
      return {
        ...baseState,
        state: get(sidebarOpenAtom) ? "expanded" : "collapsed",
        open: get(sidebarOpenAtom)
      }
    },
    (_get, set, update) => set(sidebarStateBaseAtom, update as any)
  )

  const toggleSidebarAtom = atom(null, (get, set, force?: boolean) => {
    const state = get(sidebarStateAtom)
    if(state.isMobile) {
      set(sidebarStateBaseAtom, draft => {
        draft.mobileOpen = force ?? !draft.mobileOpen
      })
    } else {
      set(sidebarOpenAtom, !get(sidebarOpenAtom))
    }
  })

  return {
    sidebarOpenAtom,
    sidebarStateAtom,
    toggleSidebarAtom
  }
})
