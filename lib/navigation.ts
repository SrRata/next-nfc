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
  Calendar,
  CalendarClockIcon,
  UserLock,
  School,
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
    icon: Users,
    text: "Gestión de estudiantes",
    roles: ['admin'],
  },
  {
    href: "/dashboard/users-management",
    icon: UserLock,
    text: "Gestión de usuarios",
    roles: ['admin'],

  },
  //   {
  //   href: "/dashboard/calendar",
  //   icon: Calendar,
  //   text: "Gestión de calendario",
  //   roles: ['admin'],

  // },
  {
    href: "/dashboard/courses-management",
    icon: School,
    text: "Gestión de cursos",
    roles: ['admin'],

  },
  {
    href: "/dashboard/schedules",
    icon: CalendarClockIcon,
    text: "Gestión de horarios",
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
    roles: ['profesor'],

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
    roles: ['profesor', 'admin'],

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
