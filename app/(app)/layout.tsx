import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/trpc-query/get-query-client";
import { getUserPreferences } from "@/lib/services/user-preferences";
import { AppSidebar } from "@/components/server/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCompanies } from "@/lib/services/company";
import { HydrateClient, trpc } from "@/lib/trpc-query/server";
import React, { Suspense } from "react";

export const runtime = 'edge'

export default async function Layout({ children, modal}: { children: React.ReactNode, modal: React.ReactNode }) {
  const queryClient = getQueryClient()

  const queries = [
    queryClient.prefetchQuery({ queryKey: ['user', "getPreferences"], queryFn: () => trpc.user.getPreferences() }),
    queryClient.prefetchQuery({ queryKey: ['company', 'getCompaniesWithAccess'], queryFn: () => trpc.company.getCompaniesWithAccess() })
  ]

  await Promise.all(queries)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HydrateClient>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
            <SidebarInset>
              {modal}
              {children}
            </SidebarInset>
        </SidebarProvider>
      </HydrateClient>
    </HydrationBoundary>
  );
}
