// app/providers.tsx
'use client'
import { Provider, useSetAtom } from "jotai";
import * as React from 'react'
import { useHydrateAtoms } from "jotai/utils";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { queryClientAtom } from "jotai-tanstack-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getQueryClient } from "@/lib/trpc-query/get-query-client";
import { useRouter } from "@/lib/hooks/use-router";
import { globalModule } from "@/lib/molecules/global";
import { useMolecule } from "bunshi/react";
import { useEffect } from "react";
import localStore from "@/lib/molecules/store";


const HydrateAtoms = ({ children, client }: { children: React.ReactNode, client: QueryClient}) => {
  useHydrateAtoms([[queryClientAtom, client]])
  return children
}

function Providers(props: { children: React.ReactNode }) {
  const {routerAtom} = useMolecule(globalModule)
  const setRouter = useSetAtom(routerAtom)
  const [queryClient] = React.useState(
    () => getQueryClient()
  )
  const router = useRouter()

  useEffect(() => {
    setRouter(router)
  }, [router, setRouter])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HydrateAtoms client={queryClient}>
          {props.children}
        </HydrateAtoms>
        <ReactQueryDevtools />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

function ProvidersWithStore(props: { children: React.ReactNode }) {
  return (
    <Provider store={localStore}>
      <Providers>{props.children}</Providers>
    </Provider>
  )
}

export default ProvidersWithStore