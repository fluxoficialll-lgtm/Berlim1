
/**
 * Env Service
 * Detecta se o app está rodando em um ambiente de demonstração (como o preview da IA)
 * ou em um ambiente estável (localhost ou produção real).
 */
export const envService = {
    isDemoMode: (): boolean => {
        try {
            // 1. Prioridade absoluta: Override manual via URL ou LocalStorage
            const params = new URLSearchParams(window.location.search);
            if (params.get('demo') === 'true' || params.get('mock') === 'true') return true;
            if (localStorage.getItem('force_mock_mode') === 'true') return true;

            const hostname = window.location.hostname;
            const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.');
            
            // Se estiver em um iframe, quase certamente é o preview da IA
            const isIframe = window.self !== window.top;
            
            // Se a URL contém "stackblitz", "webcontainer", "v0" ou URLs de preview dinâmicas
            const isPreviewEnv = hostname.includes('webcontainer-api.io') || 
                               hostname.includes('stackblitz.io') || 
                               hostname.includes('v0.io') ||
                               hostname.includes('netlify.app') ||
                               hostname.includes('vercel.app');

            // Se não houver VITE_API_URL configurada ou se estivermos em ambiente de preview, forçamos Mock
            // @ts-ignore
            const apiConfigured = !!import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== "";

            if (!apiConfigured || isIframe || isPreviewEnv) return true;

            return false;
        } catch (e) {
            return true; // Fallback seguro para modo demo
        }
    },
    
    setForceMock: (enabled: boolean) => {
        localStorage.setItem('force_mock_mode', enabled ? 'true' : 'false');
        window.location.reload();
    }
};
