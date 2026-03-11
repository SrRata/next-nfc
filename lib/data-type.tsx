export type educationLevel =
  | "preparatoria"
  | "elemental"
  | "media"
  | "superior"
  | "bachillerato"
  | "todos";


export type section = "matutina" | "vespertina" | "todos";

export type isActive = boolean;

export type state = "presente" | "ausente" | "atrasado"

export type role = "admin" | "profesor" | "usuario"

export type gender = "hombre" | "mujer"

export type ModalType = "edit" | "delete" | null;
