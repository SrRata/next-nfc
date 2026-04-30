// lib/auth/middleware.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: number;
    role: "admin" | "profesor" | "usuario";
    username: string;
    firstName: string;
    lastName: string;
    cdl: string;
    email: string;
    phone: string;
}

export function getTokenPayload(req: NextRequest): JwtPayload | null {
    try {
        const token = req.cookies.get("miTokenName")?.value;
        if (!token) return null;

        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        return payload as JwtPayload;
    } catch {
        return null;
    }
}

export function requireAdmin(req: NextRequest): JwtPayload | null {
    const payload = getTokenPayload(req);
    if (!payload || payload.role !== "admin") return null;
    return payload;
}