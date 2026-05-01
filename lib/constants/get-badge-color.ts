import { profileEnd } from "console";
import {
  color,
  educationLevel,
  gender,
  role,
  section,
  studentState,
} from "./data-type";

  export const levelBadgeColor: Record<
    educationLevel,
    { label: string; color: color }
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
    'bachillerato técnico': {
      label: "Bachillerato tecnico",
      color: "blue"
    },
    default: {
      label: "Sin nivel",
      color: "gray"
    }
  };

  export const getLevelBadge = (level: string | null | undefined) => {
    const key = level?.toLowerCase() || "default";
    return levelBadgeColor[key as keyof typeof levelBadgeColor] || levelBadgeColor.default;
  };

export const sectionBadgeColor: Record<
  section,
  { label: string; color: color }
> = {
  matutina: {
    label: "Matutina",
    color: "blue",
  },
  vespertina: {
    label: "Vespertina",
    color: "yellow",
  },
  default: { label: "Sin Sección", color: "gray" },
};

export const getSectionBadge = (section: string | null | undefined) => {
  const key = section?.toLowerCase() || "default";
  return sectionBadgeColor[key as keyof typeof sectionBadgeColor] || sectionBadgeColor.default;
};

interface BadgeConfig {
  label: string;
  color: color;
}

export const getActiveBadgeColor = (isActive: boolean): BadgeConfig => {
  if (isActive) {
    return { label: "Activo", color: "green" };
  }
  return { label: "Inactivo", color: "red" };
};

export const stateBadgeColor: Record<
  string,
  { label: string; color: color }
> = {
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
    color: "yellow",
  },
  default: {
    label: "Null",
    color: "gray"
  }
};

export const getStateBadge = (state: string | null | undefined) => {
  const key = state?.toLowerCase() || "default";
  return stateBadgeColor[key as keyof typeof stateBadgeColor] || stateBadgeColor.default;
};


export const roleBadgeColor: Record<string, { label: string; color: color }> = {
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
  default: {
    label: "Sin rol",
    color: "gray"
  }
};

export const getRoleBadge = (role: string | null | undefined) => {
  const key = role?.toLowerCase() || "default";
  return roleBadgeColor[key as keyof typeof roleBadgeColor] || roleBadgeColor.default;
};

export const colorBadgeColor: Record<gender, { label: string; color: color }> =
{
  hombre: {
    label: "Hombre",
    color: "blue",
  },
  mujer: {
    label: "Mujer",
    color: "purple",
  },
};








// Este objeto traduce tu tipo 'color' a clases reales de Tailwind
export const colorMap: Record<color, string> = {
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  gray: "bg-gray-500",
  orange: "bg-orange-500",
  sky: "bg-sky-500",
  purple: "bg-purple-500",
};
