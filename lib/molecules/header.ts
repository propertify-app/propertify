import { molecule } from "bunshi";
import { atom } from "jotai";

export const headerMolecule = molecule((get) => {
  const testAtom = atom("hello")

  return {testAtom}
})