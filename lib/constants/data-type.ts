export const educationLevels = [
  "preparatoria",
  "elemental",
  "media",
  "superior",
  "bachillerato",
] as const;

export type educationLevel = (typeof educationLevels)[number];

export const sections = ["matutina", "vespertina"] as const;

export type section = (typeof sections)[number];

export const studentStates = ["presente", "ausente", "atrasado"] as const;

export type studentState = (typeof studentStates)[number];

export const roles = ["admin", "profesor", "usuario"] as const;

export type role = (typeof roles)[number];

export const genders = ["hombre", "mujer"] as const;

export type gender = (typeof genders)[number];

export const colors = [
  "green",
  "red",
  "yellow",
  "blue",
  "gray",
  "orange",
  "sky",
  "purple",
] as const;

export type color = (typeof colors)[number];
