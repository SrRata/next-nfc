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
  roles: string[];
}

export const SystemNav: NavItem[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    text: "Dashboard",
    roles: ['profesor', 'admin', 'usuario'],
  },
  {
    href: "/dashboard/students-management",
    icon: UserPen,
    text: "Gestión de estudiantes",
    roles: ['admin'],

  },
  {
    href: "/dashboard/users-management",
    icon: Contact,
    text: "Gestión de usuarios",
    roles: ['admin'],

  },
  {
    href: "/dashboard/courses-management",
    icon: Presentation,
    text: "Gestión de cursos",
    roles: ['admin'],

  },
  // {
  //   href: "/dashboard/courses",
  //   icon: GraduationCap,
  //   text: "Mis cursos",
  //   roles: "general",
  // },
  {
    href: "/dashboard/students",
    icon: Users,
    text: "Mis alumnos",
    roles: ['profesor', 'usuario'],

  },
  {
    href: "/dashboard/history",
    icon: History,
    text: "Historial",
    roles: ['profesor', 'admin', 'usuario'],

  },
  {
    href: "/dashboard/reports",
    icon: Clipboard,
    text: "Reportes de cursos",
    roles: ['profesor', 'admin', 'usuario'],

  },
  {
    href: "/dashboard/profile",
    icon: User,
    text: "Mi perfil",
    roles: ['profesor', 'admin', 'usuario'],

  },
  // { href: "/dashboard/observations", icon: ClipboardEdit, text: "Observaciones" },
  // { href: "/dashboard/help", icon: HelpCircle, text: "Ayuda" },
  // { href: "/dashboard/calendar", icon: CalendarDays, text: "Calendario" },
  // { href: "/dashboard/settings", icon: Settings, text: "Configuración" },
];
