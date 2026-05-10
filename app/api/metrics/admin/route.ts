// app/api/dashboard/stats/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows]: any = await db.query<any[]>(`
      SELECT

        -- Total estudiantes
        (
          SELECT COUNT(*)
          FROM students
          WHERE is_active = TRUE
        ) AS total_students,

        -- Total cursos
        (
          SELECT COUNT(*)
          FROM courses
          WHERE is_active = TRUE
        ) AS total_courses,

        -- Total usuarios
        (
          SELECT COUNT(*)
          FROM users
          WHERE is_active = TRUE
        ) AS total_users,

        -- Total profesores
        (
          SELECT COUNT(*)
          FROM users
          WHERE role = 'profesor'
          AND is_active = TRUE
        ) AS total_professors,

        -- Estudiantes sin representante
        (
          SELECT COUNT(*)
          FROM students s
          LEFT JOIN relationships r
            ON r.student_id = s.id
          WHERE r.id IS NULL
          AND s.is_active = TRUE
        ) AS students_without_parent,

        -- Estudiantes con tarjeta NFC asignada
        (
          SELECT COUNT(*)
          FROM students
          WHERE nfc_uid IS NOT NULL
          AND nfc_uid != ''
          AND is_active = TRUE
        ) AS students_with_nfc,

        -- Total administradores
        (
          SELECT COUNT(*)
          FROM users
          WHERE role = 'admin'
          AND is_active = TRUE
        ) AS total_admins,

        -- Total representantes
        (
          SELECT COUNT(*)
          FROM users
          WHERE role = 'usuario'
          AND is_active = TRUE
        ) AS total_parents,

        -- Cursos sin profesor asignado
        (
          SELECT COUNT(*)
          FROM courses
          WHERE professor_id IS NULL
          AND is_active = TRUE
        ) AS courses_without_professor,

        -- Estudiantes con curso asignado
        (
          SELECT COUNT(*)
          FROM students
          WHERE course_id IS NOT NULL
          AND is_active = TRUE
        ) AS students_with_course
    `);

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo estadísticas",
      },
      { status: 500 }
    );
  }
}