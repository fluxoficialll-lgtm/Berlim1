
const STORAGE_KEY = 'flux_pending_purchase_id';

/**
 * PurchaseIntention
 * "Corda de Segurança" que puxa o usuário para o grupo certo após o login.
 */
export const PurchaseIntention = {
    set: (groupId: string) => {
        sessionStorage.setItem(STORAGE_KEY, groupId);
        // Também salvamos o timestamp para expiração
        sessionStorage.setItem(`${STORAGE_KEY}_ts`, Date.now().toString());
    },

    get: (): string | null => {
        const id = sessionStorage.getItem(STORAGE_KEY);
        const ts = sessionStorage.getItem(`${STORAGE_KEY}_ts`);
        
        if (!id || !ts) return null;

        // Expira após 30 minutos (tempo de um checkout/cadastro calmo)
        const age = Date.now() - parseInt(ts);
        if (age > 30 * 60 * 1000) {
            PurchaseIntention.clear();
            return null;
        }

        return id;
    },

    clear: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(`${STORAGE_KEY}_ts`);
    }
};
