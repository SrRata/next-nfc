"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Logo } from "./ui/logo"
import { GraduationCap, School2Icon, User, UserPen } from "lucide-react"
import { title } from "process"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Admininstrar Cursos",
      url: "/dashboard/courses-management",
      icon: School2Icon,
    },
    {
      title: "Administrar Estudiantes",
      url: "/dashboard/students-management",
      icon: GraduationCap,
    },
    {
      title: "Administrar Usuarios",
      url: "/dashboard/users-management",
      icon: UserPen,
    },
    {
      title: "Mis Estudiantes",
      url: "/dashboard/students"
    },
    {
      title: "Reportes",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Perfil",
      url: "#",
      icon: User,
    },
        {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-none">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="size-8!" strokeWidth={1.5} />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary />
      </SidebarFooter>
    </Sidebar>
  )
}
