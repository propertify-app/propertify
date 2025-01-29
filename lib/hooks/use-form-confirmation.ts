import { useMolecule } from "bunshi/react";
import { globalModule } from "../molecules/global";
import { useSetAtom } from "jotai";
import { FieldValues, FormState, useFormContext } from "react-hook-form";
import { useEffect } from "react";

export function useFormLeaveConfirmation<T extends FieldValues>(formState: FormState<T>) {
  const { routerConfirmLeaveAtom } = useMolecule(globalModule);
  const confirmLeave = useSetAtom(routerConfirmLeaveAtom);

  useEffect(() => {
    if(formState.isDirty) {
      confirmLeave(true)
    } else {
      confirmLeave(false)
    }
  }, [formState.isDirty, confirmLeave])

  return confirmLeave
}