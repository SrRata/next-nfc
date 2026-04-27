import { NextRequest, NextResponse } from "next/server";
import { getTokenPayload, requireAdmin } from "@/lib/auth/middleware";
import { db } from "@/lib/hooks/db";
import bcrypt from "bcryptjs";

// Admin ve cualquiera | otros solo se ven a sí mismos
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const payload = getTokenPayload(req);

    if (!payload) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // No admin intentando ver a otro usuario
    if (payload.role !== "admin" && payload.id !== Number(params.id)) {
        return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    try {
        const [rows]: any = await db.query(
            `SELECT id, first_name, last_name, username, cdl, email, phone_number, role, is_active
       FROM users WHERE id = ?`,
            [params.id]
        );

        if (!rows.length) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// PUT /api/users/:id
// Admin edita cualquiera | otros solo se editan a sí mismos (sin poder cambiar role)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const payload = getTokenPayload(req);

    if (!payload) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const isAdmin = payload.role === "admin";
    const isSelf = payload.id === Number(params.id);

    if (!isAdmin && !isSelf) {
        return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const conn = await db.getConnection();

    try {
        const body = await req.json();
        const {
            first_name,
            last_name,
            username,
            cdl,
            email,
            phone_number = null,
            password,       // opcional, solo si quiere cambiarla
            role,           // solo admin puede cambiar el rol
            is_active,      // solo admin puede desactivar desde aquí
        } = body;

        if (!first_name?.trim() || !last_name?.trim() || !username?.trim() ||
            !cdl?.trim() || !email?.trim()) {
            return NextResponse.json(
                { error: "Los campos first_name, last_name, username, cdl y email son requeridos" },
                { status: 400 }
            );
        }

        // Solo admin puede cambiar el rol
        if (role && !isAdmin) {
            return NextResponse.json(
                { error: "No tienes permisos para cambiar el rol" },
                { status: 403 }
            );
        }

        if (role) {
            const validRoles = ["admin", "profesor", "usuario"];
            if (!validRoles.includes(role)) {
                return NextResponse.json(
                    { error: "El rol debe ser: admin, profesor o usuario" },
                    { status: 400 }
                );
            }
        }

        await conn.beginTransaction();

        // Verificar que el usuario existe
        const [existing]: any = await conn.query(
            `SELECT id, role, password FROM users WHERE id = ?`,
            [params.id]
        );

        if (!existing.length) {
            await conn.rollback();
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Hashear nueva password si se envía, si no conservar la actual
        const finalPassword = password?.trim()
            ? await bcrypt.hash(password.trim(), 10)
            : existing[0].password;

        // Admin puede cambiar rol e is_active, otros conservan los suyos
        const finalRole = isAdmin && role ? role : existing[0].role;
        const finalIsActive = isAdmin && typeof is_active === "boolean"
            ? is_active
            : true;

        await conn.query(
            `UPDATE users SET
         first_name   = ?,
         last_name    = ?,
         username     = ?,
         cdl          = ?,
         password     = ?,
         email        = ?,
         phone_number = ?,
         role         = ?,
         is_active    = ?
       WHERE id = ?`,
            [
                first_name.trim(),
                last_name.trim(),
                username.trim(),
                cdl.trim(),
                finalPassword,
                email.trim(),
                phone_number,
                finalRole,
                finalIsActive,
                params.id,
            ]
        );

        await conn.commit();

        return NextResponse.json({
            success: true,
            message: "Usuario actualizado correctamente",
            data: {
                id: Number(params.id),
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                username: username.trim(),
                cdl: cdl.trim(),
                email: email.trim(),
                phone_number,
                role: finalRole,
                is_active: finalIsActive,
            },
        });
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

// DELETE /api/users/:id — soft delete, solo admin
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const admin = requireAdmin(req);

    if (!admin) {
        return NextResponse.json(
            { error: "No autorizado. Se requiere rol de administrador" },
            { status: 403 }
        );
    }

    // Admin no puede desactivarse a sí mismo
    if (admin.id === Number(params.id)) {
        return NextResponse.json(
            { error: "No puedes desactivar tu propia cuenta" },
            { status: 400 }
        );
    }

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const [existing]: any = await conn.query(
            `SELECT id, is_active FROM users WHERE id = ?`,
            [params.id]
        );

        if (!existing.length) {
            await conn.rollback();
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        if (!existing[0].is_active) {
            await conn.rollback();
            return NextResponse.json(
                { error: "El usuario ya está desactivado" },
                { status: 409 }
            );
        }

        await conn.query(
            `UPDATE users SET is_active = FALSE WHERE id = ?`,
            [params.id]
        );

        await conn.commit();

        return NextResponse.json({
            success: true,
            message: "Usuario desactivado correctamente",
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    } finally {
        conn.release();
    }
}