export function formatTime(
  input: Date | string | null | undefined
): string {
  if (!input) return "--:--"

  const date =
    typeof input === "string"
      ? new Date(input)
      : input

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "--:--"
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}