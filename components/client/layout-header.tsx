"use client"
import { useSelectedLayoutSegments } from 'next/navigation';
import { ReactNode } from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { toTitleCase } from '@/lib/helpers/to-title-case';
import { useMolecule } from 'bunshi/react';
import { headerMolecule } from '@/lib/molecules/header';
import { useAtomValue } from 'jotai';

interface LayoutHeaderProps {
  name: string
  baseRef: string
  actions?: ReactNode
}

export default function LayoutHeader({ name, baseRef, actions }: LayoutHeaderProps) {
  const route = useSelectedLayoutSegments()
  const {testAtom} = useMolecule(headerMolecule)
  const testValue = useAtomValue(testAtom)
  
  return (
    <header className="sticky flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-sidebar border-b border-sidebar-border box-content px-4">
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              {route.length === 0 ? (
                <BreadcrumbPage>{name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={baseRef}>{name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {testValue}
            {route.length > 0 && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                {route.slice(0, -1).map((segment, index) => (
                  <>
                    <BreadcrumbItem key={segment}>
                      <BreadcrumbLink href={`${baseRef}/${route.slice(0, index + 1).join('/')}`}>
                        {toTitleCase(segment)}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {toTitleCase(route[route.length - 1])}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-1"></div>
      {actions}
    </header>
  )
}