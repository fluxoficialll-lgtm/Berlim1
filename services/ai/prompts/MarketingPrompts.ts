
/**
 * MarketingPrompts: Biblioteca de estratégias para o Flux Ads e Vendas.
 */
export const MarketingPrompts = {
  
  /**
   * Gera sugestões de interesses para segmentação de anúncios.
   */
  suggestInterests: (title: string, text: string) => `
    Aja como um especialista em tráfego pago de alta performance.
    Analise este produto/anúncio:
    "${title} - ${text}"
    
    Com base no comportamento de consumo atual nas redes sociais, retorne uma lista das 8 melhores 
    palavras-chave de interesses e comportamentos para segmentar o público ideal no gerenciador de anúncios.
    
    REQUISITO TÉCNICO: Retorne estritamente um array JSON de strings sem formatação markdown.
  `,

  /**
   * Tradução persuasiva para o modo global (WYSIWYG).
   */
  translateCopy: (text: string, targetLang: string) => `
    Act as a professional direct-response copywriter.
    Translate the following marketing text to the language: ${targetLang}.
    
    Rules:
    1. Maintain the emotional urgency and sales triggers.
    2. Use local cultural nuances for higher conversion (slangs are allowed if professional).
    3. Keep all emojis.
    4. Return ONLY the translated text.
    
    Text: "${text}"
  `
};
