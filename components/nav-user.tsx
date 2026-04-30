// "use client"

// import {
//   IconBoxAlignBottom,
//   IconCreditCard,
//   IconDotsVertical,
//   IconInbox,
//   IconLogout,
//   IconMailbox,
//   IconNotification,
//   IconUserCircle,
// } from "@tabler/icons-react"

// import {
//   Avatar,
// } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar"
// import { UserInfo } from "./user"
// import { useEffect, useState } from "react"
// import axios from "axios"
// import Link from "next/link"
// import { HelpCircle, User } from "lucide-react"
// import { useRouter } from "next/navigation"

// export function NavUser() {
//   const { isMobile } = useSidebar()

//   const [user, setUser] = useState({
//     firstName: '',
//     lastName: '',
//     role: '',
//     username: ''
//   })

//   const getProfile = async () => {
//     try {
//       const response = await axios.get('/api/profile');
//       console.log(response.data);
//       setUser(response.data)
//       console.log(user)
//     } catch (error: any) {
//       console.error(error.response?.data);
//     }
//   };

//   useEffect(() => {
//     getProfile();
//   }, []);



//   const router = useRouter();


//   const logout = async () => {
//     try {
//       await axios.post('/api/logout');
//       router.refresh();
//       window.location.href = '/login';
//     } catch (error: any) {
//       console.error(error.response?.data);
//     }
//   };

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="cursor-pointer  "
//             >

//               <div className="flex items-center gap-2">
//                 <Avatar
//                   name={`${user.firstName} ${user.lastName}`}
//                 />

//                 <div className="grid flex-1 text-left leading-tight">
//                   <span className="truncate font-semibold capitalize text-[11px]">{user.firstName} {user.lastName}</span>
//                   <span className="truncate text-sm font-semibold text-black-secondary capitalize">
//                     {user.role}
//                   </span>
//                 </div>
//                 <IconDotsVertical className="ml-auto size-4" />
//               </div>

//             </SidebarMenuButton>

//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-2 font-normal">
//               <div className="flex items-center gap-2">
//                 <Avatar
//                   name={`${user.firstName} ${user.lastName}`}
//                 />

//                 <div className="grid flex-1 text-left leading-tight">
//                   <span className="truncate font-semibold capitalize text-[11px]">{user.firstName} {user.lastName}</span>
//                   <span className="truncate text-sm font-medium text-black-secondary capitalize">
//                     {user.role}
//                   </span>
//                 </div>
//               </div>


//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//                <DropdownMenuItem>
//                 <Link href="/dashboard/profile" className="flex gap-2 items-center text-[11px] font-medium size-full">
//                   <IconInbox className="size-5"/>
//                   Notificaciones
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Link href="/dashboard/profile" className="flex gap-2 items-center text-[11px] font-medium size-full">
//                   <User className="size-5"/>
//                   Perfil
//                 </Link >
//               </DropdownMenuItem>
//               <DropdownMenuItem> 
//                 <Link href="/dashboard/help" className="flex gap-2 items-center text-[11px] font-medium size-full">
//                   <HelpCircle className="size-5"/>
//                   Ayuda
//                 </Link>
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={logout}variant="destructive" className="text-[11px]">
//               <IconLogout className="size-5" />
//               Cerrar Sesión
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu >
//   )
// }


"use client"

import {
  IconDotsVertical,
  IconInbox,
  IconLogout,
} from "@tabler/icons-react"

import {
  Avatar,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { HelpCircle, User } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function NavUser() {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
    username: "",
  })

  const router = useRouter()

  const getProfile = async () => {
    try {
      const response = await axios.get("/api/profile")
      setUser(response.data)
    } catch (error: any) {
      console.error(error.response?.data)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const logout = async () => {
    try {
      await axios.post("/api/logout")
      router.refresh()
      window.location.href = "/login"
    } catch (error: any) {
      console.error(error.response?.data)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>

          {/* BOTÓN PRINCIPAL */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`
                cursor-pointer transition-all duration-200
                ${isCollapsed ? "justify-center px-2" : "gap-2 px-3"}
              `}
            >
              <Avatar name={`${user.firstName} ${user.lastName}`} />

              {/* TEXTO SOLO SI NO ESTÁ COLAPSADO */}
              {!isCollapsed && (
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold capitalize text-[11px]">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-sm font-medium text-black-secondary capitalize">
                    {user.role}
                  </span>
                </div>
              )}

              {!isCollapsed && (
                <IconDotsVertical className="ml-auto size-4" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* DROPDOWN (NO CAMBIA) */}
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <Avatar name={`${user.firstName} ${user.lastName}`} />

                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold capitalize text-[11px]">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-sm font-medium text-black-secondary capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/dashboard/profile" className="flex gap-2 items-center text-[11px] font-medium size-full">
                  <IconInbox className="size-5" />
                  Notificaciones
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="/dashboard/profile" className="flex gap-2 items-center text-[11px] font-medium size-full">
                  <User className="size-5" />
                  Perfil
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="/help" className="flex gap-2 items-center text-[11px] font-medium size-full">
                  <HelpCircle className="size-5" />
                  Ayuda
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout} variant="destructive" className="text-[11px]">
              <IconLogout className="size-5" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
