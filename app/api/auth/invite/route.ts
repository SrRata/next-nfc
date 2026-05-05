import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.redirect("/error");
    }

    const [rows]: any = await db.query(
        `SELECT ui.*, u.*
     FROM user_invites ui
     JOIN users u ON u.id = ui.user_id
     WHERE ui.token = ? LIMIT 1`,
        [token]
    );

    const invite = rows[0];

    if (!invite || invite.used || new Date(invite.expires_at) < new Date()) {
        return NextResponse.redirect("/error");
    }

    const jwtToken = jwt.sign(
        {
            id: invite.user_id,
            role: invite.role,
            username: invite.username,
            firstName: invite.first_name,
            lastName: invite.last_name,
            email: invite.email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "30d" }
    );

    const cookie = serialize("miTokenName", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    // marcar como usado
    await db.query(
        `UPDATE user_invites SET used = TRUE WHERE id = ?`,
        [invite.id]
    );


    const redirectUrl = new URL("/dashboard/profile", req.url);

    const response = NextResponse.redirect(redirectUrl);
    response.headers.set("Set-Cookie", cookie);

    return response;
}