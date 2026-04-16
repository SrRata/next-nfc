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
  IconSchool,
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
import { title } from "process"
import { Grid, LogOut, Nfc } from "lucide-react"
import { SidebarLink, SidebarNav } from "./sidebar"

import { teacherNav } from "@/lib/navigation"
import { Button } from "./ui/button"

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
      icon: IconSchool,
    },
    {
      title: "Administrar Estudiantes",
      url: "/dashboard/students-management",
      icon: IconSchool,
    },
    {
      title: "Administrar Usuarios",
      url: "/dashboard/users-management",
      icon: IconSchool,
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
      icon: IconSchool,
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
    // <Sidebar collapsible="icon" {...props} className="border-none p-5">
    //   <SidebarHeader>
    //     <SidebarMenu>
    //       <SidebarMenuItem>
    //         <SidebarMenuButton
    //           asChild
    //           className="data-[slot=sidebar-menu-button]:p-1.5 overflow-visible hover:bg-transparent"
    //         >
    //           <a href="/dashboard">
    //           <div className="size-11 rounded-primary bg-blue-secondary grid place-content-center">
    //             <Nfc className="size-8! text-blue-primary" strokeWidth={2} />
    //             </div>
    //             <span className="text-blue-primary font-bold text-2xl leading-tight">siaeNFC</span>
    //           </a>
    //         </SidebarMenuButton>
    //       </SidebarMenuItem>
    //     </SidebarMenu>
    //   </SidebarHeader>
    //   <SidebarContent>
    //     <NavMain items={data.navMain} />
    //   </SidebarContent>
    //   <SidebarFooter>
    //     <NavSecondary />
    //   </SidebarFooter>
    // </Sidebar>

    <Sidebar className="border-none p-5">

      <SidebarHeader>
        <Logo/>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav>

          {teacherNav.map((link) => (
            <SidebarLink
              key={link.href} // Siempre añade una key única
              href={link.href}
              text={link.text}
              icon={link.icon}
            />
          ))}

        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
          {/* <Button variant="destructive" className="bg-transparent text-red-primary border border-red-primary  hover:bg-red-primary/90 hover:text-white-primary">
            <LogOut/>
            Cerrar Sesión
          </Button> */}
      </SidebarFooter>
    </Sidebar>
  )
}
