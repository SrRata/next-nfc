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
  "bachillerato técnico": {
    label: "Bachillerato tecnico",
    color: "blue"
  }
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
  studentState,
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
    color: "orange",
  },
};

export const roleBadgeColor: Record<role, { label: string; color: color }> = {
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
