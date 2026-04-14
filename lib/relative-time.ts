export function getRelativeTime(input: Date | string): string {
  const date =
    typeof input === "string" ? new Date(input) : input

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "fecha inválida"
  }

  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()

  const isFuture = diffInMs < 0
  const diffInSeconds = Math.abs(Math.floor(diffInMs / 1000))

  if (diffInSeconds < 5) {
    return "justo ahora"
  }

  const intervals = [
    { label: "año", seconds: 60 * 60 * 24 * 365 },
    { label: "mes", seconds: 60 * 60 * 24 * 30 },
    { label: "día", seconds: 60 * 60 * 24 },
    { label: "hora", seconds: 60 * 60 },
    { label: "minuto", seconds: 60 },
    { label: "segundo", seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)

    if (count >= 1) {
      const plural = count > 1 ? "s" : ""

      return isFuture
        ? `En ${count} ${interval.label}${plural}`
        : `Hace ${count} ${interval.label}${plural}`
    }
  }

  return "justo ahora"
}

//posible version final