import express from 'express';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

/**
 * POST /api/moderation/analyze
 * Analisa conteúdo usando IA para garantir integridade da plataforma.
 */
router.post('/analyze', async (req, res) => {
    try {
        const { text, mediaUrl, userEmail } = req.body;
        
        if (!process.env.API_KEY) {
            return res.json({ isAdult: false, reason: "AI_NOT_CONFIGURED" });
        }

        // Fix: Instantiate GoogleGenAI and call generateContent directly with the model name, avoiding deprecated .get() or .getModel()
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
            Aja como um moderador de segurança de rede social.
            Analise se o conteúdo abaixo viola políticas contra: pornografia, violência explícita, spam agressivo ou golpes.
            
            Texto: "${text || 'Sem texto'}"
            Mídia: ${mediaUrl || 'Nenhuma'}
            Usuário: ${userEmail || 'Anônimo'}

            Responda estritamente em formato JSON:
            {
                "isAdult": boolean,
                "isViolation": boolean,
                "category": "none" | "sexual" | "violence" | "spam" | "fraud",
                "reason": "breve explicação"
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json" }
        });

        // Fix: Use the .text property directly as per guidelines
        const result = JSON.parse(response.text || '{"isAdult": false}');
        res.json(result);

    } catch (error) {
        console.error("[Moderation API Error]:", error.message);
        // Fail-safe: Em caso de erro na IA, permite o post mas loga para revisão humana
        res.json({ isAdult: false, error: "MODERATION_TIMEOUT" });
    }
});

export default router;