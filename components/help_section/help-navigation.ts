import DashboardLayout from "@/app/dashboard/layout";
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
  UserCogIcon,
  UserPenIcon,
  UserSearch,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  text: string;
  roles: string[];
}

export const SystemNav: NavItem[] = [

      {
    href: "/help/admin-manual",
    icon: UserCogIcon,
    text: "Manual Administrador",
    roles: ['profesor', 'admin', 'usuario'],
  },

  {
    href: "/help/professor-manual",
    icon: UserPenIcon,
    text: "Manual Profesor",
    roles: ['profesor', 'admin', 'usuario'],
  },
    {
    href: "/help/representative-manual",
    icon: UserSearch,
    text: "Manual Representante",
    roles: ['profesor', 'admin', 'usuario'],
  },

    {
    href: "/dashboard",
    icon: LayoutDashboard,
    text: "Regresar al Dashboard",
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
