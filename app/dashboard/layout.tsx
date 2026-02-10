import { Header, Headerclock, PageTitle } from "@/components/header"
import { Sidebar, SidebarFooter, SidebarHeader, SidebarNav, SidebarLink } from "@/components/sidebar"
import { Logo } from "@/components/ui/logo"
import { UserInfo } from "@/components/user";
import { Users, GraduationCap, LayoutDashboard, History, Clipboard, ClipboardEdit, User, HelpCircle } from "lucide-react"



export default function DashboardLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <Logo title="Docente" />
                </SidebarHeader>
                <SidebarNav>
                    <SidebarLink href="/dashboard/teacher" icon={LayoutDashboard} text="Dashboard"/>
                    <SidebarLink href="/dashboard/courses" icon={GraduationCap} text="Mis cursos"/>
                    <SidebarLink href="/dashboard/students" icon={Users} text="Mis alumnos"/>
                    <SidebarLink href="/dashboard/history" icon={History} text="Historial"/>
                    <SidebarLink href="/dashboard/reports" icon={Clipboard} text="Reportes de cursos"/>
                    <SidebarLink href="/dashboard/observations" icon={ClipboardEdit} text="Observaciones"/>
                    <SidebarLink href="/dashboard/profile" icon={User} text="Mi perfil"/>
                    <SidebarLink href="/dashboard/help" icon={HelpCircle} text="Ayuda"/>
                    <SidebarLink href="/dashboard/help" icon={HelpCircle} text="Gestión de estudiantes"/>
                    <SidebarLink href="/dashboard/help" icon={HelpCircle} text="Gestión de usuarios"/>
                </SidebarNav>
            </Sidebar>
            <Header>
                <PageTitle text="Bienvenido, Lic. Cristian Cornejo" title="Panel del docente"/>
                <div className="flex items-center gap-15">
                    <Headerclock />
                    <UserInfo name="cristian cornejo" userName="Lic. Cristian Cornejo" role="Docente"/>
                </div>
            </Header>

            <main className="fixed left-width-sidebar top-height-header overflow-y-auto w-width-main h-height-main">
                <section className="max-w-max-width m-auto p-6 grid grid-cols-3 gap-6 w-full">
                    {children}
                </section>
            </main>
        </>
    )
}