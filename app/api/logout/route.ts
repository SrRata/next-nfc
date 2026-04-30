import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(): Promise<NextResponse> {
  try {
    const serialized = serialize("miTokenName", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, 
      path: "/",
    });

    const response = NextResponse.json({
      message: "logout successful",
    });

    response.headers.set("Set-Cookie", serialized);

    return response;

  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "logout failed" },
      { status: 500 }
    );
  }
}