import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/trpc-query/get-query-client';
import { getUserPreferences } from '@/lib/services/user-preferences';
import { AppSidebar } from '@/components/server/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { HydrateClient, trpc } from '@/lib/trpc-query/server';
import React, { Suspense } from 'react';
import { Providers } from './providers';

export const runtime = 'edge';

export default async function Layout({
  children,
  modal,
  sheet,
  header
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  sheet: React.ReactNode;
  header: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const queries = [
    queryClient.prefetchQuery({
      queryKey: ['user', 'getPreferences'],
      queryFn: () => trpc.user.getPreferences(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['company', 'getCompaniesWithAccess'],
      queryFn: () => trpc.company.getCompaniesWithAccess(),
    }),
  ];

  await Promise.all(queries);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Providers>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <SidebarInset>
            {sheet}
            {modal}
            {header}
            {children}
          </SidebarInset>
        </SidebarProvider>
      </Providers>
    </HydrationBoundary>
  );
}
