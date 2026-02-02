
import { aiOrchestrator, MarketingPrompts } from '../../ai';

export const aiInterestEngine = {
    /**
     * Sugere palavras-chave de segmentação baseadas no contexto do anúncio.
     * Agora utiliza a infraestrutura escalável do AiOrchestrator.
     */
    async getSmartSuggestions(context: { title: string; text: string }): Promise<string[]> {
        try {
            return await aiOrchestrator.run<string[]>(
                MarketingPrompts.suggestInterests(context.title, context.text),
                { 
                    task: 'marketing_suggestion', 
                    tier: 'flash', 
                    jsonMode: true 
                }
            );
        } catch (error) {
            console.warn("[aiInterestEngine] AI suggestion unavailable, failing over to empty list.");
            return [];
        }
    }
};
