import { db } from "@/lib/hooks/db";
import { ResultSetHeader } from "mysql2";
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
                username AS userName,
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

        const [data] = await db.query(sql, queryParams);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("API Users Error:", error);
        return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { firstName, lastName, role, cdl, email } = body;

        const phoneNumber = body.phoneNumber || null;
        const password = cdl
        const userName = body.userName || `User_${Date.now().toString().slice(-8)}`

        if (!firstName || !lastName || !role || !email || !cdl) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO users (first_name, last_name, cdl, username, password, email, phone_number, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, cdl, userName, password, email, phoneNumber, role]
        );


        return NextResponse.json(
            { message: "Usuario creado con éxito", id: result.insertId },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error en POST /api/users:", error);
        return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
    }
}