// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { serialize } from "cookie";

// interface LoginBody {
//   user: string;
//   password: string;
// }

// export async function POST(request: Request): Promise<NextResponse> {
//   const body: LoginBody = await request.json();

//   const { user, password } = body;

//   if (user === "admin@local.com" && password === "admin") {
//     const token = jwt.sign(
//       {
//         exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 días
//         role: "admin",
//         username: "El admin",
//         firstName: "Luis Miguel",
//         lastName: "Matailo Zuñiga"
//       },
//       process.env.JWT_SECRET as string
//     );

//     const serialized = serialize("miTokenName", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60 * 60 * 24 * 30,
//       path: "/",
//     });

//     const response = NextResponse.json({
//       message: "login successful",
//     });

//     response.headers.set("Set-Cookie", serialized);

//     return response;
//   }

//   return NextResponse.json(
//     { error: "invalid credentials" },
//     // { status: 401 }
//   );
// }


import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import mysql from "mysql2/promise";
// import bcrypt from "bcrypt"; // Descomenta si usas contraseñas encriptadas

// Configuración de la conexión (idealmente muévela a un archivo lib/db.ts)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface LoginBody {
  user: string; // Puede ser email o username según tu lógica
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { user, password }: LoginBody = await request.json();
    const connection = await mysql.createConnection(dbConfig);

    // Buscamos al usuario por email o username
    const [rows]: any = await connection.execute(
      "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
      [user, user]
    );
    
    await connection.end();

    const dbUser = rows[0];

    if (!dbUser || !dbUser.is_active) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (password !== dbUser.password) { 
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        role: dbUser.role,
        username: dbUser.username,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        id: dbUser.id,
        cdl: dbUser.cdl,
        email: dbUser.email,
        phone: dbUser.phone_number,
      },
      process.env.JWT_SECRET as string
    );

    const serialized = serialize("miTokenName", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    const response = NextResponse.json({ message: "login successful" });
    response.headers.set("Set-Cookie", serialized);

    return response;

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
