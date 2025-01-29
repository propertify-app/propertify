import { BadgeCheck, Bell, Calendar, ChevronsUpDown, ChevronUp, CreditCard, Home, House, Inbox, LogOut, Search, Settings, Sparkles, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { auth, currentUser } from "@clerk/nextjs/server"
import { SidebarCompanyMenu, SidebarProfileMenu } from "@/components/client/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components//ui/avatar"
import getInitials from "@/lib/helpers/get-initials"
import Link from "next/link"

export const runtime = 'edge'
// Menu items.
const application = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

const manage = [
  {
    title: "Rentals",
    url: "/manage/rentals",
    icon: Home,
  }
]

async function SidebarCompanySelector() {
  return <SidebarCompanyMenu />
}

async function SidebarFooterAvatar() {
  const user = (await currentUser())!

  return (<>
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage
        src={user?.imageUrl}
        alt={user?.fullName ?? "User Avatar"}
      />
      <AvatarFallback className="rounded-lg">
        {getInitials(user)}
      </AvatarFallback>
    </Avatar>
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">
        {user?.fullName}
      </span>
      <span className="truncate text-xs">
        {user?.primaryEmailAddress?.emailAddress}
      </span>
    </div>
  </>)
}

async function SidebarFooterContent() {

  return (<SidebarMenu>
    <SidebarMenuItem>
      <SidebarProfileMenu avatar={<SidebarFooterAvatar />} />
    </SidebarMenuItem>
  </SidebarMenu>)
}


export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarCompanySelector />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {application.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manage.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  )
}

