import { db } from "@/lib/hooks/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/schedules
export async function GET() {
  try {
    const [rows]: any = await db.query(
      `SELECT
         sc.id,
         sc.entry_time,
         sc.exit_time,
         sc.entry_tolerance,
         sc.exit_tolerance,
         el.id   AS educational_level_id,
         el.color AS educational_level_color,
         el.name AS educational_level_name,
         s.id    AS section_id,
         s.color AS section_color,
         s.name  AS section_name
       FROM schedules sc
       JOIN educational_levels el ON el.id = sc.educational_level_id
       JOIN sections s            ON s.id  = sc.section_id
       ORDER BY el.name ASC, s.name ASC`
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST /api/schedules
export async function POST(req: NextRequest) {
  const conn = await db.getConnection();
  try {
    const {
      educational_level_id,
      section_id,
      entry_time,
      exit_time,
      entry_tolerance = 10,
      exit_tolerance = 20,
    } = await req.json();

    // Validaciones
    if (!educational_level_id || !section_id || !entry_time || !exit_time) {
      return NextResponse.json(
        {
          error: "Los campos educational_level_id, section_id, entry_time y exit_time son requeridos",
        },
        { status: 400 }
      );
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(entry_time) || !timeRegex.test(exit_time)) {
      return NextResponse.json(
        { error: "El formato de hora debe ser HH:MM:SS" },
        { status: 400 }
      );
    }

    if (entry_time >= exit_time) {
      return NextResponse.json(
        { error: "La hora de entrada debe ser menor a la hora de salida" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    // Verificar que el nivel y sección existen y están activos
    const [level]: any = await conn.query(
      `SELECT id FROM educational_levels WHERE id = ? AND is_active = TRUE`,
      [educational_level_id]
    );

    if (!level.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "El nivel educativo no existe o está inactivo" },
        { status: 404 }
      );
    }

    const [section]: any = await conn.query(
      `SELECT id FROM sections WHERE id = ? AND is_active = TRUE`,
      [section_id]
    );

    if (!section.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "La sección no existe o está inactiva" },
        { status: 404 }
      );
    }

    const [result]: any = await conn.query(
      `INSERT INTO schedules
         (educational_level_id, section_id, entry_time, exit_time, entry_tolerance, exit_tolerance)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [educational_level_id, section_id, entry_time, exit_time, entry_tolerance, exit_tolerance]
    );

    await conn.commit();

    return NextResponse.json(
      {
        success: true,
        message: "Horario creado correctamente",
        data: {
          id: result.insertId,
          educational_level_id,
          section_id,
          entry_time,
          exit_time,
          entry_tolerance,
          exit_tolerance,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    await conn.rollback();
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Ya existe un horario para ese nivel y sección" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    conn.release();
  }
}