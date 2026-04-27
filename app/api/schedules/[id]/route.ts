import { isForeignKeyError } from "@/lib/db.errors";
import { db } from "@/lib/hooks/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/schedules/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows]: any = await db.query(
      `SELECT
         sc.id,
         sc.entry_time,
         sc.exit_time,
         sc.entry_tolerance,
         sc.exit_tolerance,
         el.id   AS educational_level_id,
         el.name AS educational_level_name,
         s.id    AS section_id,
         s.name  AS section_name
       FROM schedules sc
       JOIN educational_levels el ON el.id = sc.educational_level_id
       JOIN sections s            ON s.id  = sc.section_id
       WHERE sc.id = ?`,
      [params.id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Horario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PUT /api/schedules/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const conn = await db.getConnection();
  try {
    const {
      educational_level_id,
      section_id,
      entry_time,
      exit_time,
      entry_tolerance,
      exit_tolerance,
    } = await req.json();

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

    const [existing]: any = await conn.query(
      `SELECT id FROM schedules WHERE id = ?`,
      [params.id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json({ error: "Horario no encontrado" }, { status: 404 });
    }

    await conn.query(
      `UPDATE schedules SET
         educational_level_id = ?,
         section_id           = ?,
         entry_time           = ?,
         exit_time            = ?,
         entry_tolerance      = ?,
         exit_tolerance       = ?
       WHERE id = ?`,
      [
        educational_level_id,
        section_id,
        entry_time,
        exit_time,
        entry_tolerance ?? 10,
        exit_tolerance ?? 20,
        params.id,
      ]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Horario actualizado correctamente",
      data: {
        id: Number(params.id),
        educational_level_id,
        section_id,
        entry_time,
        exit_time,
        entry_tolerance: entry_tolerance ?? 10,
        exit_tolerance: exit_tolerance ?? 20,
      },
    });
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

// DELETE /api/schedules/:id — eliminación física porque no tiene is_active
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id FROM schedules WHERE id = ?`,
      [params.id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json({ error: "Horario no encontrado" }, { status: 404 });
    }

    await conn.query(`DELETE FROM schedules WHERE id = ?`, [params.id]);

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Horario eliminado correctamente",
    });
  } catch (error: any) {
    await conn.rollback();
    if (isForeignKeyError(error)) {
      return NextResponse.json(
        { error: "No se puede eliminar el horario porque tiene cursos activos asociados" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    conn.release();
  }
}