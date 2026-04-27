import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        
        const [rows]: any = await db.query(
            `SELECT id, date, student_id, entry_time, exit_time, observation FROM attendance_records
             ORDER BY date DESC`
        );

        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}