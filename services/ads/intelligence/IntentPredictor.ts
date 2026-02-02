
import { GoogleGenAI } from "@google/genai";
import { User, AdCampaign } from '../../../types';

export const IntentPredictor = {
  /**
   * Analisa sinais de comportamento (UserDNA + Atividade Recente)
   * para prever se o usuário está em uma janela de compra.
   */
  async predictImpulseProbability(user: User, ad: AdCampaign): Promise<number> {
    if (!process.env.API_KEY) return 0.5;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Sinais de comportamento extraídos da sessão
    const signals = {
      timeSinceLastAction: Date.now() - (user.lastSeen || 0),
      isNightTime: new Date().getHours() > 22 || new Date().getHours() < 6,
      userBio: user.profile?.bio || "",
      adCopy: ad.creative.text
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise a intenção de compra. 
        Usuário: "${signals.userBio}". 
        Contexto: Ativo há ${signals.timeSinceLastAction}ms, Horário local: ${new Date().getHours()}h.
        Anúncio: "${signals.adCopy}".
        Responda apenas um número entre 0.1 (baixa) e 1.0 (alta impulsividade).`,
      });

      const score = parseFloat(response.text?.trim() || "0.5");
      return isNaN(score) ? 0.5 : score;
    } catch (e) {
      return 0.5;
    }
  }
};
