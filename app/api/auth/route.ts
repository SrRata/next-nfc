import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

interface LoginBody {
  user: string;
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body: LoginBody = await request.json();

  const { user, password } = body;

  if (user === "admin@local.com" && password === "admin") {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 días
        role: "admin",
        username: "El admin",
        firstName: "Luis Miguel",
        lastName: "Matailo Zuñiga"
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

    const response = NextResponse.json({
      message: "login successful",
    });

    response.headers.set("Set-Cookie", serialized);

    return response;
  }

  return NextResponse.json(
    { error: "invalid credentials" },
    // { status: 401 }
  );
}