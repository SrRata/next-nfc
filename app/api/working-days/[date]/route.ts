import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth/middleware";

// GET /api/working-days/:date — detalle de un feriado
export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, date, reason FROM working_days WHERE date = ?`,
      [params.date]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "No hay feriado registrado para esa fecha" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE /api/working-days/:date — eliminar feriado (restaurar día como laborable)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Solo administradores pueden gestionar días laborables" },
      { status: 403 }
    );
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id FROM working_days WHERE date = ?`,
      [params.date]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "No hay feriado registrado para esa fecha" },
        { status: 404 }
      );
    }

    await conn.query(
      `DELETE FROM working_days WHERE date = ?`,
      [params.date]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: `Feriado del ${params.date} eliminado. El día vuelve a ser laborable.`,
    });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    conn.release();
  }
}