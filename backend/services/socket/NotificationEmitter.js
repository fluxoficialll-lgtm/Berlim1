
export const NotificationEmitter = {
    /**
     * Envia um alerta de "Pagamento Confirmado" para o usuário.
     */
    emitPaymentSuccess(io, userEmail, groupId, groupName) {
        if (!io || !userEmail) return;
        
        console.log(`📡 [Socket] Notificando sucesso de pagamento para ${userEmail}`);
        
        io.to(userEmail).emit('payment_confirmed', {
            groupId,
            groupName,
            message: `Seu acesso ao grupo ${groupName} foi liberado com sucesso!`,
            timestamp: Date.now()
        });
    },

    /**
     * Notifica alteração de cargo.
     */
    emitRoleUpdate(io, userEmail, groupId, roleName) {
        if (!io || !userEmail) return;
        io.to(userEmail).emit('role_updated', {
            groupId,
            roleName,
            message: `Seu cargo no grupo foi atualizado para: ${roleName}`
        });
    }
};
