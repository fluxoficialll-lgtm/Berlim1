
import { GoogleGenAI, Type } from "@google/genai";

export const aiTargetingService = {
    /**
     * Sugere interesses baseados no contexto do anúncio
     */
    async suggestInterests(campaignName: string, adText: string): Promise<string[]> {
        if (!process.env.API_KEY) return [];

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                Aja como um especialista em tráfego pago (Meta/Google Ads).
                Analise o contexto deste anúncio:
                Título: "${campaignName}"
                Texto: "${adText}"
                
                Sugira 10 palavras-chave de interesses ou comportamentos para segmentação de público-alvo que trariam o maior ROI.
                Retorne estritamente um array JSON de strings.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            });

            return JSON.parse(response.text || "[]");
        } catch (error) {
            console.error("[AI Targeting] Suggestion failed:", error);
            return [];
        }
    }
};
