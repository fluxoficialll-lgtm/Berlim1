
import { socketService } from '../../socketService';
import { notificationService } from '../notificationService';

export const RealtimePaymentHandler = {
    init() {
        socketService.on('payment_confirmed', (data: any) => {
            console.log("💰 [Payment Handler] Pagamento confirmado em tempo real:", data);
            
            // 1. Adiciona notificação no sistema
            notificationService.addNotification({
                type: 'sale',
                senderId: 'system',
                username: 'Financeiro Flux',
                text: data.message,
                recipientId: 'me',
                recipientEmail: 'me',
                avatar: 'https://cdn-icons-png.flaticon.com/512/10543/10543306.png',
                groupId: data.groupId
            });

            // 2. Dispara evento visual global (Toast/Alerta)
            // Em uma implementação real, poderíamos usar um Store ou Context para mostrar um modal de parabéns
            alert(`✅ ${data.message}`);
        });
    }
};
