import { jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";

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

  async function isValidToken(token: string) {
    try {
      await jwtVerify(token, secret);
      return true;
    } catch {
      return false;
    }
  }

if (isLoginPage && token) {
  const valid = await isValidToken(token);
  if (valid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  const response = NextResponse.next();
  response.cookies.set("miTokenName", "", { expires: new Date(0) });
  return response;
}

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

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

  return response;
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de las páginas excepto:
     * 1. /api (rutas de API)
     * 2. /_next/static (archivos estáticos)
     * 3. /_next/image (optimización de imágenes)
     * 4. /favicon.ico (archivo de favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};