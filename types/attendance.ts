import { color } from "@/lib/constants/data-type";

export type AttendanceIdentifier =
  | { student_id: number; nfc_uid?: never }
  | { nfc_uid: string; student_id?: never };

export type EntryRequest = AttendanceIdentifier;
export type ExitRequest = AttendanceIdentifier;

export interface Schedule {
  id: number;
  educational_level: string;
  section: string;
  entry_time: string; // "HH:MM:SS"
  exit_time: string;
  entry_tolerance: number; // minutos
  exit_tolerance: number;



  //si falla algo con los hoarios cquitar esto ...

  educational_level_name: string;
  educational_level_color: color;
  section_name: string;
  educational_level_id: number;
  section_id: number;
  section_color: color;
}



export interface AttendanceRecords {
  id: number;
  date: string,
  entry_time: string;
  exit_time: string;
  observation: string;
  student_id: number;
  student_first_name: string;
  student_last_name: string;
  cdl: string;
  email: string;
  phone_number: string;
  nfc_uid: string;
  student_is_active: boolean;
  course_id: number;
  course_name: string;
  section_id: number;
  section_name: string;
  educational_level_id: number;
  educational_level_name: string
} 






export interface MonthData {
  month: string;
  present: number;
  late: number;
}

export interface Summary {
  totalStudents?: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendanceRate: number;
}

export interface AdminProfesorResponse {
  course?: { id: number; name: string };
  summary: Summary;
  byMonth: MonthData[];
}

export interface ChildData {
  student: { id: number; name: string; course: string };
  summary: Summary;
  byMonth: MonthData[];
}

export interface UsuarioResponse {
  children: ChildData[];
}

export type AttendanceResponse = AdminProfesorResponse | UsuarioResponse;

export function isUsuarioResponse(r: AttendanceResponse): r is UsuarioResponse {
  return "children" in r;
}