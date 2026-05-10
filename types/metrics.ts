export interface Metrics {
  total_students: number;
  total_present: number;
  percentage: number;
  total_late: number;
  as_of: string;
}



export interface MetricsAdmin {
  total_students: number;
  total_courses: number;
  total_users: number;
  total_professors: number;
  students_without_parent: number;
  students_with_nfc: number;
  total_admins: number;
  total_parents: number;
  courses_without_professor: number;
  students_with_course: number;
}



