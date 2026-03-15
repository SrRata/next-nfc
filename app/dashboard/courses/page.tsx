import { Alert } from "@/components/alert";
import { CourseCard, Subject } from "@/components/course-card";

import rawData from "./data.json";

import { educationLevel, section} from "@/lib/constants/data-type";

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
