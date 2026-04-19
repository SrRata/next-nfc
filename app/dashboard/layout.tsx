"use client";

// import { Header, PageTitle } from "@/components/header";
// import {
//   Sidebar,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarNav,
//   SidebarLink,
// } from "@/components/sidebar";
// import { Logo } from "@/components/ui/logo";
// import { UserInfo } from "@/components/user";
// import { teacherNav } from "@/lib/navigation";

// export default function DashboardLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <>
//       <Sidebar>
//         <SidebarHeader>
//           <Logo variant="Docente" />
//         </SidebarHeader>
//         <SidebarNav>
//           {teacherNav.map((item, index) => (
//             <SidebarLink key={index} href={item.href} icon={item.icon} text={item.text} />
//           ))}
//         </SidebarNav>
//       </Sidebar>
//       <Header>
//         <PageTitle
//           title="Bienvenido, Lic. Cristian Cornejo"
//           description="Panel del docente"
//         />
//         <UserInfo
//           name="cristian cornejo"
//           username="Lic. Cristian Cornejo"
//           role="profesor"
//         />
//       </Header>

//       <main className="fixed left-width-sidebar top-height-header overflow-y-auto w-width-main h-height-main">
//         <section className="max-w-max-width m-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
//           {children}
//         </section>
//       </main>
//     </>
//   );
// }



import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 80)",
            "--header-height": "calc(var(--spacing) * 25)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <main className="@container/main flex flex-1 flex-col gap-2">
              <section className="max-w-max-width mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {children}
              </section>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
