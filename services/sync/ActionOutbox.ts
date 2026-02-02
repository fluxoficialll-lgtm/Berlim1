
import { API_BASE } from '../../apiConfig';

interface QueuedAction {
    id: string;
    url: string;
    method: string;
    body: any;
    timestamp: number;
    retries: number;
}

const STORAGE_KEY = 'flux_action_outbox';

/**
 * ActionOutbox: O bunker das ações do usuário.
 */
class ActionOutbox {
    private queue: QueuedAction[] = [];

    constructor() {
        const saved = localStorage.getItem(STORAGE_KEY);
        this.queue = saved ? JSON.parse(saved) : [];
        this.processQueue();
    }

    /**
     * Tenta enviar ou enfileira se falhar.
     */
    async dispatch(url: string, method: string, body: any) {
        const action: QueuedAction = {
            id: crypto.randomUUID(),
            url: url.startsWith('http') ? url : `${API_BASE}${url}`,
            method,
            body,
            timestamp: Date.now(),
            retries: 0
        };

        try {
            const res = await fetch(action.url, {
                method: action.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(action.body)
            });

            if (!res.ok) throw new Error("Server temporary down");
        } catch (e) {
            console.log("📦 [Outbox] Servidor instável. Enfileirando ação para envio posterior.");
            this.queue.push(action);
            this.save();
        }
    }

    private async processQueue() {
        if (this.queue.length === 0) {
            setTimeout(() => this.processQueue(), 10000);
            return;
        }

        const action = this.queue[0];
        try {
            const res = await fetch(action.url, {
                method: action.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(action.body)
            });

            if (res.ok) {
                console.log("✅ [Outbox] Ação pendente enviada com sucesso!");
                this.queue.shift();
                this.save();
            }
        } catch (e) {
            action.retries++;
            // Se falhou muito, move para o fim da fila
            if (action.retries > 5) {
                this.queue.push(this.queue.shift()!);
            }
        }

        setTimeout(() => this.processQueue(), 5000);
    }

    private save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    }
}

export const actionOutbox = new ActionOutbox();
