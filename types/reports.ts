// ── absence-heatmap ──────────────────────────────────────────
export interface DayOfWeekData {
  dayOfWeek: string;
  dayNumber: number;
  present: number;
  absent: number;
  absenceRate: number;
}

export interface TopAbsenceDay {
  date: string;
  dayOfWeek: string;
  totalPresent: number;
  totalAbsent: number;
}

export interface AbsenceHeatmapResponse {
  byDayOfWeek: DayOfWeekData[];
  topAbsenceDays: TopAbsenceDay[];
  worstDayOfWeek: string;
  peakAbsenceMonth: string;
}

// ── by-course ────────────────────────────────────────────────
export interface CourseStats {
  courseId: number;
  courseName: string;
  section: string;
  level: string;
  totalStudents: number;
  present: number;
  late: number;
  attendanceRate: number;
}

export interface ByCourseResponse {
  courses: CourseStats[];
}

// ── daily-trend ──────────────────────────────────────────────
export interface DailyTrendPoint {
  date: string;
  present: number;
  late: number;
  absent: number;
}

export interface ChildTrendPoint {
  date: string;
  status: "on_time" | "late";
}

export interface ChildTrend {
  student: { id: number; name: string };
  trend: ChildTrendPoint[];
}

export interface DailyTrendAdminResponse {
  trend: DailyTrendPoint[];
}

export interface DailyTrendUsuarioResponse {
  children: ChildTrend[];
}

export type DailyTrendResponse = DailyTrendAdminResponse | DailyTrendUsuarioResponse;

export function isDailyTrendUsuario(r: DailyTrendResponse): r is DailyTrendUsuarioResponse {
  return "children" in r;
}

// ── student/[id] ─────────────────────────────────────────────
export interface StudentDetail {
  id: number;
  name: string;
  cdl: string;
  email: string;
  phone: string;
  nfcUid: string;
  course: string;
  section: string;
  level: string;
}

export type RecordStatus = "on_time" | "late" | "absent";

export interface RecentRecord {
  date: string;
  entryTime: string | null;
  exitTime: string | null;
  observation: string | null;
  status: RecordStatus;
}

export interface StudentReportResponse {
  student: StudentDetail;
  summary: {
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    attendanceRate: number;
  };
  byMonth: { month: string; present: number; late: number }[];
  recentRecords: RecentRecord[];
}

// ── student-ranking ──────────────────────────────────────────
export interface RankedStudent {
  studentId: number;
  name: string;
  cdl: string;
  courseName: string;
  section: string;
  level: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendanceRate: number;
}

export interface StudentRankingResponse {
  total: number;
  students: RankedStudent[];
}