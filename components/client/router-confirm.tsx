"use client"

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
} from "@/components/ui/alert-dialog"
import { globalModule } from "@/lib/molecules/global"
import { useMolecule } from "bunshi/react"
import { useAtom, useSetAtom } from "jotai"

export default function RouterConfirm() {

  const {confirmDialogStateAtom, routerConfirmLeaveAtom} = useMolecule(globalModule)
  const setConfirmLeave = useSetAtom(routerConfirmLeaveAtom)
  const [state, setState] = useAtom(confirmDialogStateAtom)

  const resetState = () => {
    setState((draft) => {
      draft.open = false
      draft.action = null
    })
  }

  return (<AlertDialog open={state.open}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Unsaved changes detected</AlertDialogTitle>
        <AlertDialogDescription>
          If you proceed, any unsaved changes will be lost.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={resetState}>Cancel</AlertDialogCancel>
        <AlertDialogAction variant={"destructive"} onClick={() => {
          state.action?.()
          setConfirmLeave(false)
          resetState()
        }}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}