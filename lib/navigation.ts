import {
  GraduationCap,
  LayoutDashboard,
  LucideIcon,
  User,
  Users,
  History,
  Clipboard,
  Contact,
  UserPen,
  Presentation,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  text: string;
  type: string;
}

export const teacherNav: NavItem[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    text: "Dashboard",
    type: "general",
  },
  {
    href: "/dashboard/students-management",
    icon: UserPen,
    text: "Gestión de estudiantes",
    type: "admin",
  },
  {
    href: "/dashboard/users-management",
    icon: Contact,
    text: "Gestión de usuarios",
    type: "admin",
  },
  {
    href: "/dashboard/courses-management",
    icon: Presentation,
    text: "Gestión de cursos",
    type: "admin",
  },
  // {
  //   href: "/dashboard/courses",
  //   icon: GraduationCap,
  //   text: "Mis cursos",
  //   type: "general",
  // },
  {
    href: "/dashboard/students",
    icon: Users,
    text: "Mis alumnos",
    type: "general",
  },
  {
    href: "/dashboard/history",
    icon: History,
    text: "Historial",
    type: "general",
  },
  {
    href: "/dashboard/reports",
    icon: Clipboard,
    text: "Reportes de cursos",
    type: "general",
  },
  {
    href: "/dashboard/profile",
    icon: User,
    text: "Mi perfil",
    type: "general",
  },
  // { href: "/dashboard/observations", icon: ClipboardEdit, text: "Observaciones" },
  // { href: "/dashboard/help", icon: HelpCircle, text: "Ayuda" },
  // { href: "/dashboard/calendar", icon: CalendarDays, text: "Calendario" },
  // { href: "/dashboard/settings", icon: Settings, text: "Configuración" },
];
