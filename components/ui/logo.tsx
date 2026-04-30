// import { Nfc } from "lucide-react";
// import { IconShape } from "./icon-shape";
// import { cn } from "@/lib/utils";

// interface LogoProps {
//   className?: string;
//   variant?: "Docente" | "Admin"
// }

// export function Logo({ className, variant }: LogoProps) {
//   return (
//     <div className={cn("flex items-center gap-2.5", className)}>
//       <IconShape
//         icon={Nfc}
//         color="blue"
//         shape="rounded"
//         className="w-11 h-11"
//       />

//       <div>
//         <h2 className="text-blue-primary font-bold text-2xl leading-tight">
//           siaeNFC
//         </h2>
//         {variant && (
//           <p className="text-black-secondary font-medium text-sm">
//             {variant}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }


// //Componente mejorado, version final
// //01-03-2026








"use client"

import { Nfc } from "lucide-react"
import { IconShape } from "./icon-shape"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

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
        "flex items-center gap-2.5 transition-all duration-200",
        isCollapsed && "justify-center",
        className
      )}
    >
      {/* ICONO SIEMPRE VISIBLE */}
      <IconShape
        icon={Nfc}
        color="blue"
        shape="rounded"
        className="w-11 h-11 shrink-0"
      />

      <div
        className={cn(
          "transition-all duration-200 ease-in-out overflow-hidden",
          isCollapsed
            ? "opacity-0 w-0 translate-x-[-6px] pointer-events-none"
            : "opacity-100 w-auto translate-x-0"
        )}
      >
        <h2 className="text-blue-primary font-bold text-2xl leading-tight whitespace-nowrap">
          siaeNFC
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