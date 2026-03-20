import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createSession(payload: { userName: string, role: string, email: string }) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    expires,
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as { userName: string, role: string, email: string };
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
