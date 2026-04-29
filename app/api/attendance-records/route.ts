import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const [rows]: any = await db.query(`
            SELECT
                -- Attendance
                ar.id,
                ar.date,
                ar.entry_time,
                ar.exit_time,
                ar.observation,

                -- Student
                s.id AS student_id,
                s.first_name AS student_first_name,
                s.last_name AS student_last_name,
                s.cdl,
                s.email,
                s.phone_number,
                s.nfc_uid,
                s.is_active AS student_is_active,

                -- Course
                c.id AS course_id,
                c.course_name,

                -- Section
                sec.id AS section_id,
                sec.name AS section_name,

                -- Educational Level
                el.id AS educational_level_id,
                el.name AS educational_level_name

            FROM attendance_records ar

            INNER JOIN students s
                ON ar.student_id = s.id

            LEFT JOIN courses c
                ON s.course_id = c.id

            LEFT JOIN sections sec
                ON c.section_id = sec.id

            LEFT JOIN educational_levels el
                ON c.educational_level_id = el.id

            ORDER BY ar.date DESC
        `);

        return NextResponse.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}