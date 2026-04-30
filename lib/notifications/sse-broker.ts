
type SSEClient = {
  userId: number;
  role: "admin" | "profesor" | "usuario";
  controller: ReadableStreamDefaultController;
};

// Mapa en memoria de conexiones activas
const clients = new Map<number, SSEClient>();

export const sseBroker = {
  // Registrar cliente cuando abre la conexión
  addClient(userId: number, role: SSEClient["role"], controller: ReadableStreamDefaultController) {
    clients.set(userId, { userId, role, controller });
    console.log(`[SSE] Cliente conectado: userId=${userId} (${role}). Total: ${clients.size}`);
  },

  // Limpiar cuando el cliente desconecta
  removeClient(userId: number) {
    clients.delete(userId);
    console.log(`[SSE] Cliente desconectado: userId=${userId}. Total: ${clients.size}`);
  },

  // Enviar notificación a usuarios específicos
  sendToUsers(userIds: number[], payload: object) {
    const data = `data: ${JSON.stringify(payload)}\n\n`;

    for (const userId of userIds) {
      const client = clients.get(userId);
      if (client) {
        try {
          client.controller.enqueue(new TextEncoder().encode(data));
        } catch {
          // Cliente desconectado, limpiar
          clients.delete(userId);
        }
      }
    }
  },

  // Enviar a todos los admins conectados
  sendToAdmins(payload: object) {
    const data = `data: ${JSON.stringify(payload)}\n\n`;
    for (const [, client] of clients) {
      if (client.role === "admin") {
        try {
          client.controller.enqueue(new TextEncoder().encode(data));
        } catch {
          clients.delete(client.userId);
        }
      }
    }
  },
};