
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { PurchaseIntention } from '../../services/sync/PurchaseIntention';

/**
 * Flow: Onboarding
 * Centraliza a inteligência de para onde mandar o usuário 
 * logo após ele entrar no aplicativo.
 */
export const useOnboardingFlow = () => {
    const navigate = useNavigate();

    const handlePostAuthRouting = (user: User) => {
        // 1. Prioridade Máxima: Bloqueio de Segurança
        if (user.isBanned) {
            navigate('/banned', { replace: true });
            return;
        }

        // 2. Verificação de Intenção de Compra (Pós-Pagamento Resiliente)
        // Se houver um ID no PurchaseIntention, significa que o usuário pagou
        // e acabou de terminar o cadastro Google. Mandamos para a SuccessBridge.
        const pendingPurchaseId = PurchaseIntention.get();
        if (pendingPurchaseId) {
            console.log("🎯 [Onboarding] Intenção de compra detectada:", pendingPurchaseId);
            navigate(`/payment-success-bridge/${pendingPurchaseId}`, { replace: true });
            return;
        }

        // 3. Perfil Incompleto (Username/Bio/Foto obrigatórios)
        if (!user.isProfileCompleted) {
            navigate('/complete-profile', { replace: true });
            return;
        }

        // 4. Verificação de Redirecionamento de Deep Linking Legado
        const pendingRedirect = sessionStorage.getItem('redirect_after_login');
        if (pendingRedirect && pendingRedirect !== '/' && !pendingRedirect.includes('login')) {
            sessionStorage.removeItem('redirect_after_login');
            navigate(pendingRedirect, { replace: true });
            return;
        }

        // 5. Fluxo Padrão: Feed Global
        navigate('/feed', { replace: true });
    };

    return { handlePostAuthRouting };
};
