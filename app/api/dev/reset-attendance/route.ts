import { db } from "@/lib/hooks/db";
import { NextResponse } from "next/server";

export async function POST() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "No disponible en producción" }, { status: 403 });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query(`DELETE FROM attendance_records WHERE date = CURDATE()`);
        await conn.query(`DELETE FROM daily_course_summaries WHERE date = CURDATE()`);
        await conn.query(`UPDATE student_summaries SET total_attendances = 0, total_absences = 0`);
        await conn.commit();
        return NextResponse.json({ success: true, message: "Datos de hoy eliminados" });
    } catch (error) {
        await conn.rollback();
        return NextResponse.json({ error: "Error al limpiar" }, { status: 500 });
    } finally {
        conn.release();
    }
}