"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserInfo } from "./user"
import { PageTitle } from "./header"
import axios from "axios"
import { useEffect, useState } from "react"
import { formatFullName } from "@/lib/hooks/format-full-name"

export function SiteHeader() {

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    role: '',
    username: ''
  })

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      console.log(response.data);
      setUser(response.data)
      console.log(user)
    } catch (error: any) {
      console.error(error.response?.data);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-white-primary">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-10"
        />
        <PageTitle
          title={`Bienvenido, ${user.role} ${user.firstName}`}
          description={`Panel de ${user.role}`}
        />
        <div className="ml-auto flex items-center gap-2">
          {/* <UserInfo
            name={`${user.firstName} ${user.lastName}`}
            username={`${user.firstName} ${user.lastName}`}
            role={user.role}
          /> */}
        </div>
      </div>
    </header>
  )
}
