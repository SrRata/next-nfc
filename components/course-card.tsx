import { ChevronRight, GraduationCap, Users } from "lucide-react";
import { IconShape } from "./ui/icon-shape";
import { Badge } from "./ui/badge";
import { InternalLink } from "./ui/link";
import { educationLevel, section} from "@/lib/constants/data-type";
import {
  levelBadgeColor,
  sectionBadgeColor,
} from "@/lib/constants/get-badge-color";

export interface Subject {
  name: string;
}

interface CourseCardProps {
  courseId: number;
  course: string;
  section: section;
  level: educationLevel;
  subjects: Subject[];
  studentCount: number;
  isActive: boolean;
}

export function CourseCard({
  courseId,
  course,
  section,
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
          <Badge color={levelBadgeColor[level].color}>
            {levelBadgeColor[level].label}
          </Badge>

          <Badge color={sectionBadgeColor[section].color}>
            {sectionBadgeColor[section].label}
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

      <InternalLink href={`/courses$course-id=${courseId}`}>
        Seleccionar curso
        <ChevronRight size={18} strokeWidth={3} />
      </InternalLink>
    </div>
  );
}