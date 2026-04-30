import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/middleware";

// GET /api/special-schedules?month=YYYY-MM
// Retorna todos los horarios especiales del mes con sus variaciones
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const date  = searchParams.get("date");   // opcional: filtrar por día exacto

    let query = `
      SELECT
        sds.id,
        sds.date,
        sds.entry_time,
        sds.exit_time,
        sds.entry_tolerance,
        sds.exit_tolerance,
        sds.reason,
        sds.created_at,
        s.id    AS section_id,
        s.name  AS section_name,
        el.id   AS educational_level_id,
        el.name AS educational_level_name
      FROM special_day_schedules sds
      LEFT JOIN sections s
        ON s.id = sds.section_id
      LEFT JOIN educational_levels el
        ON el.id = sds.educational_level_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (month) {
      query += ` AND DATE_FORMAT(sds.date, '%Y-%m') = ?`;
      params.push(month);
    }

    if (date) {
      query += ` AND sds.date = ?`;
      params.push(date);
    }

    query += ` ORDER BY sds.date ASC, sds.id ASC`;

    const [rows]: any = await db.query(query, params);

    // Agrupar por fecha para facilitar el uso en el calendario
    const grouped = rows.reduce((acc: any, row: any) => {
      if (!acc[row.date]) acc[row.date] = [];
      acc[row.date].push({
        id:                     row.id,
        entry_time:             row.entry_time,
        exit_time:              row.exit_time,
        entry_tolerance:        row.entry_tolerance,
        exit_tolerance:         row.exit_tolerance,
        reason:                 row.reason,
        section_id:             row.section_id,
        section_name:           row.section_name ?? "Todas las secciones",
        educational_level_id:   row.educational_level_id,
        educational_level_name: row.educational_level_name ?? "Todos los niveles",
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST /api/special-schedules — crear horario especial
export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const conn = await db.getConnection();
  try {
    const {
      date,
      section_id           = null,
      educational_level_id = null,
      entry_time,
      exit_time,
      entry_tolerance      = 10,
      exit_tolerance       = 20,
      reason,
    } = await req.json();

    // Validaciones
    if (!date?.trim() || !entry_time || !exit_time || !reason?.trim()) {
      return NextResponse.json(
        { error: "Los campos date, entry_time, exit_time y reason son requeridos" },
        { status: 400 }
      );
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(entry_time) || !timeRegex.test(exit_time)) {
      return NextResponse.json(
        { error: "Formato de hora inválido. Usar HH:MM:SS" },
        { status: 400 }
      );
    }

    if (entry_time >= exit_time) {
      return NextResponse.json(
        { error: "La hora de entrada debe ser menor a la de salida" },
        { status: 400 }
      );
    }

    // Validar que no sea feriado (no tendría sentido un horario especial en feriado)
    const [holiday]: any = await db.query(
      `SELECT id FROM working_days WHERE date = ?`, [date]
    );
    if (holiday.length) {
      return NextResponse.json(
        { error: "No puedes crear un horario especial en un día marcado como feriado" },
        { status: 409 }
      );
    }

    // Validar que section_id y educational_level_id existen si se envían
    if (section_id) {
      const [sec]: any = await conn.query(
        `SELECT id FROM sections WHERE id = ? AND is_active = TRUE`,
        [section_id]
      );
      if (!sec.length) {
        await conn.rollback();
        return NextResponse.json(
          { error: "Sección no encontrada o inactiva" },
          { status: 404 }
        );
      }
    }

    if (educational_level_id) {
      const [lev]: any = await conn.query(
        `SELECT id FROM educational_levels WHERE id = ? AND is_active = TRUE`,
        [educational_level_id]
      );
      if (!lev.length) {
        await conn.rollback();
        return NextResponse.json(
          { error: "Nivel educativo no encontrado o inactivo" },
          { status: 404 }
        );
      }
    }

    await conn.beginTransaction();

    const [result]: any = await conn.query(
      `INSERT INTO special_day_schedules
         (date, section_id, educational_level_id, entry_time, exit_time,
          entry_tolerance, exit_tolerance, reason, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         entry_time      = VALUES(entry_time),
         exit_time       = VALUES(exit_time),
         entry_tolerance = VALUES(entry_tolerance),
         exit_tolerance  = VALUES(exit_tolerance),
         reason          = VALUES(reason),
         created_by      = VALUES(created_by)`,
      [
        date, section_id, educational_level_id,
        entry_time, exit_time,
        entry_tolerance, exit_tolerance,
        reason.trim(), admin.id,
      ]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Horario especial guardado correctamente",
      data: { id: result.insertId, date, section_id, educational_level_id, entry_time, exit_time, reason },
    }, { status: 201 });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    conn.release();
  }
}