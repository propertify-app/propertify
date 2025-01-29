import localStore from "@/lib/molecules/store";
import { molecule } from "bunshi";
import { atomWithImmer } from "jotai-immer";


export const reservationTableMolecule = molecule((get) => {
  const dragPositionAtom = atomWithImmer({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
  })

  function setDragPosition(position: {x: number, y: number, top: number, left: number}) {
    localStore.set(dragPositionAtom, (draft) => {
      draft.x = position.x
      draft.y = position.y
      draft.top = position.top
      draft.left = position.left
    })
  }

  return {
    dragPositionAtom,
    setDragPosition,
  }
})
