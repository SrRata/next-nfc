"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"


interface SidebarBaseProps {
  children?: React.ReactNode
  className?: string
}


export function Sidebar({ children, className }: SidebarBaseProps) {
  return (
    <aside
      className={cn(
        "bg-white-primary min-h-screen w-width-sidebar flex flex-col justify-between p-5 gap-5",
        className
      )}
    >
      {children}
    </aside>
  )
}


export function SidebarHeader({ children, className }: SidebarBaseProps) {
  return (
    <header
      className={cn(
        "h-height-header w-full flex flex-col justify-center px-5",
        className
      )}
    >
      {children}
    </header>
  )
}


export function SidebarNav({ children, className }: SidebarBaseProps) {
  return (
    <nav
      aria-label="Sidebar Navigation"
      className={cn("flex-1 w-full overflow-y-auto", className)}
    >
      <ul className="flex flex-col gap-2">{children}</ul>
    </nav>
  )
}


export function SidebarFooter({ children, className }: SidebarBaseProps) {
  return (
    <footer className={cn("w-full", className)}>
      {children}
    </footer>
  )
}


interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  text: string
  className?: string
}

export function SidebarLink({
  icon: Icon,
  text,
  href,
  className,
}: SidebarLinkProps) {
  const pathname = usePathname()

  const isActive = (() => {
  if (pathname === href) return true;

  if (href === "/dashboard") return false;

  return pathname.startsWith(href + "/");
})();

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-primary px-4 py-3 transition-all duration-300 ease-in-out",
          "font-medium",
          isActive
            ? "bg-blue-secondary text-blue-primary font-semibold"
            : "text-black-primary hover:bg-blue-secondary",
          className
        )}
      >
        <Icon size={22} strokeWidth={1.5} />
        <span>{text}</span>
      </Link>
    </li>
  )
}

//posible version final