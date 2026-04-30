import { NextRequest, NextResponse } from "next/server";
import { isForeignKeyError } from "@/lib/db.errors";
import { db } from "@/lib/hooks/db";

// GET /api/educational-levels/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;


    const [rows]: any = await db.query(
      `SELECT id, name, is_active FROM educational_levels WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Nivel educativo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PUT /api/educational-levels/:id
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  const conn = await db.getConnection();
  try {
    const { name, is_active } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "El campo 'name' es requerido" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id FROM educational_levels WHERE id = ?`,
      [id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Nivel educativo no encontrado" },
        { status: 404 }
      );
    }

    await conn.query(
      `UPDATE educational_levels SET name = ?, is_active = ? WHERE id = ?`,
      [name.trim(), is_active ?? true, id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Nivel educativo actualizado correctamente",
      data: { id: Number(id), name: name.trim(), is_active: is_active ?? true },
    });
  } catch (error: any) {
    await conn.rollback();
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Ya existe un nivel educativo con ese nombre" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    conn.release();
  }
}

// DELETE /api/educational-levels/:id → desactiva, no elimina físicamente
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id, is_active FROM educational_levels WHERE id = ?`,
      [id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Nivel educativo no encontrado" },
        { status: 404 }
      );
    }

    if (!existing[0].is_active) {
      await conn.rollback();
      return NextResponse.json(
        { error: "El nivel educativo ya está desactivado" },
        { status: 409 }
      );
    }

    // Soft delete — nunca eliminamos físicamente
    await conn.query(
      `UPDATE educational_levels SET is_active = FALSE WHERE id = ?`,
      [id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Nivel educativo desactivado correctamente",
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    conn.release();
  }
}