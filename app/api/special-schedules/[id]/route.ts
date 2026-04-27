import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/middleware";

// PUT /api/special-schedules/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;


  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Solo administradores" }, { status: 403 });

  const conn = await db.getConnection();
  try {
    const {
      entry_time, exit_time,
      entry_tolerance = 10,
      exit_tolerance = 20,
      reason,
    } = await req.json();

    if (!entry_time || !exit_time || !reason?.trim()) {
      return NextResponse.json(
        { error: "Los campos entry_time, exit_time y reason son requeridos" },
        { status: 400 }
      );
    }

    if (entry_time >= exit_time) {
      return NextResponse.json(
        { error: "La hora de entrada debe ser menor a la de salida" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id FROM special_day_schedules WHERE id = ?`,
      [id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Horario especial no encontrado" },
        { status: 404 }
      );
    }

    await conn.query(
      `UPDATE special_day_schedules
       SET entry_time = ?, exit_time = ?,
           entry_tolerance = ?, exit_tolerance = ?,
           reason = ?
       WHERE id = ?`,
      [entry_time, exit_time, entry_tolerance, exit_tolerance, reason.trim(), id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Horario especial actualizado correctamente",
    });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    conn.release();
  }
}

// DELETE /api/special-schedules/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Solo administradores" }, { status: 403 });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id FROM special_day_schedules WHERE id = ?`,
      [id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Horario especial no encontrado" },
        { status: 404 }
      );
    }

    await conn.query(
      `DELETE FROM special_day_schedules WHERE id = ?`,
      [id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Horario especial eliminado correctamente",
    });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    conn.release();
  }
}