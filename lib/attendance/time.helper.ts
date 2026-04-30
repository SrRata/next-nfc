export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// export function getCurrentTimeString(): string {
//   return new Date().toLocaleTimeString("en-GB", { hour12: false });
// }

// export function getCurrentDateString(): string {
//   return new Date().toISOString().split("T")[0];
// }

export function getCurrentTimeString(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Guayaquil",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function getCurrentDateString(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Guayaquil",
  }).format(new Date());
}

export type EntryStatus = "Puntual" | "Atrasado" | "Fuera de horario";

export function checkEntryStatus(
  currentTime: string,
  schedule: { entry_time: string; entry_tolerance: number }
): EntryStatus {
  const current = timeToMinutes(currentTime);
  const entry = timeToMinutes(schedule.entry_time);
  const tolerance = schedule.entry_tolerance;

  if (current < entry - 60) return "Fuera de horario"; // más de 1h antes
  if (current <= entry + tolerance) return "Puntual";
  return "Atrasado";
}

export function isValidExitTime(
  currentTime: string,
  schedule: { exit_time: string; exit_tolerance: number }
): boolean {
  const current = timeToMinutes(currentTime);
  const exit = timeToMinutes(schedule.exit_time);
  const tolerance = schedule.exit_tolerance;

  return current >= exit - tolerance && current <= exit + tolerance;
}