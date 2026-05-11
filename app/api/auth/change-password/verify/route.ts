import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

interface JwtPayload {
  id: string;
  role: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Leer cookie JWT (Next 15 compatible)
    const cookieStore = await cookies();
    const token = cookieStore.get("miTokenName")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // 2. Validar JWT
    let decoded: JwtPayload;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    // 3. Body
    const { code, new_password } = await req.json();

    if (!code || !new_password) {
      return NextResponse.json(
        { message: "Código y nueva contraseña son requeridos" },
        { status: 400 }
      );
    }

    if (new_password.length < 8) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    // 4. Buscar TODOS los códigos válidos del usuario
    const [rows]: any = await db.query(
      `SELECT id, token
       FROM user_invites
       WHERE user_id = ?
         AND used = false
         AND expires_at > NOW()
       ORDER BY id DESC`,
      [decoded.id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "Código expirado o inválido. Solicita uno nuevo." },
        { status: 400 }
      );
    }

    // 5. Buscar match del código ingresado
    let validInvite: any = null;

    for (const row of rows) {
      const match = await bcrypt.compare(String(code), row.token);
      if (match) {
        validInvite = row;
        break;
      }
    }

    if (!validInvite) {
      return NextResponse.json(
        { message: "Código incorrecto" },
        { status: 400 }
      );
    }

    // 6. Hash nueva contraseña
    const hashedPassword = await bcrypt.hash(new_password, 12);

    // 7. Actualizar password
    await db.query(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, decoded.id]
    );

    // 8. Marcar código como usado
    await db.query(
      `UPDATE user_invites SET used = true WHERE id = ?`,
      [validInvite.id]
    );

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}