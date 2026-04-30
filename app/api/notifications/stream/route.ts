// app/api/notifications/stream/route.ts
import { NextRequest } from "next/server";
import { getTokenPayload } from "@/lib/auth/middleware";
import { sseBroker } from "@/lib/notifications/sse-broker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // SSE requiere Node.js runtime

export async function GET(req: NextRequest) {
  const payload = getTokenPayload(req);

  if (!payload) {
    return new Response("No autorizado", { status: 401 });
  }

  const userId = payload.id;
  const role = payload.role;

  const stream = new ReadableStream({
    start(controller) {
      // Registrar este cliente en el broker
      sseBroker.addClient(userId, role, controller);

      // Enviar ping inicial para establecer conexión
      const ping = `data: ${JSON.stringify({ type: "connected", userId })}\n\n`;
      controller.enqueue(new TextEncoder().encode(ping));

      // Limpiar cuando el cliente desconecta
      req.signal.addEventListener("abort", () => {
        sseBroker.removeClient(userId);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection":    "keep-alive",
      "X-Accel-Buffering": "no", // Importante para Nginx/Hostinger
    },
  });
}