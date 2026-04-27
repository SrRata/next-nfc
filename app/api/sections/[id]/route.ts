import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/sections/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  
  const {id} = await params;
  
  try {
    const [rows]: any = await db.query(
      `SELECT id, name, is_active FROM sections WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PUT /api/sections/:id
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  
  const {id} = await params;
  
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
      `SELECT id FROM sections WHERE id = ?`,
      [id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
    }

    await conn.query(
      `UPDATE sections SET name = ?, is_active = ? WHERE id = ?`,
      [name.trim(), is_active ?? true, id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Sección actualizada correctamente",
      data: { id: Number(id), name: name.trim(), is_active: is_active ?? true },
    });
  } catch (error: any) {
    await conn.rollback();
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Ya existe una sección con ese nombre" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    conn.release();
  }
}

// // DELETE /api/sections/:id

export async function DELETE
  (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
  const conn = await db.getConnection();
  try {

    const { id } = await params;

    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id, is_active FROM sections WHERE id = ?`,
      [id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
    }

    if (!existing[0].is_active) {
      await conn.rollback();
      return NextResponse.json(
        { error: "La sección ya está desactivada" },
        { status: 409 }
      );
    }

    await conn.query(
      `UPDATE sections SET is_active = FALSE WHERE id = ?`,
      [id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Sección desactivada correctamente",
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    conn.release();
  }
}
