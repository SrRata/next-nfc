import { ChevronRight, GraduationCap, Users } from "lucide-react";
import { IconShape } from "./ui/icon-shape";
import { Badge } from "./ui/badge";
import { InternalLink } from "./ui/link";
import { educationLevel, isActive, section} from "@/lib/data-type";
import {
  isActiveBadgeColor,
  levelBadgeColor,
  sectionBadgeColor,
} from "@/lib/get-badge-color";

export interface Subject {
  name: string;
}

interface CourseCardProps {
  id: number;
  course: string;
  section: section;
  level: educationLevel;
  subjects: Subject[];
  studentCount: number;
  isActive: isActive;
}

export function CourseCard({
  id,
  course,
  section,
  level,
  subjects,
  studentCount,
  isActive,
}: CourseCardProps) {

  const status = isActiveBadgeColor(isActive)

  return (
    <div className="bg-white-primary rounded-primary p-7 flex flex-col justify-between gap-10">
      <div className="flex items-start justify-between">
        <IconShape size="lg" color="blue" icon={GraduationCap} />

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Badge color={levelBadgeColor[level].color}>
            {levelBadgeColor[level].label}
          </Badge>

          <Badge color={sectionBadgeColor[section].color}>
            {sectionBadgeColor[section].label}
          </Badge>

          <Badge color={status.color}>
            {status.label}
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
