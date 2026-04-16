"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarNav } from "./sidebar"
import { teacherNav } from "@/lib/navigation"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <Link href={item.url} key={item.title} className="cursor-pointer">
              <SidebarMenuButton tooltip={item.title} size="lg" className="font-medium">
                {item.icon && <item.icon/>}
                <span className="text-[10px]">{item.title}</span>
              </SidebarMenuButton>
            </Link>
          ))}
            
        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}
