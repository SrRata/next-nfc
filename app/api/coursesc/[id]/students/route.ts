import { db } from "@/lib/hooks/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses/:id/students
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const {id} = await params 

    try {
        // Verificar que el curso existe
        const [course]: any = await db.query(
            `SELECT id FROM courses WHERE id = ? AND is_active = TRUE`,
            [id]
        );

        if (!course.length) {
            return NextResponse.json(
                { error: "Curso no encontrado o inactivo" },
                { status: 404 }
            );
        }

        const [students]: any = await db.query(
            `SELECT
         s.id,
         s.first_name,
         s.last_name,
         s.cdl,
         s.email,
         s.phone_number,
         s.nfc_uid,
         s.is_active,
         ss.total_attendances,
         ss.total_absences,
         -- Representante del estudiante
         u.id                                    AS parent_id,
         CONCAT(u.first_name, ' ', u.last_name)  AS parent_name,
         u.phone_number                           AS parent_phone
       FROM students s
       LEFT JOIN student_summaries ss ON ss.student_id = s.id
       LEFT JOIN relationships r      ON r.student_id  = s.id
       LEFT JOIN users u              ON u.id           = r.parent_id
       WHERE s.course_id = ? AND s.is_active = TRUE
       ORDER BY s.last_name ASC, s.first_name ASC`,
            [id]
        );

        return NextResponse.json({ success: true, data: students });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}