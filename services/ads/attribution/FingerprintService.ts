
export const FingerprintService = {
  /**
   * Gera um ID único baseado nas características do hardware e navegador.
   * Usado para Atribuição Determinística.
   */
  async getFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const userAgent = navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Desenha um padrão invisível para extrair assinatura da GPU/Driver
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125,1,62,20);
      ctx.fillStyle = "#069";
      ctx.fillText("flux_ads_fp", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("flux_ads_fp", 4, 17);
    }
    
    const canvasData = canvas.toDataURL();
    const rawString = `${userAgent}-${screenRes}-${timezone}-${canvasData.substring(20, 100)}`;
    
    // Simple hash for the fingerprint
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `fp_${Math.abs(hash).toString(16)}`;
  }
};
