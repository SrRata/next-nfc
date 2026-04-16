import { jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";

// 🔐 Validación temprana del secret
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("miTokenName")?.value;

  const isLoginPage = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");

  // 🔐 Función helper para validar token
  async function isValidToken(token: string) {
    try {
      await jwtVerify(token, secret);
      return true;
    } catch {
      return false;
    }
  }

  // 🔁 Caso 1: usuario con token intenta ir a login
  if (isLoginPage && token) {
    const valid = await isValidToken(token);

    if (valid) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Token inválido → limpiar cookie
    const response = NextResponse.next();
    response.cookies.delete("miTokenName");
    return response;
  }

  // 🔒 Caso 2: proteger dashboard
  if (isDashboard) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const valid = await isValidToken(token);

    if (!valid) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("miTokenName");
      return response;
    }
  }

  return NextResponse.next();
}

// 🎯 Limitar ejecución SOLO a rutas necesarias
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};