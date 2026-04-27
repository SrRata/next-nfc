import { db } from "@/lib/hooks/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/sections
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get("active") !== "false";

    const [rows]: any = await db.query(
      `SELECT id, name, is_active FROM sections
       ${onlyActive ? "WHERE is_active = TRUE" : ""}
       ORDER BY name ASC`
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST /api/sections
export async function POST(req: NextRequest) {
  const conn = await db.getConnection();
  try {
    const { name } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "El campo 'name' es requerido" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    const [result]: any = await conn.query(
      `INSERT INTO sections (name, is_active) VALUES (?, TRUE)`,
      [name.trim()]
    );

    await conn.commit();

    return NextResponse.json(
      {
        success: true,
        message: "Sección creada correctamente",
        data: { id: result.insertId, name: name.trim(), is_active: true },
      },
      { status: 201 }
    );
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












export async function DELETE(req: NextRequest) {
  const conn = await db.getConnection();

  try {
    const body = await req.json();
    console.log("BODY:", body);

    const id = Number(body.id);

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [existing]: any = await conn.query(
      `SELECT id, is_active FROM sections WHERE id = ?`,
      [id]
    );

    console.log("RESULTADO:", existing);

    if (!existing.length) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: existing });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    conn.release();
  }
}