import { BadgeColor } from "@/components/ui/badge";
import { educationLevel, gender, isActive, role, section, state } from "./data-type";

export const levelBadgeColor: Record<
  educationLevel,
  { label: string; color: BadgeColor }
> = {
  preparatoria: {
    label: "Preparatoria",
    color: "blue",
  },
  elemental: {
    label: "Básica elemental",
    color: "orange",
  },
  media: {
    label: "Básica media",
    color: "yellow",
  },
  superior: {
    label: "Básica superior",
    color: "green",
  },
  bachillerato: {
    label: "Bachillerato",
    color: "purple",
  },
  todos: {
    label: "Todos",
    color: "gray",
  },
};

export const sectionBadgeColor: Record<
  section,
  { label: string; color: BadgeColor }
> = {
  matutina: {
    label: "Matutina",
    color: "blue",
  },
  vespertina: {
    label: "Vespertina",
    color: "yellow",
  },
  todos: {
    label: "Todos",
    color: "gray",
  },
};

export const stateBadgeColor: Record<state, { label: string; color: BadgeColor }> = {
    presente: {
    label: "Presente",
    color: "green",
  },
  ausente: {
    label: "Ausente",
    color: "red",
  },
  atrasado: {
    label: "Atrasado",
    color: "orange",
  },
}

export function isActiveBadgeColor(isActive: isActive) {
  return isActive
    ? { label: "Activo", color: "green" }
    : { label: "Inactivo", color: "red" };
    
}

export const roleBadgeColor: Record<role, { label: string; color: BadgeColor }> = {
  admin: {
    label: "Administrador",
    color: "purple",
  },
  profesor: {
    label: "Profesor",
    color: "blue",
  },
  usuario: {
    label: "Usuario",
    color: "green",
  },
}


export const genderBadgeColor: Record<gender, { label: string; color: BadgeColor }> = {
  hombre: {
    label: "Hombre",
    color: "blue",
  },
  mujer: {
    label: "Mujer",
    color: "purple",
  },
}