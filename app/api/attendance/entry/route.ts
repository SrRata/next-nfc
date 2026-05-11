

// import { NextRequest, NextResponse } from "next/server";
// import db from "@/lib/db";
// import { getCurrentDateString, getCurrentTimeString, checkEntryStatus } from "@/lib/attendance/time.helper";
// import { isWorkingDay }   from "@/lib/attendance/working-days.helper";
// import { resolveSchedule } from "@/lib/attendance/schedule.helper";
// import { createAndSendNotification } from "@/lib/notifications/notify";

// export async function POST(req: NextRequest) {
//   const conn = await db.getConnection();
//   try {
//     const body = await req.json();
//     const { student_id, nfc_uid } = body;

//     if (!student_id && !nfc_uid) {
//       return NextResponse.json(
//         { error: "Se requiere student_id o nfc_uid" },
//         { status: 400 }
//       );
//     }

//     // ── 1. Validar día laborable ─────────────────────────────────────────────
//     const today = getCurrentDateString();

//     if (!(await isWorkingDay(today))) {
//       return NextResponse.json(
//         { error: "Hoy no es un día laborable. No se puede registrar asistencia." },
//         { status: 422 }
//       );
//     }

//     await conn.beginTransaction();

//     // ── 2. Buscar estudiante con su curso ────────────────────────────────────
//     // Ya no traemos el horario aquí — lo resolvemos aparte con resolveSchedule
//     const [students]: any = await conn.query(
//       `SELECT
//          s.id,
//          s.first_name,
//          s.last_name,
//          s.course_id,
//          c.section_id,
//          c.educational_level_id,
//          c.course_name,
//          c.professor_id
//        FROM students s
//        JOIN courses c
//          ON s.course_id = c.id
//          AND c.is_active = TRUE
//        WHERE (s.id = ? OR s.nfc_uid = ?)
//          AND s.is_active = TRUE`,
//       [student_id ?? null, nfc_uid ?? null]
//     );

//     if (!students.length) {
//       await conn.rollback();
//       return NextResponse.json(
//         { error: "Estudiante no encontrado, inactivo o sin curso asignado" },
//         { status: 404 }
//       );
//     }

//     const student = students[0];

//     // ── 3. Resolver horario (especial o base) ────────────────────────────────
//     // resolveSchedule busca primero en special_day_schedules con el score
//     // de especificidad y si no encuentra nada cae al horario base en schedules
//     const schedule = await resolveSchedule(
//       conn,
//       today,
//       student.section_id,
//       student.educational_level_id
//     );

//     if (!schedule) {
//       await conn.rollback();
//       return NextResponse.json(
//         { error: "No hay horario configurado para este curso" },
//         { status: 404 }
//       );
//     }

//     const currentTime = body.mock_time && process.env.NODE_ENV === "development"
//       ? body.mock_time
//       : getCurrentTimeString();

//     // ── 4. Verificar entrada duplicada ───────────────────────────────────────
//     const [existing]: any = await conn.query(
//       `SELECT id FROM attendance_records
//        WHERE student_id = ? AND date = ?`,
//       [student.id, today]
//     );

//     if (existing.length) {
//       await conn.rollback();
//       return NextResponse.json(
//         { error: "Ya existe un registro de entrada para hoy" },
//         { status: 409 }
//       );
//     }

//     // ── 5. Validar horario y determinar estado ───────────────────────────────
//     // checkEntryStatus recibe el schedule resuelto (puede ser especial o base)
//     // por lo que la tolerancia y horas ya son las correctas para ese día
//     const status = checkEntryStatus(currentTime, schedule);

//     if (status === "Fuera de horario") {
//       await conn.rollback();
//       return NextResponse.json(
//         { error: "Fuera del horario permitido para registrar entrada" },
//         { status: 422 }
//       );
//     }

//     // ── 6. Construir observación ─────────────────────────────────────────────
//     // Si el horario viene de special_day_schedules, lo indicamos en la observación
//     // Ejemplos:
//     //   "Puntual"
//     //   "Atrasado"
//     //   "Puntual (horario especial: Feria de ciencias)"
//     //   "Atrasado (horario especial: Día de recuperación)"
//     const observation = schedule.is_special
//       ? `${status} (horario especial: ${schedule.special_reason})`
//       : status;

//     // ── 7. Insertar registro de asistencia ───────────────────────────────────
//     const [result]: any = await conn.query(
//       `INSERT INTO attendance_records (date, student_id, entry_time, observation)
//        VALUES (?, ?, ?, ?)`,
//       [today, student.id, currentTime, observation]
//     );

