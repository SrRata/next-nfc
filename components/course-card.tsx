import { ChevronRight, GraduationCap, Users } from "lucide-react";
import { IconShape } from "./ui/icon-shape";
import { Badge } from "./ui/badge";
import { InternalLink } from "./ui/link";

export type Shift = "matutina" | "vespertina";

export type EducationLevel =
  | "preparatoria"
  | "elemental"
  | "media"
  | "superior"
  | "bachillerato";

export interface Subject {
  name: string;
}

interface CourseCardProps {
  id: number;
  course: string;
  shift: Shift;
  level: EducationLevel;
  subjects: Subject[];
  studentCount: number;
  isActive: boolean;
}

const SHIFT_LABEL: Record<Shift, string> = {
  matutina: "Matutina",
  vespertina: "Vespertina",
};

const LEVEL_CONFIG: Record<
  EducationLevel,
  { label: string; color: "green" | "blue" | "yellow" | "purple" | "orange" }
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
};

export function CourseCard({
  id,
  course,
  shift,
  level,
  subjects,
  studentCount,
  isActive,
}: CourseCardProps) {

  return (
    <div className="bg-white-primary rounded-primary p-7 flex flex-col justify-between gap-10">
      <div className="flex items-start justify-between">
        <IconShape size="lg" color="blue" icon={GraduationCap} />

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Badge color={LEVEL_CONFIG[level].color}>
            {LEVEL_CONFIG[level].label}
          </Badge>

          <Badge color={shift === "matutina" ? "blue" : "yellow"}>
            {SHIFT_LABEL[shift]}
          </Badge>

          <Badge color={isActive ? "green" : "red"}>
            {isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-black-primary text-2xl font-bold">{course}</h3>

        <p className="text-blue-primary font-bold">
          {subjects.map((s) => s.name).join(" | ")}
        </p>
        <div className="flex items-center gap-2.5 text-black-secondary font-semibold mt-6 leading-primary">
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
