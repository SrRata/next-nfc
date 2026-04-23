// types/attendance.ts

import { db } from '@/lib/hooks/db';
import { NextResponse } from 'next/server';
import { educationLevel, section } from '@/lib/constants/data-type';

// types/database.ts


export interface StudentRow {
  id: number;
  course_id: number;
  section: section;
  educational_level: educationLevel;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  entry_time: string | null;
  exit_time: string | null;
  observation: string;
}


type ScheduleDetail = { entry: string; exit: string; gracePeriod: number };

export const SCHEDULES: Record<string, ScheduleDetail> = {
  'preparatoria-matutina': { entry: '07:30:00', exit: '12:30:00', gracePeriod: 15 },
  'elemental-matutina': { entry: '07:15:00', exit: '12:45:00', gracePeriod: 10 },
  'bachillerato-matutina': { entry: '07:00:00', exit: '13:30:00', gracePeriod: 10 },
  'bachillerato-vespertina': { entry: '15:00:00', exit: '19:00:00', gracePeriod: 10 },
  'default-default': { entry: '08:00:00', exit: '14:00:00', gracePeriod: 10 },
};




// export async function POST(req: Request) {
//   try {
//     // 1. Recibir id o nfc_uid del body
//     const { student_id, nfc_uid } = await req.json();


//     const now = new Date();
//     const currentDate = now.toLocaleDateString('en-CA');
//     const currentTime = now.toTimeString().split(' ')[0];

//     // 2. Consulta flexible: Buscamos por ID o por NFC_UID
//     const [rows] = await db.query<any[]>(
//       `SELECT s.id, s.course_id, c.section, c.educational_level 
//        FROM students s 
//        JOIN courses c ON s.course_id = c.id 
//        WHERE ${student_id ? 's.id = ?' : 's.nfc_uid = ?'}`,
//       [student_id || nfc_uid]
//     );

//     const student = rows[0] as StudentRow | undefined;
//     if (!student) return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });

//     // A partir de aquí, usamos student.id para todo (independientemente de cómo entró)
//     const activeStudentId = student.id;

//     // 3. Consulta de registro previo usando el ID real encontrado
//     const [recordRows] = await db.query<any[]>(
//       `SELECT * FROM attendance_records WHERE student_id = ? AND date = ?`,
//       [activeStudentId, currentDate]
//     );

//     const existingRecord = recordRows[0] as AttendanceRecord | undefined;

//     // ... (El resto de la lógica de Transacción, IF/ELSE y COMMIT se mantiene igual)
//     // Solo asegúrate de usar `activeStudentId` en los INSERT/UPDATE de los resúmenes.

//   } catch (error) {
//     console.error(error);
//     if (db) await db.query("ROLLBACK");
//     return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
//   }
// }



export async function POST(req: Request) {
  try {
    const { student_id, nfc_uid } = await req.json();

    if (!student_id && !nfc_uid) {
      return NextResponse.json({ error: "Se requiere student_id o nfc_uid" }, { status: 400 });
    }


    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA'); // Retorna "YYYY-MM-DD" local
    const currentTime = now.toTimeString().split(' ')[0];

    // Consulta de estudiante
    const [rows] = await db.query<any[]>(
      `SELECT s.id, s.course_id, c.section, c.educational_level 
       FROM students s 
       JOIN courses c ON s.course_id = c.id 
       WHERE ${student_id ? 's.id = ?' : 's.nfc_uid = ?'}`,
      [student_id || nfc_uid]
    );


    const student = rows[0] as StudentRow | undefined;
    if (!student) return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });

    const activeStudentId = student.id;


    // Consulta de registro previo

    const [recordRows] = await db.query<any[]>(
      `SELECT * FROM attendance_records WHERE student_id = ? AND date = ?`,
      [activeStudentId, currentDate]
    );

    const existingRecord = recordRows[0] as AttendanceRecord | undefined;

    await db.query("START TRANSACTION");

    if (!existingRecord) {
      /** LÓGICA DE ENTRADA **/
      // Dentro de tu función POST, reemplaza la lógica de búsqueda de horario:

      const level = student.educational_level;
      const section = student.section;

      // Intentamos buscar la combinación exacta, si no existe, usamos el default
      const scheduleKey = `${level}-${section}`;
      const schedule = SCHEDULES[scheduleKey] || SCHEDULES['default-default'];

      const [h, m] = schedule.entry.split(':').map(Number);
      const entryLimit = new Date(now);
      entryLimit.setHours(h, m + schedule.gracePeriod, 0);

      const observation = now > entryLimit ? 'Atrasado' : 'Puntual';

      await db.query(
        `INSERT INTO attendance_records (date, event, student_id, entry_time, observation) 
         VALUES (?, 'Clase Diaria', ?, ?, ?)`,
        [currentDate, student.id, currentTime, observation]
      );

      await db.query(
        `INSERT INTO student_summaries (student_id, total_attendances) VALUES (?, 1)
         ON DUPLICATE KEY UPDATE total_attendances = total_attendances + 1`,
        [student.id]
      );

      await db.query(
        `INSERT INTO daily_course_summaries (date, course_id, section, total_present)
         VALUES (?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE total_present = total_present + 1`,
        [currentDate, student.course_id, student.section]
      );

      await db.query("COMMIT");
      return NextResponse.json({ message: `Entrada registrada: ${observation}` });

    } else if (existingRecord.exit_time === null) {
      /** LÓGICA DE SALIDA **/
      await db.query(
        `UPDATE attendance_records SET exit_time = ? WHERE id = ?`,
        [currentTime, existingRecord.id]
      );

      await db.query("COMMIT");
      return NextResponse.json({ message: "Salida registrada con éxito" });

    } else {
      /** YA TIENE ENTRADA Y SALIDA **/
      await db.query("ROLLBACK");
      return NextResponse.json({ message: "Ya se completó el registro de hoy" }, { status: 400 });
    }

  } catch (error) {
    console.error(error); // Útil para debug
    if (db) await db.query("ROLLBACK");
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


