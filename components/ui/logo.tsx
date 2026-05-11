"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"

interface LogoProps {
  className?: string
  variant?: "Docente" | "Admin"
}

export function Logo({ className, variant }: LogoProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-all duration-200",
        isCollapsed && "justify-center",
        className
      )}
    >

      <Image
        src="/wardennfclogo.png"
        alt="wardennfclogo"
        width={80}
        height={48}
        className={cn(
          "transition-all duration-200 object-contain shrink-0",
          isCollapsed
            ? "w-10 h-10"
            : "w-20 h-12"
        )}
      />

      <div
        className={cn(
          "transition-all duration-200 ease-in-out overflow-hidden",
          isCollapsed
            ? "opacity-0 w-0 translate-x-[-6px] pointer-events-none"
            : "opacity-100 w-auto translate-x-0"
        )}
      >
        <h2 className="text-[#061e40] font-extrabold text-2xl leading-tight whitespace-nowrap">
          WARDEN NFC
        </h2>

        {variant && (
          <p className="text-black-secondary font-medium text-sm whitespace-nowrap">
            {variant}
          </p>
        )}
      </div>
    </div>
  )
}