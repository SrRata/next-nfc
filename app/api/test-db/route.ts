import { db } from "@/lib/hooks/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT 1 AS test");

    return Response.json({
      success: true,
      message: "Conexión exitosa",
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error al conectar con la base de datos",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
