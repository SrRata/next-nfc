import { NextRequest, NextResponse } from "next/server";
import { getTokenPayload, requireAdmin } from "@/lib/auth/middleware";
import { db } from "@/lib/hooks/db";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import crypto from "crypto";
import {
    sendWhatsAppMessage,
    normalizePhone
} from "@/lib/whatsapp";

// GET /api/users
// Admin ve todos | Profesor solo se ve a sí mismo | Usuario (padre) solo se ve a sí mismo
export async function GET(req: NextRequest) {
    const payload = getTokenPayload(req);

    if (!payload) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role"); // filtro opcional: ?role=profesor

        let query = `
      SELECT
        id, first_name, last_name, username,
        cdl, email, phone_number, role, is_active
      FROM users
    `;
        const queryParams: any[] = [];

        if (payload.role === "admin") {
            // Admin puede filtrar por rol o ver todos
            if (role) {
                query += ` WHERE role = ? ORDER BY last_name ASC`;
                queryParams.push(role);
            } else {
                query += ` WHERE is_active = TRUE ORDER BY last_name ASC`;
            }
        } else {
            // Cualquier otro rol solo puede verse a sí mismo
            query += ` WHERE id = ?`;
            queryParams.push(payload.id);
        }

        const [rows]: any = await db.query(query, queryParams);

        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}



// POST /api/users — solo admin
export async function POST(req: NextRequest) {
    // const admin = requireAdmin(req);
    // en desarrollo coomentar const admin = requireAdmin(req); y remplazar por 
    const admin = true

    if (!admin) {
        return NextResponse.json(
            { error: "No autorizado. Se requiere rol de administrador" },
            { status: 403 }
        );
    }

    const conn = await db.getConnection();

    try {
        const {
            first_name,
            last_name,
            username,
            cdl,
            password,
            email,
            phone_number = null,
            role,
        } = await req.json();

        // Validaciones
        if (!first_name?.trim() || !last_name?.trim() || !username?.trim() ||
            !cdl?.trim() || !password?.trim() || !email?.trim() || !role) {
            return NextResponse.json(
                { error: "Todos los campos son requeridos: first_name, last_name, username, cdl, password, email, role" },
                { status: 400 }
            );
        }

        const validRoles = ["admin", "profesor", "usuario"];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: "El rol debe ser: admin, profesor o usuario" },
                { status: 400 }
            );
        }

        await conn.beginTransaction();

        // Hashear password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result]: any = await conn.query(
            `INSERT INTO users
         (first_name, last_name, username, cdl, password, email, phone_number, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [
                first_name.trim(),
                last_name.trim(),
                username.trim(),
                cdl.trim(),
                hashedPassword,
                email.trim(),
                phone_number,
                role,
            ]
        );


        const token = crypto.randomBytes(32).toString("hex");


        await conn.query(
            `INSERT INTO user_invites (user_id, token, expires_at)
   VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
            [result.insertId, token]
        );

        await conn.commit();

        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/login/invite?token=${token}`;


        if (phone_number) {

            const normalizedPhone =
                normalizePhone(phone_number);


            await sendWhatsAppMessage(
                normalizedPhone,
                `Hola ${first_name}, bienvenido al sistema.\n\nTu cuenta ha sido creada correctamente.\n\nActiva tu cuenta aquí:\n\n${inviteLink}`
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);



        try {
            await resend.emails.send({
                from: "Sistema <siaenfc@jlmbgroup.com>",
                to: email,
                subject: "Bienvenido al sistema",
                html: `
  <div style="font-family: Arial; text-align: center;">
    <h2>Bienvenido ${first_name}</h2>
    <p>Tu cuenta ha sido creada.</p>
    <a href="${inviteLink}" 
       style="
         display:inline-block;
         padding:12px 20px;
         background:#4f46e5;
         color:white;
         text-decoration:none;
         border-radius:6px;
         margin-top:10px;
       ">
       Activar cuenta
    </a>
  </div>
`
            });
        } catch (error) {
            console.error("ERROR RESEND:");
            console.error(error);
            // opcional: guardar log o reintentar luego
        }

        return NextResponse.json(
            {
                success: true,
                message: "Usuario creado correctamente",
                data: {
                    id: result.insertId,
                    first_name: first_name.trim(),
                    last_name: last_name.trim(),
                    username: username.trim(),
                    cdl: cdl.trim(),
                    email: email.trim(),
                    phone_number,
                    role,
                    is_active: true,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        await conn.rollback();

        if (error?.code === "ER_DUP_ENTRY") {
            const message = error.message.includes("username")
                ? "El nombre de usuario ya está en uso"
                : error.message.includes("cdl")
                    ? "La cédula ya está registrada"
                    : error.message.includes("email")
                        ? "El email ya está registrado"
                        : "Ya existe un usuario con esos datos";

            return NextResponse.json({ error: message }, { status: 409 });
        }

        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    } finally {
        conn.release();
    }
}