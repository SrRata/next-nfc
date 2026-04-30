// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import db  from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { user, password } = await request.json();

    if (!user?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `SELECT * FROM users WHERE (email = ? OR username = ?) AND is_active = TRUE LIMIT 1`,
      [user, user]
    );

    const dbUser = rows[0];

    if (!dbUser) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // ✅ Comparación segura con bcrypt
    const passwordMatch = await bcrypt.compare(password, dbUser.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: dbUser.id,
        role: dbUser.role,
        username: dbUser.username,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        cdl: dbUser.cdl,
        email: dbUser.email,
        phone: dbUser.phone_number,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" } // ← más limpio que calcular manualmente
    );

    const serialized = serialize("miTokenName", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    const response = NextResponse.json({ message: "Login exitoso" });
    response.headers.set("Set-Cookie", serialized);
    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}