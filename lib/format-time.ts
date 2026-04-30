export function formatTime(input: Date | string | null | undefined): string {
  if (!input) return "--:--";

  const date = typeof input === "string" ? new Date(input) : input;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatTime12h(horaString: string) {
  if (!horaString) return "--:--";

  const [horas, minutos] = horaString.split(":");
  const fecha = new Date();
  fecha.setHours(parseInt(horas), parseInt(minutos));

  return fecha
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}


export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}









export function timeToMinutes(time: string): number {

    const [hours, minutes] =
        time.split(":").map(Number);

    return (hours * 60) + minutes;
}


export function minutesToTime(totalMinutes: number): string {

    const hours = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, "0");

    const minutes = (totalMinutes % 60)
        .toString()
        .padStart(2, "0");

    return `${hours}:${minutes}`;
}
