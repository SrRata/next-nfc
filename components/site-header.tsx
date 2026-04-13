import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserInfo } from "./user"
import { PageTitle } from "./header"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-white-primary">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-10"
        />
        <PageTitle
          title="Bienvenido, Lic. Cristian Cornejo"
          description="Panel del docente"
        />
        <div className="ml-auto flex items-center gap-2">
          <UserInfo
            name="cristian cornejo"
            username="Lic. Cristian Cornejo"
            role="profesor"
          />
        </div>
      </div>
    </header>
  )
}
