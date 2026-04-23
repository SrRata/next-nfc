import { NextResponse } from "next/server";
import { db } from "@/lib/hooks/db"; // Ajusta la ruta a tu archivo de conexión

// export async function GET() {
//   try {
//     const [rows] = await db.query(
//       "SELECT id, title, description, start_date as start, end_date as end, color_hex as backgroundColor FROM calendar_event"
//     );
//     return NextResponse.json(rows);
//   } catch (error) {
//     return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 });
//   }
// }


export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.id, e.title, e.start_date as start, e.end_date as end, 
        e.color_hex as backgroundColor, e.event_type,
        e.education_level_id, e.custom_entry_time, e.custom_exit_time,
        l.name as level_name
      FROM calendar_event e
      LEFT JOIN education_levels l ON e.education_level_id = l.id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 });
  }
}


// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     // FullCalendar envía start y end en formato ISO 8601 (ej: 2023-10-27T10:30:00)
//     const { title, start, end, backgroundColor } = body;

//     const [result] = await db.query(
//       "INSERT INTO calendar_event (title, start_date, end_date, color_hex, event_type) VALUES (?, ?, ?, ?, ?)",
//       [title, start, end, backgroundColor, 'evento_especial']
//     );

//     // Es vital devolver el ID que generó la base de datos
//     return NextResponse.json({ 
//       id: (result as any).insertId, 
//       title, 
//       start, 
//       end, 
//       backgroundColor 
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
//   }
// }


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title, start, end, backgroundColor,
      event_type, education_level_id,
      custom_entry_time, custom_exit_time
    } = body;

    const [result] = await db.query(
      `INSERT INTO calendar_event 
       (title, start_date, end_date, color_hex, event_type, education_level_id, custom_entry_time, custom_exit_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, start, end, backgroundColor,
        event_type,
        education_level_id || null, // NULL si es para todos
        custom_entry_time || null,
        custom_exit_time || null
      ]
    );

    return NextResponse.json({ id: (result as any).insertId, ...body });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await db.query("DELETE FROM calendar_event WHERE id = ?", [id]);
    return NextResponse.json({ message: "Evento eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar evento" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, start, end, backgroundColor, event_type } = body;

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await db.query(
      "UPDATE calendar_event SET title = ?, start_date = ?, end_date = ?, color_hex = ?, event_type = ? WHERE id = ?",
      [title, start, end, backgroundColor, event_type || 'evento_especial', id]
    );

    return NextResponse.json({ message: "Evento actualizado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
