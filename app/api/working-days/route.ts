// import { NextRequest, NextResponse } from "next/server";
// import db from "@/lib/db";
// import { requireAdmin } from "@/lib/auth/middleware";

// // GET /api/working-days?month=2025-04
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const month = searchParams.get("month"); // "YYYY-MM"

//     let query = `SELECT id, date, is_working, reason FROM working_days`;
//     const params: any[] = [];

//     if (month) {
//       query += ` WHERE DATE_FORMAT(date, '%Y-%m') = ?`;
//       params.push(month);
//     }

//     query += ` ORDER BY date ASC`;

//     const [rows]: any = await db.query(query, params);
//     return NextResponse.json({ success: true, data: rows });
//   } catch (error) {
//     return NextResponse.json({ error: "Error interno" }, { status: 500 });
//   }
// }

// // POST /api/working-days — admin marca un día como laborable o no
// export async function POST(req: NextRequest) {
//   const admin = requireAdmin(req);
//   if (!admin) {
//     return NextResponse.json({ error: "Solo admin" }, { status: 403 });
//   }

//   const conn = await db.getConnection();
//   try {
//     const { date, is_working, reason } = await req.json();

//     if (!date) {
//       return NextResponse.json(
//         { error: "El campo date es requerido (YYYY-MM-DD)" },
//         { status: 400 }
//       );
//     }

//     await conn.beginTransaction();

//     await conn.query(
//       `INSERT INTO working_days (date, is_working, reason, created_by)
//        VALUES (?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE
//          is_working = VALUES(is_working),
//          reason     = VALUES(reason),
//          created_by = VALUES(created_by)`,
//       [date, is_working ?? true, reason ?? null, admin.id]
//     );

//     await conn.commit();

//     return NextResponse.json({
//       success: true,
//       message: `Día ${date} marcado como ${is_working ? "laborable" : "no laborable"}`,
//     });
//   } catch (error) {
//     await conn.rollback();
//     return NextResponse.json({ error: "Error interno" }, { status: 500 });
//   } finally {
//     conn.release();
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth/middleware";

// GET /api/working-days?month=YYYY-MM
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    let query = `SELECT id, date, reason, created_by FROM working_days`;
    const params: any[] = [];

    if (month) {
      query += ` WHERE DATE_FORMAT(date, '%Y-%m') = ?`;
      params.push(month);
    }

    query += ` ORDER BY date ASC`;

    const [rows]: any = await pool.query(query, params);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST /api/working-days — crear feriado
export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Solo administradores pueden gestionar días laborables" },
      { status: 403 }
    );
  }

  const conn = await pool.getConnection();
  try {
    const { date, reason } = await req.json();

    if (!date?.trim()) {
      return NextResponse.json(
        { error: "El campo date es requerido (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    if (!reason?.trim()) {
      return NextResponse.json(
        { error: "El campo reason es requerido para un feriado" },
        { status: 400 }
      );
    }

    // Validar que no sea fin de semana
    const dow = new Date(date).getUTCDay();
    if (dow === 0 || dow === 6) {
      return NextResponse.json(
        { error: "No se puede marcar un fin de semana como feriado" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO working_days (date, reason, created_by)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         reason     = VALUES(reason),
         created_by = VALUES(created_by)`,
      [date, reason.trim(), admin.id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: `Feriado registrado para el ${date}`,
      data: { date, reason: reason.trim() },
    }, { status: 201 });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    conn.release();
  }
}