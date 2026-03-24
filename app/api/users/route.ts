import { db } from "@/lib/hooks/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const searchTerm = searchParams.get('search'); 
        const role = searchParams.get('role');
        const isActive = searchParams.get('isActive');

        let sql = `
            SELECT 
                id,
                first_name AS firstName,
                last_name AS lastName,
                username,
                email,
                phone_number AS phoneNumber,
                role,
                is_active AS isActive,
                cdl
            FROM users
            WHERE 1=1
        `;

        const queryParams = [];

        if (searchTerm && searchTerm.trim() !== "") {
            sql += " AND (first_name LIKE ? OR last_name LIKE ? OR username LIKE ? OR email LIKE ?)";
            const value = `%${searchTerm}%`;
            queryParams.push(value, value, value, value);
        }

        if (role && role !== "") {
            sql += " AND role = ?";
            queryParams.push(role);
        }

        if (isActive !== null && isActive !== "") {
            sql += " AND is_active = ?";
            queryParams.push(isActive === "true" || isActive === "1" ? 1 : 0);
        }

        sql += " ORDER BY last_name ASC";

        const [rows] = await db.query(sql, queryParams);
        return NextResponse.json(rows);

    } catch (error) {
        console.error("API Users Error:", error);
        return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
    }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, cdl, phoneNumber, role } = body;

    // El username será el email o la cédula (tú eliges)
    const username = email.split('@')[0] + cdl.slice(-3); 
    const password = cdl; // Contraseña por defecto

    const [result]: any = await db.query(
      `INSERT INTO users (first_name, last_name, cdl, username, password, email, phone_number, role, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [firstName, lastName, cdl, username, password, email, phoneNumber, role]
    );

    return NextResponse.json({ id: result.insertId, message: "Usuario creado" }, { status: 201 });

  } catch (error: any) {
    console.error(error);
    // Manejo de duplicados (Email o Cédula)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: "El email o la cédula ya existen" }, { status: 409 });
    }
    return NextResponse.json({ message: "Error al crear usuario" }, { status: 500 });
  }
}