//     // ── 8. Actualizar resumen del estudiante ─────────────────────────────────
//     await conn.query(
//       `INSERT INTO student_summaries (student_id, total_attendances, total_absences)
//        VALUES (?, 1, 0)
//        ON DUPLICATE KEY UPDATE
//          total_attendances = total_attendances + 1`,
//       [student.id]
//     );

//     // ── 9. Actualizar resumen diario del curso ───────────────────────────────
//     const isLate = status === "Atrasado";
//     await conn.query(
//       `INSERT INTO daily_course_summaries
//          (date, course_id, section_id, total_present, total_absent, total_late)
//        VALUES (?, ?, ?, 1, 0, ?)
//        ON DUPLICATE KEY UPDATE
//          total_present = total_present + 1,
//          total_late    = total_late + ?`,
//       [today, student.course_id, student.section_id, isLate ? 1 : 0, isLate ? 1 : 0]
//     );

//     // ── 10. Obtener representante para notificación ──────────────────────────
//     const [rel]: any = await conn.query(
//       `SELECT parent_id FROM relationships WHERE student_id = ? LIMIT 1`,
//       [student.id]
//     );

//     // ── 11. Crear y enviar notificación ──────────────────────────────────────
//     await createAndSendNotification({
//       conn,
//       type:        "entry",
//       studentId:   student.id,
//       studentName: `${student.first_name} ${student.last_name}`,
//       courseName:  student.course_name,
//       courseId:    student.course_id,
//       professorId: student.professor_id ?? null,
//       parentId:    rel[0]?.parent_id ?? null,
//       time:        currentTime,
//     });

//     await conn.commit();

//     return NextResponse.json({
//       success: true,
//       message: `Entrada registrada: ${status}`,
//       data: {
//         record_id:  result.insertId,
//         student:    `${student.first_name} ${student.last_name}`,
//         entry_time: currentTime,
//         status,
//         // Informamos al cliente si se usó un horario especial
//         schedule_type:   schedule.is_special ? "special" : "base",
//         schedule_reason: schedule.is_special ? schedule.special_reason : null,
//       },
//     });

//   } catch (error) {
//     await conn.rollback();
//     console.error("Error en registro de entrada:", error);
//     return NextResponse.json(
//       { error: "Error interno del servidor" },
//       { status: 500 }
//     );
//   } finally {
//     conn.release();
//   }
// }

















