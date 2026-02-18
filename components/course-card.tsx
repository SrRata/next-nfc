import { ChevronRight, GraduationCap, Users } from "lucide-react";
import { IconShape } from "./ui/icon-shape";
import { Badge } from "./ui/badge";
import { InternalLink } from "./ui/link";

type Shift = "morning" | "afternoon";

type EducationLevel =
  | "preschool"
  | "elementary"
  | "middle"
  | "upper_middle"
  | "high_school";

interface Subject {
  id: string;
  name: string;
}

interface CourseCardProps {
  id: string;
  name: string;
  shift: Shift;
  level: EducationLevel;
  subjects: Subject[];
  studentCount: number;
  isActive: boolean;
}

const SHIFT_LABEL: Record<Shift, string> = {
  morning: "Matutina",
  afternoon: "Vespertina",
};

const LEVEL_CONFIG: Record<
  EducationLevel,
  { label: string; color: "green" | "blue" | "yellow" | "purple" | "orange" }
> = {
  preschool: {
    label: "Preparatoria",
    color: "blue",
  },
  elementary: {
    label: "Básica elemental",
    color: "orange",
  },
  middle: {
    label: "Básica media",
    color: "yellow",
  },
  upper_middle: {
    label: "Básica superior",
    color: "green",
  },
  high_school: {
    label: "Bachillerato",
    color: "purple",
  },
};

export function CourseCard({
  id,
  name,
  shift,
  level,
  subjects,
  studentCount,
  isActive,
}: CourseCardProps) {

  const MAX_VISIBLE = 3;
  const visibleSubjects = subjects.slice(0, MAX_VISIBLE);
  const remaining = subjects.length - MAX_VISIBLE;

  return (
    <div className="bg-white-primary rounded-primary p-7 flex flex-col justify-between gap-10">
      <div className="flex items-start justify-between">
        <IconShape size="lg" color="blue" icon={GraduationCap} />

        <div className="flex items-center gap-3 flex-wrap">
          <Badge color={LEVEL_CONFIG[level].color}>
            {LEVEL_CONFIG[level].label}
          </Badge>

          <Badge color={shift === "morning" ? "blue" : "yellow"}>
            {SHIFT_LABEL[shift]}
          </Badge>

          <Badge color={isActive ? "green" : "red"}>
            {isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-black-primary text-2xl font-bold">
          {name}
        </h3>

        <p className="text-blue-primary font-bold">
          {visibleSubjects.map(s => s.name).join(" | ")}
          {remaining > 0 && ` +${remaining} más`}
        </p>

        <div className="flex items-center gap-2.5 text-black-secondary font-semibold mt-6">
          <Users size={18} strokeWidth={2.5} />
          {studentCount} estudiantes
        </div>
      </div>

      <InternalLink href={`/courses/${id}`}>
        Seleccionar curso
        <ChevronRight size={18} strokeWidth={3} />
      </InternalLink>
    </div>
  );
}

//posible version final