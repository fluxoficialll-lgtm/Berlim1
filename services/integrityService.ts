
import { GoogleGenAI } from "@google/genai";
import { ViolationType, IntegrityLog } from '../types/integrity.types';
import { API_BASE } from '../apiConfig';
import { authService } from './authService';

// Cache local de mensagens para detecção de spam por frequência
const messageTimestamps: Record<string, number[]> = {};

export const integrityService = {
    /**
     * Analisa se uma ação do usuário (texto) é tóxica usando o Gemini como Juiz Digital.
     */
    async evaluateContent(text: string, context: string[] = []): Promise<{ isViolating: boolean; type: ViolationType; reason: string }> {
        try {
            // Fix: Instantiate GoogleGenAI inside the method to ensure the latest API key is used
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Aja como um moderador de comunidade focado em integridade. 
                Analise o texto abaixo dentro do contexto das últimas interações.
                
                Contexto: ${context.join(' | ')}
                Texto alvo: "${text}"
                
                Responda em JSON:
                {
                    "isViolating": boolean,
                    "type": "TOXICITY" | "HARASSMENT" | "SPAM" | "NONE",
                    "reason": "breve explicação do motivo",
                    "certainty": 0-1
                }`,
                config: { responseMimeType: "application/json" }
            });

            const result = JSON.parse(response.text || '{}');
            // Só aplicamos se a certeza for maior que 85% para evitar falsos positivos
            return {
                isViolating: result.isViolating && result.certainty > 0.85,
                type: result.type,
                reason: result.reason
            };
        } catch (e) {
            console.error("[Integrity] AI Evaluation failed", e);
            return { isViolating: false, type: ViolationType.SPAM, reason: "" };
        }
    },

    /**
     * Monitora a frequência de ações para detectar bots ou spam.
     */
    checkSpamThrottle(userId: string): boolean {
        const now = Date.now();
        if (!messageTimestamps[userId]) messageTimestamps[userId] = [];
        
        // Mantém apenas os últimos 10 segundos
        messageTimestamps[userId] = messageTimestamps[userId].filter(ts => now - ts < 10000);
        
        // Se postou mais de 5 vezes em 10 segundos, é spam
        if (messageTimestamps[userId].length >= 5) {
            return true;
        }
        
        messageTimestamps[userId].push(now);
        return false;
    },

    /**
     * Envia log de infração para o backend e aplica punição local imediata (Optimistic Ban).
     */
    async reportViolation(userId: string, type: ViolationType, evidence: string) {
        try {
            await fetch(`${API_BASE}/api/admin/integrity/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    type,
                    evidence,
                    timestamp: Date.now(),
                    deviceId: localStorage.getItem('flux_device_id') || 'unknown'
                })
            });
            
            // Se for uma violação grave, desloga o usuário imediatamente
            if (type === ViolationType.FRAUD || type === ViolationType.BAN_EVASION) {
                authService.logout();
                window.location.reload();
            }
        } catch (e) {
            console.warn("[Integrity] Failed to sync violation log");
        }
    }
};
