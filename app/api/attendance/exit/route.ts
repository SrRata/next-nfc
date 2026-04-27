// import { NextRequest, NextResponse } from "next/server";
// import {
//   getCurrentDateString,
//   getCurrentTimeString,
//   isValidExitTime,
// } from "@/lib/attendance/time.helper";
// import { db } from "@/lib/hooks/db";
// import { isWorkingDay } from "@/lib/attendance/working-days.helper";

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

//     const today = getCurrentDateString();

//     const workingDay = await isWorkingDay(today);
//     if (!workingDay) {
//       return NextResponse.json(
//         { error: "Hoy no es un día laborable. No se puede registrar asistencia." },
//         { status: 422 }
//       );
//     }

//     await conn.beginTransaction();

//     // 1. Buscar estudiante + curso + horario en un solo JOIN
//     const [students]: any = await conn.query(
//       `SELECT
//          s.id,
//          s.first_name,
//          s.last_name,
//          c.educational_level_id,
//          c.section_id,
//          sc.exit_time,
//          sc.exit_tolerance
//        FROM students s
//        JOIN courses c
//          ON s.course_id = c.id
//          AND c.is_active = TRUE
//        JOIN schedules sc
//          ON sc.educational_level_id = c.educational_level_id
//         AND sc.section_id = c.section_id
//        WHERE (s.id = ? OR s.nfc_uid = ?)
//          AND s.is_active = TRUE`,
//       [student_id ?? null, nfc_uid ?? null]
//     );

//     if (!students.length) {
//       await conn.rollback();
//       return NextResponse.json(
//         { error: "Estudiante no encontrado, inactivo o sin horario asignado" },
//         { status: 404 }
//       );
//     }

//     const student = students[0];
//     // const currentTime = getCurrentTimeString();
//     //reemplazar getCurrentTimeString() por esto durante pruebas:
//     const currentTime = body.mock_time ?? getCurrentTimeString();

//     // 2. Buscar registro de entrada de hoy
//     const [records]: any = await conn.query(
//       `SELECT id, entry_time, exit_time
//        FROM attendance_records
//        WHERE student_id = ? AND date = ?`,
//       [student.id, today]
//     );

//     if (!records.length) {
//       await conn.rollback();
//       return NextResponse.json(
//         { error: "No hay registro de entrada para hoy" },
//         { status: 404 }
//       );
//     }

//     const record = records[0];

//     if (record.exit_time) {
//       await conn.rollback();
//       return NextResponse.json(
//         { error: "La salida ya fue registrada hoy" },
//         { status: 409 }
//       );
//     }

//     // 3. Validar ventana de tiempo para salida
//     if (!isValidExitTime(currentTime, {
//       exit_time: student.exit_time,
//       exit_tolerance: student.exit_tolerance,
//     })) {
//       await conn.rollback();
//       return NextResponse.json(
//         {
//           error: `Hora de salida no válida. Permitida desde las ${student.exit_time} con ${student.exit_tolerance} min de tolerancia`,
//         },
//         { status: 422 }
//       );
//     }

//     // --- Escrituras ---

//     // 4. Registrar hora de salida
//     await conn.query(
//       `UPDATE attendance_records SET exit_time = ? WHERE id = ?`,
//       [currentTime, record.id]
//     );

//     await conn.commit();

//     return NextResponse.json({
//       success: true,
//       message: "Salida registrada correctamente",
//       data: {
//         student: `${student.first_name} ${student.last_name}`,
//         entry_time: record.entry_time,
//         exit_time: currentTime,
//       },
//     });

//   } catch (error) {
//     await conn.rollback();
//     console.error("Error en registro de salida:", error);
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
import { getCurrentDateString, getCurrentTimeString, isValidExitTime } from "@/lib/attendance/time.helper";
import { isWorkingDay } from "@/lib/attendance/working-days.helper";
import { resolveSchedule } from "@/lib/attendance/schedule.helper";
import { createAndSendNotification } from "@/lib/notifications/notify";

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
        { error: "Hoy no es un día laborable." },
        { status: 422 }
      );
    }

    await conn.beginTransaction();

    // ── 2. Buscar estudiante con su curso ────────────────────────────────────
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

    // ── 3. Buscar registro de entrada de hoy ─────────────────────────────────
    const [records]: any = await conn.query(
      `SELECT id, entry_time, exit_time
       FROM attendance_records
       WHERE student_id = ? AND date = ?`,
      [student.id, today]
    );

    if (!records.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "No hay registro de entrada para hoy" },
        { status: 404 }
      );
    }

    const record = records[0];

    if (record.exit_time) {
      await conn.rollback();
      return NextResponse.json(
        { error: "La salida ya fue registrada hoy" },
        { status: 409 }
      );
    }

    // ── 4. Resolver horario del día ──────────────────────────────────────────
    // Importante: usamos el mismo resolveSchedule que en entry
    // Si ese día tenía horario especial, la salida también lo respeta
    // Ejemplo: si la salida especial era a las 12:00 (en vez de las 17:00),
    // la ventana de salida válida será 12:00 ± exit_tolerance
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

    // ── 5. Validar ventana de salida ─────────────────────────────────────────
    // isValidExitTime usa schedule.exit_time y schedule.exit_tolerance
    // que ya vienen resueltos correctamente (especial o base)
    if (!isValidExitTime(currentTime, schedule)) {
      await conn.rollback();
      return NextResponse.json(
        {
          error: `Hora de salida no válida. Permitida desde las ${schedule.exit_time} con ${schedule.exit_tolerance} min de tolerancia`,
          schedule_type: schedule.is_special ? "special" : "base",
        },
        { status: 422 }
      );
    }

    // ── 6. Registrar salida ──────────────────────────────────────────────────
    await conn.query(
      `UPDATE attendance_records SET exit_time = ? WHERE id = ?`,
      [currentTime, record.id]
    );

    // ── 7. Obtener representante para notificación ───────────────────────────
    const [rel]: any = await conn.query(
      `SELECT parent_id FROM relationships WHERE student_id = ? LIMIT 1`,
      [student.id]
    );

    // ── 8. Crear y enviar notificación ───────────────────────────────────────
    await createAndSendNotification({
      conn,
      type: "exit",
      studentId: student.id,
      studentName: `${student.first_name} ${student.last_name}`,
      courseName: student.course_name,
      courseId: student.course_id,
      professorId: student.professor_id ?? null,
      parentId: rel[0]?.parent_id ?? null,
      time: currentTime,
    });

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Salida registrada correctamente",
      data: {
        student: `${student.first_name} ${student.last_name}`,
        entry_time: record.entry_time,
        exit_time: currentTime,
        // Informamos si se usó horario especial
        schedule_type: schedule.is_special ? "special" : "base",
        schedule_reason: schedule.is_special ? schedule.special_reason : null,
      },
    });

  } catch (error) {
    await conn.rollback();
    console.error("Error en registro de salida:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}