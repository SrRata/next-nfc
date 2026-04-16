"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import { useRouter } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import axios from "axios"
import { Button } from "./ui/button";

export function NavSecondary() {

  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post('/api/logout');
      router.push('/login');
    } catch (error: any) {
      console.error(error.response?.data);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>

          <SidebarMenuItem key="logout">
            <SidebarMenuButton asChild>
              <Button onClick={logout} className="rounded-primary" variant="destructive">
                <span>Cerrar Sesión</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
