
import { GoogleGenAI } from "@google/genai";
import { BaseAiProvider } from "./BaseAiProvider";
import { AiRequestOptions, AiResponse } from "../types";

export class GeminiProvider extends BaseAiProvider {
  readonly id = 'gemini';

  async generate<T = string>(prompt: string, options: AiRequestOptions): Promise<AiResponse<T>> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");

    // Inicialização segura conforme diretrizes
    const ai = new GoogleGenAI({ apiKey });
    
    // Seleção inteligente de modelo baseada no Tier solicitado
    let modelName = 'gemini-3-flash-preview';
    if (options.tier === 'pro') modelName = 'gemini-3-pro-preview';
    if (options.tier === 'ultra') modelName = 'gemini-3-pro-preview'; // Fallback para pro

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: options.systemInstruction,
        temperature: options.temperature ?? 0.7,
        responseMimeType: options.jsonMode ? "application/json" : undefined
      }
    });

    const rawText = response.text || "";
    
    let content: any = rawText;
    if (options.jsonMode) {
        try {
            content = JSON.parse(rawText.trim());
        } catch (e) {
            console.error("[GeminiProvider] Failed to parse JSON response:", rawText);
            throw new Error("AI_JSON_PARSE_ERROR");
        }
    }

    return {
      content: content as T,
      provider: this.id,
      model: modelName
    };
  }
}