import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentDateString, getCurrentTimeString, checkEntryStatus } from "@/lib/attendance/time.helper";
import { isWorkingDay } from "@/lib/attendance/working-days.helper";
import { resolveSchedule } from "@/lib/attendance/schedule.helper";
import { createAndSendNotification } from "@/lib/notifications/notify";
import { normalizePhone, sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  const conn = await db.getConnection();
  try {
    const body = await req.json();
    const { student_id, nfc_uid } = body;

    if (!student_id && !nfc_uid) {
      return NextResponse.json(
        { error: "Se requiere student_id o nfc_uid" },
        { status: 400 }
      );
    }

    // ── 1. Validar día laborable ─────────────────────────────────────────────
    const today = getCurrentDateString();

    if (!(await isWorkingDay(today))) {
      return NextResponse.json(
        { error: "Hoy no es un día laborable. No se puede registrar asistencia." },
        { status: 422 }
      );
    }

    await conn.beginTransaction();

    // ── 2. Buscar estudiante con su curso ────────────────────────────────────
    // Ya no traemos el horario aquí — lo resolvemos aparte con resolveSchedule
    const [students]: any = await conn.query(
      `SELECT
         s.id,
         s.first_name,
         s.last_name,
         s.course_id,
         c.section_id,
         c.educational_level_id,
         c.course_name,
         c.professor_id
       FROM students s
       JOIN courses c
         ON s.course_id = c.id
         AND c.is_active = TRUE
       WHERE (s.id = ? OR s.nfc_uid = ?)
         AND s.is_active = TRUE`,
      [student_id ?? null, nfc_uid ?? null]
    );

    if (!students.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Estudiante no encontrado, inactivo o sin curso asignado" },
        { status: 404 }
      );
    }

    const student = students[0];

    // ── 3. Resolver horario (especial o base) ────────────────────────────────
    // resolveSchedule busca primero en special_day_schedules con el score
    // de especificidad y si no encuentra nada cae al horario base en schedules
    const schedule = await resolveSchedule(
      conn,
      today,
      student.section_id,
      student.educational_level_id
    );

    if (!schedule) {
      await conn.rollback();
      return NextResponse.json(
        { error: "No hay horario configurado para este curso" },
        { status: 404 }
      );
    }

    const currentTime = body.mock_time && process.env.NODE_ENV === "development"
      ? body.mock_time
      : getCurrentTimeString();

    // ── 4. Verificar entrada duplicada ───────────────────────────────────────
    const [existing]: any = await conn.query(
      `SELECT id FROM attendance_records
       WHERE student_id = ? AND date = ?`,
      [student.id, today]
    );

    if (existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Ya existe un registro de entrada para hoy" },
        { status: 409 }
      );
    }

    // ── 5. Validar horario y determinar estado ───────────────────────────────
    // checkEntryStatus recibe el schedule resuelto (puede ser especial o base)
    // por lo que la tolerancia y horas ya son las correctas para ese día
    const status = checkEntryStatus(currentTime, schedule);

    if (status === "Fuera de horario") {
      await conn.rollback();
      return NextResponse.json(
        { error: "Fuera del horario permitido para registrar entrada" },
        { status: 422 }
      );
    }

    // ── 6. Construir observación ─────────────────────────────────────────────
    // Si el horario viene de special_day_schedules, lo indicamos en la observación
    // Ejemplos:
    //   "Puntual"
    //   "Atrasado"
    //   "Puntual (horario especial: Feria de ciencias)"
    //   "Atrasado (horario especial: Día de recuperación)"
    const observation = schedule.is_special
      ? `${status} (horario especial: ${schedule.special_reason})`
      : status;

    // ── 7. Insertar registro de asistencia ───────────────────────────────────
    const [insertResult]: any = await conn.query(
      `INSERT INTO attendance_records (date, student_id, entry_time, observation)
   VALUES (?, ?, ?, ?)`,
      [today, student.id, currentTime, observation]
    );



    // ── 8. Actualizar resumen del estudiante ─────────────────────────────────
    await conn.query(
      `INSERT INTO student_summaries (student_id, total_attendances, total_absences)
       VALUES (?, 1, 0)
       ON DUPLICATE KEY UPDATE
         total_attendances = total_attendances + 1`,
      [student.id]
    );

    // ── 9. Actualizar resumen diario del curso ───────────────────────────────
    const isLate = status === "Atrasado";
    await conn.query(
      `INSERT INTO daily_course_summaries
         (date, course_id, section_id, total_present, total_absent, total_late)
       VALUES (?, ?, ?, 1, 0, ?)
       ON DUPLICATE KEY UPDATE
         total_present = total_present + 1,
         total_late    = total_late + ?`,
      [today, student.course_id, student.section_id, isLate ? 1 : 0, isLate ? 1 : 0]
    );

    // ── 10. Obtener representante para notificación ──────────────────────────
    const [rel]: any = await conn.query(
      `SELECT parent_id FROM relationships WHERE student_id = ? LIMIT 1`,
      [student.id]
    );

    let parentPhone = null;
    let parentName = null;

    if (rel.length) {
      const [parent]: any = await conn.query(
        `SELECT phone_number, first_name 
     FROM users 
     WHERE id = ? 
     LIMIT 1`,
        [rel[0].parent_id]
      );

      parentPhone = parent[0]?.phone_number;
      parentName = parent[0]?.first_name;
    }

    // ── 11. Crear y enviar notificación ──────────────────────────────────────
    await createAndSendNotification({
      conn,
      type: "entry",
      studentId: student.id,
      studentName: `${student.first_name} ${student.last_name}`,
      courseName: student.course_name,
      courseId: student.course_id,
      professorId: student.professor_id ?? null,
      parentId: rel[0]?.parent_id ?? null,
      time: currentTime,
    });

    setImmediate(async () => {
      try {
        if (parentPhone) {
          const normalizedPhone = normalizePhone(parentPhone);

          const result = await sendWhatsAppMessage(
            normalizedPhone,
            `📢 Registro de asistencia\n\n` +
            `Hola ${parentName ?? "padre/madre"} 👋\n\n` +
            `Tu hijo ${student.first_name} ${student.last_name} ingresó a clases.\n\n` +
            `🕒 Hora: ${currentTime}\n` +
            `📚 Curso: ${student.course_name}\n` +
            `📌 Estado: ${status}`
          );

          if (!result.success) {
            console.error("Error enviando WhatsApp:", result.error);
          }
        }
      } catch (err) {
        console.error("WhatsApp error:", err);
      }
    });

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: `Entrada registrada: ${status}`,
      data: {
        record_id: insertResult.insertId,
        student: `${student.first_name} ${student.last_name}`,
        entry_time: currentTime,
        status,
        // Informamos al cliente si se usó un horario especial
        schedule_type: schedule.is_special ? "special" : "base",
        schedule_reason: schedule.is_special ? schedule.special_reason : null,
      },
    });

  } catch (error) {
    await conn.rollback();
    console.error("Error en registro de entrada:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}