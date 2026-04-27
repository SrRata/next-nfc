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
// import { NavMain } from "@/components/nav-main"
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

import { SystemNav } from "@/lib/navigation"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Libre_Barcode_128 } from "next/font/google"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.refresh();
      window.location.href = '/login';
    } catch (error: any) {
      console.error(error.response?.data);
    }
  };


  const [user, setUser] = React.useState<{ role: string } | null>(null);

  React.useEffect(() => {
    axios.get('/api/profile').then(res => setUser(res.data));
  }, []);


  if (!user) return null;  // cambiar por mostrar el esqueleto

  const filteredNav = SystemNav.filter((link) =>
    link.roles.includes(user.role)
  );


  return (

    <Sidebar className="border-none p-5" collapsible="icon">

      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav>

          {filteredNav.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              text={link.text}
              icon={link.icon}
            />
          ))}

        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
