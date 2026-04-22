import { db } from "@/lib/hooks/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
import { Resend } from "resend";

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

// export async function POST(request: Request) {
//     try {
//         const body = await request.json();

//         const { firstName, lastName, role, cdl, email } = body;

//         const phoneNumber = body.phoneNumber || null;
//         const password = cdl
//         const userName = body.userName || `User_${Date.now().toString().slice(-8)}`

//         if (!firstName || !lastName || !role || !email || !cdl) {
//             return NextResponse.json(
//                 { error: "Faltan campos obligatorios" },
//                 { status: 400 }
//             );
//         }

//         const [result] = await db.query<ResultSetHeader>(
//             `INSERT INTO users (first_name, last_name, cdl, username, password, email, phone_number, role) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [firstName, lastName, cdl, userName, password, email, phoneNumber, role]
//         );


//         return NextResponse.json(
//             { message: "Usuario creado con éxito", id: result.insertId },
//             { status: 201 }
//         );

//     } catch (error: any) {
//         console.error("Error en POST /api/users:", error);
//         return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
//     }
// }


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, role, cdl, email } = body;

        const phoneNumber = body.phoneNumber || null;
        const password = cdl; // Usas el CDL como contraseña
        const userName = body.userName || `User_${Date.now().toString().slice(-8)}`;

        if (!firstName || !lastName || !role || !email || !cdl) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        // 1. Insertar en la base de datos
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO users (first_name, last_name, cdl, username, password, email, phone_number, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, cdl, userName, password, email, phoneNumber, role]
        );

        try {
            await resend.emails.send({
                from: 'Sistema CEMEN <onboarding@resend.dev>', // Cambia por tu dominio verificado luego
                to: email,
                subject: 'Bienvenido al Sistema CEMEN',
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h2>¡Hola, ${firstName}!</h2>
                        <p>Has sido registrado exitosamente en el sistema con el rol de <strong>${role}</strong>.</p>
                        <p>Estas son tus credenciales de acceso:</p>
                        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px;">
                            <p><strong>Usuario:</strong> ${userName} o ${email}</p>
                            <p><strong>Contraseña:</strong> ${password}</p>
                        </div>
                        <p style="margin-top: 20px;">Puedes iniciar sesión desde el panel principal.</p>
                    </div>
                `,
            });
        } catch (mailError) {
            // Logueamos el error del correo pero no detenemos la respuesta exitosa del usuario creado
            console.error("Error al enviar el correo:", mailError);
        }

        return NextResponse.json(
            { message: "Usuario creado con éxito y correo enviado", id: result.insertId },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error en POST /api/users:", error);
        return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
    }
}
