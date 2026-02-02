
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

/**
 * Flow: Profile
 * Centraliza a lógica de acesso a perfis.
 */
export const useProfileFlow = () => {
    const navigate = useNavigate();

    const navigateToProfile = (usernameOrHandle: string) => {
        const currentUser = authService.getCurrentUser();
        const cleanHandle = usernameOrHandle.replace('@', '').toLowerCase().trim();

        // Se o handle for o meu próprio, vai para a rota de perfil editável
        if (currentUser?.profile?.name === cleanHandle) {
            navigate('/profile');
        } else {
            navigate(`/user/${cleanHandle}`);
        }
    };

    const navigateToMyStore = () => {
        // Centraliza o acesso à loja pessoal
        navigate('/my-store');
    };

    return { navigateToProfile, navigateToMyStore };
};
