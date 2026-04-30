"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarBaseProps {
  children?: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarBaseProps) {
  return (
    <aside
      className={cn(
        "bg-white-primary min-h-screen w-width-sidebar flex flex-col fixed top-0 left-0 justify-between p-5 gap-5",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ children, className }: SidebarBaseProps) {
  return (
    <header
      className={cn(
        "h-height-header w-full flex flex-col justify-center px-5",
        className,
      )}
    >
      {children}
    </header>
  );
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
  return <footer className={cn("w-full", className)}>{children}</footer>;
}

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  text: string;
  className?: string;
}

// export function SidebarLink({
//   icon: Icon,
//   text,
//   href,
//   className,
// }: SidebarLinkProps) {
//   const pathname = usePathname();

//   const isActive = (() => {
//     if (pathname === href) return true;

//     if (href === "/dashboard") return false;

//     return pathname.startsWith(href + "/");
//   })();

//   return (
//     <li>
//       <Link
//         href={href}
//         aria-current={isActive ? "page" : undefined}
//         className={cn(
//           "flex items-center gap-2.5 rounded-primary px-4 py-3 transition-all duration-300 ease-in-out",
//           "font-medium",
//           isActive
//             ? "bg-blue-secondary text-blue-primary font-semibold"
//             : "text-black-primary hover:bg-blue-secondary",
//           className,
//         )}
//       >
//         <Icon size={22} strokeWidth={1.5} />
//         <span>{text}</span>
//       </Link>
//     </li>
//   );
// }

// import { useSidebar } from "@/components/ui/sidebar" // ajusta el path

// export function SidebarLink({
//   icon: Icon,
//   text,
//   href,
//   className,
// }: SidebarLinkProps) {
//   const pathname = usePathname()
//   const { state } = useSidebar()

//   const isCollapsed = state === "collapsed"

//   const isActive = (() => {
//     if (pathname === href) return true
//     if (href === "/dashboard") return false
//     return pathname.startsWith(href + "/")
//   })()

//   return (
//     <li>
//       <Link
//         href={href}
//         aria-current={isActive ? "page" : undefined}
//         className={cn(
//           "flex items-center rounded-primary transition-all duration-300 ease-in-out font-medium",
//           isCollapsed ? "justify-center px-2 py-3" : "gap-2.5 px-4 py-3",
//           isActive
//             ? "bg-blue-secondary text-blue-primary font-semibold"
//             : "text-black-primary hover:bg-blue-secondary",
//           className
//         )}
//       >
//         <Icon size={22} strokeWidth={1.5} />

//         {!isCollapsed && <span>{text}</span>}
//       </Link>
//     </li>
//   )
// }


import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SidebarLink({
  icon: Icon,
  text,
  href,
  className,
}: SidebarLinkProps) {
  const pathname = usePathname()
  const { state } = useSidebar()

  const isCollapsed = state === "collapsed"

  const isActive = (() => {
    if (pathname === href) return true
    if (href === "/dashboard") return false
    return pathname.startsWith(href + "/")
  })()

  const linkClasses = cn(
    "flex items-center rounded-primary transition-all duration-300 ease-in-out font-medium",
    isCollapsed ? "justify-center px-2 py-3" : "gap-2.5 px-4 py-3",
    isActive
      ? "bg-blue-secondary text-blue-primary font-semibold"
      : "text-black-primary hover:bg-blue-secondary",
    className
  )

  const [showText, setShowText] = useState(!isCollapsed)
  useEffect(() => {
    if (isCollapsed) {
      const timeout = setTimeout(() => setShowText(false), 200) // igual al transition del sidebar
      return () => clearTimeout(timeout)
    } else {
      setShowText(true)
    }
  }, [isCollapsed])

  const linkContent = (
    <Link href={href} aria-current={isActive ? "page" : undefined} className={linkClasses}>
      <Icon size={22} strokeWidth={1.5} />

      {showText && (
        <span
  className="
    overflow-hidden
    whitespace-nowrap
    transition-all duration-200
    group-data-[collapsible=icon]:opacity-0
    group-data-[collapsible=icon]:translate-x-[-4px]
    group-data-[collapsible=icon]:w-0
  "
>
  {text}
</span>
      )}
    </Link>
  )




  return (
    <li>
      {isCollapsed ? (
        <Tooltip

        >
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right">
            {text}
          </TooltipContent>
        </Tooltip>
      ) : (
        linkContent
      )}
    </li>
  )
}


