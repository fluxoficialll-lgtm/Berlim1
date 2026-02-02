
import { GoogleGenAI } from "@google/genai";
import { BaseConnection } from "./base.connection";

export class GeminiConnection extends BaseConnection {
  /**
   * Factory que sempre retorna uma nova instância com a chave atual do ambiente.
   * Isso evita race conditions e garante o uso da chave selecionada pelo usuário em modelos Veo/Pro.
   */
  private getClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY_MISSING");
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Wrapper seguro para geração de conteúdo
   */
  public async generateContent(model: string, contents: any, systemInstruction?: string) {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model,
        contents,
        config: systemInstruction ? { systemInstruction } : undefined
      });

      if (!response.text) {
        throw new Error("EMPTY_RESPONSE");
      }

      return response.text;
    });
  }
}

export const geminiConnection = new GeminiConnection();
