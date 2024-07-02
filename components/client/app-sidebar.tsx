'use client'

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useClerk } from "@clerk/nextjs"
import { DropdownMenu, DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, House, LogOut, Plus, Sparkles } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import React from "react"
import { useMolecule } from "bunshi/react"
import { layoutMolecule } from "@/lib/molecules/layout"
import { useAtomValue, useSetAtom } from "jotai"
import { Company } from "@/db/schema/company"
import { companyMolecule } from "@/lib/molecules/company"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Skeleton } from "../ui/skeleton"


function SidebarCompanyMenuSkeleton() {
  return (<div className="flex">
    <Skeleton className="flex-1" />
    <div className="flex flex-col">
      <Skeleton className="flex-1" />
      <Skeleton className="flex-1" />
    </div>
  </div>)
}

export function SidebarCompanyMenu() {
  const isMobile = useIsMobile()
  const { companiesAtom, selectedCompanyAtom, selectCompanyMutationAtom } = useMolecule(companyMolecule)
  const companies = useAtomValue(companiesAtom)
  const selectedCompany = useAtomValue(selectedCompanyAtom)
  const { mutate: selectCompany, isPending } = useAtomValue(selectCompanyMutationAtom)
  return (<DropdownMenu>
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <House className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {selectedCompany?.name}
          </span>
          <span className="truncate text-xs">
            Free
          </span>
        </div>
        <ChevronsUpDown className="ml-auto" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      align="start"
      side={isMobile ? "bottom" : "right"}
      sideOffset={4}
    >
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        Companies
      </DropdownMenuLabel>
      {companies.map((company, index) => (
        <DropdownMenuItem
          key={company.name}
          onClick={() => selectCompany(company.id)}
          className={cn("gap-2 p-2", company.isSelected && "border-slate-200 border")}
        >
          <div className="flex size-6 items-center justify-center rounded-sm border">
            <House className="size-4 shrink-0" />
          </div>
          {company.name}
          <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2 p-2" asChild>
        <Link href="/settings/company/create">
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">
            Add company
          </div>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>)
}

export function SidebarProfileMenu({
  avatar
}: {
  avatar: React.ReactNode
}) {

  const isMobile = useIsMobile()
  const { openUserProfile, signOut } = useClerk()
  const { toggleSidebarAtom } = useMolecule(layoutMolecule)
  const toggleSidebar = useSetAtom(toggleSidebarAtom)

  const handleClick = React.useCallback((handle: Function) => {
    return () => {
      if (isMobile) {
        toggleSidebar(false)
      }
      handle()
    }
  }, [isMobile, toggleSidebar])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {avatar}
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            {avatar}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleClick(openUserProfile)}>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClick(signOut)}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>)
}