// ─────────────────────────────────────────────────────────────
// ARCHIVO 1: app/api/auth/change-password/request/route.ts
// ─────────────────────────────────────────────────────────────
// Recibe: { current_password, send_email, send_whatsapp }
// Verifica contraseña actual, genera código, lo guarda hasheado
// en la tabla user_invites, y lo envía por Resend y/o WhatsApp.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import db from "@/lib/db";                                 // tu pool mysql2
import { normalizePhone, sendWhatsAppMessage } from "@/lib/whatsapp";

const resend = new Resend(process.env.RESEND_API_KEY);

// JWT payload que usas en /api/profile
interface JwtPayload {
  id: string;
  role: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  username: string;
  cdl: string;
}

// Genera un código numérico de 6 dígitos
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    // 1. Leer y verificar el JWT de la cookie (igual que /api/profile)
    const cookieStore = await cookies();
    const token = cookieStore.get("miTokenName")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const { current_password, send_email, send_whatsapp } = await req.json();

    if (!send_email && !send_whatsapp) {
      return NextResponse.json(
        { message: "Selecciona al menos un método de verificación" },
        { status: 400 }
      );
    }

    // 2. Verificar contraseña actual en la BD
    const [rows]: any = await db.query(
      "SELECT id, email, phone_number, password FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(current_password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "La contraseña actual es incorrecta" },
        { status: 400 }
      );
    }

    // 3. Generar código y hashearlo
    const code = generateCode();
    const hashedCode = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // 4. Guardar en user_invites (reutilizamos la tabla que ya tienes)
    //    token  = el hash del código
    //    used   = false
    //    expires_at = ahora + 10 min
    //
    //    Si ya existe un registro previo del mismo usuario, lo reemplazamos.
    await db.query(
      `INSERT INTO user_invites (user_id, token, expires_at, used)
       VALUES (?, ?, ?, false)
       ON DUPLICATE KEY UPDATE
         token      = VALUES(token),
         expires_at = VALUES(expires_at),
         used       = false`,
      [decoded.id, hashedCode, expiresAt]
    );
    // NOTA: si user_invites no tiene UNIQUE en user_id, usa este INSERT en su lugar:
    // await db.query(
    //   `DELETE FROM user_invites WHERE user_id = ?`, [decoded.id]
    // );
    // await db.query(
    //   `INSERT INTO user_invites (user_id, token, expires_at, used) VALUES (?, ?, ?, false)`,
    //   [decoded.id, hashedCode, expiresAt]
    // );

    // 5. Enviar el código
    const errors: string[] = [];

    if (send_email && user.email) {
      const { error } = await resend.emails.send({
        from: "TuApp <noreply@tudominio.com>", // ← cambia por tu dominio verificado en Resend
        to: user.email,
        subject: "Código para cambiar tu contraseña",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
            <h2 style="color:#1a56db;margin-bottom:8px;">Cambio de contraseña</h2>
            <p style="color:#374151;">Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
            <div style="background:#f3f4f6;border-radius:8px;padding:20px 32px;text-align:center;margin:24px 0;">
              <p style="font-size:13px;color:#6b7280;margin:0 0 8px;">Tu código de verificación</p>
              <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1a56db;">
                ${code}
              </span>
            </div>
            <p style="font-size:13px;color:#6b7280;">
              Este código expira en <strong>10 minutos</strong>.<br>
              Si no solicitaste este cambio, ignora este mensaje.
            </p>
          </div>
        `,
      });
      if (error) errors.push(`Email: ${error.message}`);
    }

    if (send_whatsapp && user.phone_number) {
      const normalized = normalizePhone(user.phone_number);
      const result = await sendWhatsAppMessage(
        normalized,
        `Tu código para cambiar la contraseña es: *${code}*\nExpira en 10 minutos. Si no lo solicitaste, ignora este mensaje.`
      );
      if (!result.success) errors.push("WhatsApp: no se pudo enviar");
    }

    // Si todos los canales seleccionados fallaron, retorna error
    const requestedChannels = [send_email, send_whatsapp].filter(Boolean).length;
    if (errors.length >= requestedChannels) {
      return NextResponse.json(
        { message: "No se pudo enviar el código: " + errors.join(". ") },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Código enviado correctamente" });
  } catch (error) {
    console.error("Error en /change-password/request:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}


// ─────────────────────────────────────────────────────────────
// ARCHIVO 2: app/api/auth/change-password/verify/route.ts
// ─────────────────────────────────────────────────────────────
// Recibe: { code, new_password }
// Busca el registro en user_invites, compara el código con bcrypt,
// actualiza la contraseña y marca el token como usado.
// ─────────────────────────────────────────────────────────────

// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verify } from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import db from "@/lib/db";

export async function POST_VERIFY(req: NextRequest) {
  try {
    // 1. Verificar JWT de cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("miTokenName")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

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

    // 2. Buscar código pendiente y vigente para este usuario
    const [rows]: any = await db.query(
      `SELECT id, token FROM user_invites
       WHERE user_id = ? AND used = false AND expires_at > NOW()
       ORDER BY id DESC
       LIMIT 1`,
      [decoded.id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "El código expiró o ya fue utilizado. Solicita uno nuevo." },
        { status: 400 }
      );
    }

    // 3. Comparar el código ingresado con el hash guardado
    const codeMatch = await bcrypt.compare(String(code), rows[0].token);

    if (!codeMatch) {
      return NextResponse.json(
        { message: "Código incorrecto. Verifica e intenta de nuevo." },
        { status: 400 }
      );
    }

    // 4. Hashear la nueva contraseña y actualizar en la BD
    const hashedPassword = await bcrypt.hash(new_password, 12);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      decoded.id,
    ]);

    // 5. Marcar el registro como usado
    await db.query(
      "UPDATE user_invites SET used = true WHERE id = ?",
      [rows[0].id]
    );

    return NextResponse.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en /change-password/verify:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}