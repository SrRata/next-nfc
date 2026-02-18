"use client"

import { Header, PageTitle } from "@/components/header"
import { Sidebar, SidebarFooter, SidebarHeader, SidebarNav, SidebarLink } from "@/components/sidebar"
import { Logo } from "@/components/ui/logo"
import { UserInfo } from "@/components/user";
import { teacherNav } from "@/lib/navigation";

export default function DashboardLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <Logo title="Docente" />
                </SidebarHeader>
                <SidebarNav>

                    {teacherNav.map((item) => (
                        <SidebarLink href={item.href} icon={item.icon} text={item.text}/>
                    )) }

                </SidebarNav>
            </Sidebar>
            <Header>
                <PageTitle title="Bienvenido, Lic. Cristian Cornejo" description="Panel del docente"/>
                <UserInfo fullName="cristian cornejo" username="Lic. Cristian Cornejo" role="Docente"/>
            </Header>

            <main className="fixed left-width-sidebar top-height-header overflow-y-auto w-width-main h-height-main">
                <section className="max-w-max-width m-auto p-6 grid grid-cols-3 gap-6 w-full">
                    {children}
                </section>
            </main>
        </>
    )
}