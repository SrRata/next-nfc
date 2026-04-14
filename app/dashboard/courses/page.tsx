import { Alert } from "@/components/alert";
import { CourseCard, Subject } from "@/components/course-card";

import rawData from "./data.json";

import {
  educationLevel,
  educationLevels,
  section,
  sections,
} from "@/lib/constants/data-type";
import { Suspense } from "react";
import { Filters, FiltersSkeleton } from "@/components/filters";

type CourseData = {
  id: number;
  course: string;
  section: section;
  level: educationLevel;
  subjects: Subject[];
  studentCount: number;
  isActive: boolean;
};

const data: CourseData[] = rawData as CourseData[];

export default function CoursesPage() {
  return (
    <>
      <Suspense fallback={<FiltersSkeleton />}>
        <Filters
          searchPlaceholder="Buscar un curso..."
          fields={[
            {
              id: "level",
              label: "Nivel educativo",
              options: educationLevels.map((level) => ({
                label: level,
                value: level,
              })),
            },

            {
              id: "section",
              label: "Seccion",
              options: sections.map((section) => ({
                label: section,
                value: section,
              })),
            },

            {
              id: "isActive",
              label: "Estado",
              options: [
                { label: "Activo", value: "true" },
                { label: "Inactivo", value: "false" },
              ],
            },
          ]}
        />
      </Suspense>

      {data.map((course) => (
        <CourseCard
          key={course.id}
          courseId={course.id}
          course={course.course}
          section={course.section}
          level={course.level}
          subjects={course.subjects}
          studentCount={course.studentCount}
          isActive={course.isActive}
        />
      ))}

      <Alert
        variant="info"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor aspernatur, odio aliquid voluptates aliquam placeat debitis rerum doloribus qui, dolorem ullam nam! Non porro molestiae asperiores, fugiat voluptatem voluptates incidunt?"
      />
    </>
  );
}
