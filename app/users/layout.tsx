"use client";

import { Header, PageTitle } from "@/components/header";
import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarLink,
} from "@/components/sidebar";
import { Logo } from "@/components/ui/logo";
import { UserInfo } from "@/components/user";
import { teacherNav } from "@/lib/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Logo variant="Usuario" />
        </SidebarHeader>
        <SidebarNav>
          {teacherNav.map((item, index) => (
            <SidebarLink key={index} href={item.href} icon={item.icon} text={item.text} />
          ))}
        </SidebarNav>
      </Sidebar>
      <Header>
        <PageTitle
          title="Bienvenido, usuario"
          description="Panel de Usuario"
        />
        <UserInfo
          name="cristian cornejo"
          username="Lic. Cristian Cornejo"
          role="usuario"
        />
      </Header>

      <main className="fixed left-width-sidebar top-height-header overflow-y-auto w-width-main h-height-main">
        <section className="max-w-max-width m-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {children}
        </section>
      </main>
    </>
  );
}
