import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("miTokenName")?.value;

  const isLoginPage = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");

  if (isLoginPage && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      await jwtVerify(token, secret); // valida token

      // ✅ token válido → redirigir
      return NextResponse.redirect(new URL("/dashboard", request.url));

    } catch (error) {
      // ❌ token inválido → dejar pasar a login
      console.log("Token inválido en login");
    }
  }

  if (isDashboard) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      await jwtVerify(token, secret);

    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}