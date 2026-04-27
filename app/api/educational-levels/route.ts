import { NextRequest, NextResponse } from "next/server";
import { isForeignKeyError } from "@/lib/db.errors";
import { db } from "@/lib/hooks/db";

// GET /api/educational-levels
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get("active") !== "false";

    const [rows]: any = await db.query(
      `SELECT id, name, is_active FROM educational_levels
       ${onlyActive ? "WHERE is_active = TRUE" : ""}
       ORDER BY name ASC`
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST /api/educational-levels
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
      `INSERT INTO educational_levels (name, is_active) VALUES (?, TRUE)`,
      [name.trim()]
    );

    await conn.commit();

    return NextResponse.json(
      {
        success: true,
        message: "Nivel educativo creado correctamente",
        data: { id: result.insertId, name: name.trim(), is_active: true },
      },
      { status: 201 }
    );
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