
/**
 * HEARTBEAT LOGGER - Presença e Disponibilidade
 * Foco: Saber se o App ainda está "vivo" ou se a conexão caiu no meio do uso.
 */

// Cache em memória para monitorar o último pulso de cada cliente
const activePulses = new Map();

export const heartbeatLogger = {
    logPulse: (clientId) => {
        if (!clientId) return;
        
        const now = Date.now();
        activePulses.set(clientId, now);
        console.log(`[PULSE] 💓 PULSE_RECEIVED | Client: ${clientId} | Status: ALIVE`);
    },

    checkVitality: () => {
        const now = Date.now();
        const timeout = 65000; // 65 segundos (ligeiramente mais que o intervalo do app)

        activePulses.forEach((lastSeen, clientId) => {
            if (now - lastSeen > timeout) {
                console.warn(`[PULSE] 🤫 SILENCE_DETECTED | Alerta: O cliente ${clientId} parou de enviar sinais há mais de 60s.`);
                activePulses.delete(clientId);
            }
        });
    },

    logTimeout: (clientId) => {
        console.log(`[PULSE] ⌛ SESSION_TIMEOUT | Encerrando contexto por inatividade do cliente ${clientId}`);
        activePulses.delete(clientId);
    }
};

// Inicia monitoramento automático de silêncio a cada 30 segundos
setInterval(() => heartbeatLogger.checkVitality(), 30000);
