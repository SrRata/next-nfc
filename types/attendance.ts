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
  section_name: string;
}



export interface AttendanceRecords {
  id: number;
  date: string,
  student_id: number;
  entry_time: string;
  exit_time: string;
  observation: string;
} 