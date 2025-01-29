import { molecule } from "bunshi";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { CustomAppRouterInstance } from "../hooks/use-router";

export const globalModule = molecule((getMol) => {
  const routerConfirmLeaveAtom = atom(false)
  const routerAtom = atom<CustomAppRouterInstance | null>(null)

  const confirmDialogStateAtom = atomWithImmer<{
    open: boolean
    action: (() => void) | null
  }>({
    open: false,
    action: null
  })

  const requestConfirmationAtom = atom(null, (get, set, action: () => void) => {
    set(confirmDialogStateAtom, draft => {
      draft.open = true
      draft.action = action
    })
  })

  return {
    confirmDialogStateAtom,
    routerConfirmLeaveAtom,
    requestConfirmationAtom,
    routerAtom
  }
})