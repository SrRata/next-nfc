"use client"


import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
    children?: React.ReactNode;
    className?: string;
}

export function Sidebar({children, className}: SidebarProps){
    return  (
        <aside className={`bg-white-primary h-screen w-width-sidebar flex flex-col gap-10 p-5 justify-between ${className}`}>
            {children}
        </aside>
    )
}

export function SidebarHeader({children, className}: SidebarProps) {
    return (
        <header className={`h-height-header w-full flex flex-col justify-center px-5 ${className}`}>
            {children}
        </header>
    )
}

export function SidebarFooter({children, className}: SidebarProps) {
    return (
        <footer className={`h-fit w-full ${className}`}>
            {children}
        </footer>
    )
}

export function SidebarNav({children, className}: SidebarProps) {
    return (
        <nav className={`h-full w-full overflow-y-auto ${className}`}>
            <ul className="flex flex-col gap-2">
                {children}
            </ul>
        </nav>
    )
}



import { usePathname } from "next/navigation";

interface SidebarLinkProps {
    href: string;
    className?: string;
    icon: LucideIcon;
    text: string;
}


export function SidebarLink({icon: Icon, text, className, href}: SidebarLinkProps) {

    const pathname = usePathname();

    const isActive = pathname === href;
    // const isActive = pathname === href || pathname.startsWith(href + "/");

    return (
        <li>
            <Link href={href} className={cn("text-black-primary font-medium rounded-primary px-4 py-3 flex items-center gap-2.5 cursor-pointer hover:bg-blue-secondary transition-all duration-300 ease-in-out", className, isActive && "bg-blue-secondary text-blue-primary font-semibold")}>
                <Icon size={24} strokeWidth={1.5} className=""/>
                {text}
            </Link>
        </li>
    )
}


