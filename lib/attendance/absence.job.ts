import { getCurrentDateString } from "@/lib/attendance/time.helper";
import { db } from "../hooks/db";
import { isWorkingDay } from "./working-days.helper";

export async function runAbsenceJob(): Promise<void> {

  const today = getCurrentDateString();
  const isWorking = await isWorkingDay(today);
  if (!isWorking) {
    console.log("[AbsenceJob] Hoy no es día laborable. Job cancelado.");
    return;
  }

  const conn = await db.getConnection();

  try {
    const today = getCurrentDateString();

    console.log(`[AbsenceJob] Iniciando para la fecha: ${today}`);

    await conn.beginTransaction();

    // 1. Obtener todos los cursos activos
    const [courses]: any = await conn.query(
      `SELECT id, section_id FROM courses WHERE is_active = TRUE`
    );

    if (!courses.length) {
      console.log("[AbsenceJob] No hay cursos activos. Finalizando.");
      await conn.rollback();
      return;
    }

    for (const course of courses) {
      // 2. Obtener estudiantes activos del curso SIN registro hoy
      const [absentStudents]: any = await conn.query(
        `SELECT s.id
         FROM students s
         LEFT JOIN attendance_records ar
           ON ar.student_id = s.id
           AND ar.date = ?
         WHERE s.course_id = ?
           AND s.is_active = TRUE
           AND ar.id IS NULL`,
        [today, course.id]
      );

      if (!absentStudents.length) {
        console.log(`[AbsenceJob] Curso ${course.id}: todos presentes.`);
        continue;
      }

      const absentCount = absentStudents.length;
      console.log(`[AbsenceJob] Curso ${course.id}: ${absentCount} ausente(s).`);

      // 3. Insertar registro de ausencia por cada estudiante
      for (const student of absentStudents) {
        await conn.query(
          `INSERT INTO attendance_records (date, student_id, observation)
           VALUES (?, ?, 'Ausente')`,
          [today, student.id]
        );

        // 4. Actualizar resumen del estudiante
        await conn.query(
          `INSERT INTO student_summaries (student_id, total_attendances, total_absences)
           VALUES (?, 0, 1)
           ON DUPLICATE KEY UPDATE
             total_absences = total_absences + 1`,
          [student.id]
        );
      }

      // 5. Actualizar resumen diario del curso
      await conn.query(
        `INSERT INTO daily_course_summaries
           (date, course_id, section_id, total_present, total_absent, total_late)
         VALUES (?, ?, ?, 0, ?, 0)
         ON DUPLICATE KEY UPDATE
           total_absent = total_absent + ?`,
        [today, course.id, course.section_id, absentCount, absentCount]
      );
    }

    await conn.commit();
    console.log(`[AbsenceJob] Completado exitosamente para: ${today}`);

  } catch (error) {
    await conn.rollback();
    console.error("[AbsenceJob] Error, se revirtieron los cambios:", error);
  } finally {
    conn.release();
  }
}