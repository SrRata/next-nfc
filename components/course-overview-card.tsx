import { GraduationCap } from "lucide-react"
import { Badge, BadgeCircle } from "./ui/badge"
import { ProgressBar } from "./ui/bar"
import { cn } from "@/lib/utils"

interface CourseOverviewCardProps {
  children: React.ReactNode
  className?: string
}

interface CourseOverviewHeaderProps {
  courseName: string
  schedule: string
  description?: string
}

interface CourseOverviewStatsProps {
  children: React.ReactNode
  isActive: boolean
}

interface AttendanceStatCardProps {
  present: number
  total: number
}

interface AbsenceStatCardProps {
  absences: number
  late: number
}


export function CourseOverviewCard({
  children,
  className,
}: CourseOverviewCardProps) {
  return (
    <section
      className={cn(
        "bg-white-primary rounded-primary overflow-hidden col-span-2 row-span-2",
        className
      )}
    >
      {children}
    </section>
  )
}


export function CourseOverviewHeader({
  courseName,
  schedule,
  description = "Datos relevantes de su curso asignado.",
}: CourseOverviewHeaderProps) {
  return (
    <header className="bg-blue-primary text-white-primary px-6 py-10 flex flex-col gap-2 relative">
      <p className="opacity-80 text-sm font-medium">
        Clases en curso: {schedule}
      </p>

      <h2 className="text-3xl font-semibold">{courseName}</h2>

      <p className="opacity-80">{description}</p>

      <GraduationCap
        className="absolute top-3 right-10 opacity-60"
        size={100}
        aria-hidden
      />
    </header>
  )
}

export function CourseOverviewStats({
  children,
  isActive,
}: CourseOverviewStatsProps) {
  return (
    <div className="p-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-2xl">
          Estado de asistencia
        </h3>

        <Badge color={isActive ? "green" : "red"}>
          <BadgeCircle pulse={isActive} size="sm" />
          {isActive ? "Registro activo" : "Registro inactivo"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  )
}

function StatContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <article className="bg-gray rounded-primary px-5 py-7 flex flex-col gap-4">
      {children}
    </article>
  )
}

export function AttendanceStatCard({
  present,
  total,
}: AttendanceStatCardProps) {
  const safeTotal = total > 0 ? total : 0
  const rawPercentage =
    safeTotal > 0 ? (present / safeTotal) * 100 : 0

  const percentage = Math.min(Math.max(rawPercentage, 0), 100)

  return (
    <StatContainer>
      <p className="text-sm text-black-secondary font-bold">
        Presentes
      </p>

      <div>
        <span className="text-4xl font-bold text-blue-primary">
          {present}
        </span>

        <span className="text-black-secondary font-semibold text-xl">
          {" "}
          / {safeTotal} alumnos
        </span>
      </div>

      <ProgressBar
        value={percentage}
        showLabel={false}
        intent="info"
        size="lg"
      />
    </StatContainer>
  )
}

export function AbsenceStatCard({
  absences,
  late,
}: AbsenceStatCardProps) {
  const safeAbsences = Math.max(absences, 0)
  const safeLate = Math.max(late, 0)

  return (
    <StatContainer>
      <p className="text-sm text-black-secondary font-bold">
        Ausentes / Atrasos
      </p>

      <div className="flex gap-8 mt-3">
        <div>
          <span className="text-4xl font-bold text-orange-primary">
            {safeLate}
          </span>
          <p className="text-black-secondary font-semibold">
            Atrasos
          </p>
        </div>

        <div>
          <span className="text-4xl font-bold text-red-primary">
            {safeAbsences}
          </span>
          <p className="text-black-secondary font-semibold">
            Ausentes
          </p>
        </div>
      </div>
    </StatContainer>
  )
}