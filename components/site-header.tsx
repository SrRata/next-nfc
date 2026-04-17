"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserInfo } from "./user"
import { PageTitle } from "./header"
import axios from "axios"
import { useEffect, useState } from "react"
import { formatFullName } from "@/lib/hooks/format-full-name"
import { Inbox } from "lucide-react"
import { Badge } from "./ui/badge"
import { BorderBeam } from "./ui/border-beam"
import { AuroraText } from "./ui/aurora-text"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"

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
        <div className="ml-auto flex items-center gap-5">
          {/* <UserInfo
            name={`${user.firstName} ${user.lastName}`}
            username={`${user.firstName} ${user.lastName}`}
            role={user.role}
          /> */}


          <Sheet>

            <SheetTrigger>
              <div className="relative overflow-hidden border-0 hover:bg-transparent rounded-full py-2 px-7 cursor-pointer font-semibold"  >
                <AuroraText>Preguntar</AuroraText>
                {/* Preguntar */}
                <BorderBeam
                  size={200}
                  initialOffset={20}
                  borderWidth={2}
                  className="from-transparent via-[#FF0080] to-[#38bdf8]"
                  transition={{
                    type: "tween",
                    stiffness: 60,
                    damping: 20,
                  }}
                />
              </div>

            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>This action cannot be undone.</SheetDescription>
              </SheetHeader>
            </SheetContent>

          </Sheet>



          <div className="relative">
            <div className="bg-red-primary absolute top-0 right-0 rounded-full size-3">

            </div>
            <Button type="button" className="p-2" variant="outline">
              <Inbox className="size-7" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
