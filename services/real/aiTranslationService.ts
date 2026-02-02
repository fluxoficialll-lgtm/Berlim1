
import { aiOrchestrator, MarketingPrompts } from '../ai';
import { SupportedLanguage } from './i18nService';

export const aiTranslationService = {
    /**
     * Traduz uma copy de venda preservando os gatilhos mentais.
     */
    async translateCopy(text: string, targetLang: SupportedLanguage): Promise<string> {
        if (!text || targetLang === 'pt') return text;

        const cacheKey = `ai_trans_${targetLang}_${btoa(text.substring(0, 30))}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) return cached;

        try {
            const translated = await aiOrchestrator.run<string>(
                MarketingPrompts.translateCopy(text, targetLang),
                { 
                    task: 'translation', 
                    tier: 'flash', 
                    temperature: 0.3 // Baixa temperatura para traduções mais fiéis
                }
            );

            sessionStorage.setItem(cacheKey, translated);
            return translated;
        } catch (error) {
            console.error("[AI Translation Error]:", error);
            return text; // Fallback para o original em caso de falha na IA
        }
    }
};
