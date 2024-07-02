// app/providers.tsx
'use client'
import { Provider } from "jotai";
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


const HydrateAtoms = ({ children, client }: { children: React.ReactNode, client: QueryClient }) => {
  useHydrateAtoms([[queryClientAtom, client]])
  return children
}

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () => getQueryClient()
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Provider>
          <HydrateAtoms client={queryClient}>
            {props.children}
          </HydrateAtoms>
        </Provider>
        <ReactQueryDevtools />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
