import { ClipboardEdit, GraduationCap, HelpCircle, LayoutDashboard, LucideIcon, User, Users, History, Clipboard} from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  text: string;
}


export const teacherNav: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
  { href: "/dashboard/courses", icon: GraduationCap, text: "Mis cursos" },
  { href: "/dashboard/students", icon: Users, text: "Mis alumnos" },
  { href: "/dashboard/history", icon: History, text: "Historial" },
  { href: "/dashboard/reports", icon: Clipboard, text: "Reportes de cursos" },
  { href: "/dashboard/observations", icon: ClipboardEdit, text: "Observaciones" },
  { href: "/dashboard/profile", icon: User, text: "Mi perfil" },
  { href: "/dashboard/help", icon: HelpCircle, text: "Ayuda" },
  { href: "/dashboard/students-management", icon: HelpCircle, text: "Gestión de estudiantes" },
  { href: "/dashboard/users-management", icon: HelpCircle, text: "Gestión de usuarios" },
];