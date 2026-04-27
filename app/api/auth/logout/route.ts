import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const serialized = serialize("miTokenName", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: -1,
        path: "/",
    });

    const response = NextResponse.json({ message: "Logout exitoso" });
    response.headers.set("Set-Cookie", serialized);
    return response;
}