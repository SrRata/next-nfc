import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

interface JwtPayload {
  role: string;
  username: string;
  firstName: string;
  lastName: string;
  exp: number;
}

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies(); // ✅ ahora sí

  const token = cookieStore.get("miTokenName")?.value;
  

  if (!token) {
    return NextResponse.json(
      { error: "no token provided" },
      { status: 401 }
    );
  }

  try {
    const decoded = verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    return NextResponse.json({
      role: decoded.role,
      username: decoded.username,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    });
  } catch {
    return NextResponse.json(
      { error: "invalid token" },
      { status: 401 }
    );
  }
}