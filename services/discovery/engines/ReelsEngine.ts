
import { Post } from '../../../types';
import { GoogleGenAI } from "@google/genai";
import { EngineContext } from '../types';

export class ReelsEngine {
    private static WEIGHTS = {
        VIRAL_VELOCITY: 300,
        WATCH_TIME_BOOST: 1000,
        AI_AFFINITY: 2500
    };

    /**
     * Usa Gemini para rotular o conteúdo e cruzar com interesses do usuário
     */
    private static async getSemanticAffinity(postText: string, userBio: string): Promise<number> {
        if (!process.env.API_KEY || !userBio) return 5; // Neutral
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analise a afinidade entre o post: "${postText}" e o interesse: "${userBio}". Responda apenas um número de 1 a 10.`,
            });
            return parseInt(response.text?.trim() || "5");
        } catch (e) {
            return 5;
        }
    }

    public static async rank(reels: Post[], context: EngineContext): Promise<Post[]> {
        const scored = await Promise.all(reels.map(async reel => {
            let score = 5000;

            // 1. Velocidade Viral (Views)
            score += (reel.views * this.WEIGHTS.VIRAL_VELOCITY);

            // 2. Afinidade IA (Processamento paralelo limitado para performance)
            if (context.user?.profile?.bio && reels.indexOf(reel) < 10) {
                const affinity = await this.getSemanticAffinity(reel.text, context.user.profile.bio);
                score += (affinity * this.WEIGHTS.AI_AFFINITY);
            }

            // 3. Retenção (Likes/Views ratio)
            const retention = reel.views > 0 ? (reel.likes / reel.views) : 0;
            score += (retention * this.WEIGHTS.WATCH_TIME_BOOST);

            return { item: reel, score };
        }));

        return scored.sort((a, b) => b.score - a.score).map(s => s.item);
    }
}
