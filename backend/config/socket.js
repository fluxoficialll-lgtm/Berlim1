
import { Server } from 'socket.io';

/**
 * Inicializa o Socket.io no servidor HTTP fornecido
 */
export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: { 
            origin: true, 
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        const clientId = socket.handshake.headers['x-flux-client-id'] || 'unknown';
        console.log(`[SOCKET] 🔗 WS_CONNECTED | SocketID: ${socket.id} | Client: ${clientId}`);

        socket.on('join_user', (email) => {
            if (email) {
                socket.join(email);
                console.log(`[SOCKET] 👤 USER_JOINED | Room: ${email}`);
            }
        });

        socket.on('join_chat', (chatId) => {
            if (chatId) {
                socket.join(chatId);
                console.log(`[SOCKET] 💬 CHAT_JOINED | Room: ${chatId}`);
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`[SOCKET] 🔌 WS_DISCONNECTED | SocketID: ${socket.id} | Reason: ${reason}`);
        });
    });

    return io;
};
