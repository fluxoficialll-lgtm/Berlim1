
/**
 * MetaAdsLogger
 * Formata e exibe logs ultra-visuais para o tráfego de conversões.
 */
export const MetaAdsLogger = {
    // Cores ANSI para o terminal
    colors: {
        reset: "\x1b[0m",
        blue: "\x1b[34m",
        green: "\x1b[32m",
        red: "\x1b[31m",
        yellow: "\x1b[33m",
        cyan: "\x1b[36m",
        magenta: "\x1b[35m",
        white: "\x1b[37m"
    },

    /**
     * Log Principal de Fluxo CAPI
     */
    logEvent: (eventName, origin, stage, status, details = "") => {
        const time = new Date().toLocaleTimeString('pt-BR');
        
        // Determinação do Ícone de Origem
        const originLabel = origin === 'browser' 
            ? `🌐 ${MetaAdsLogger.colors.cyan}Navegador${MetaAdsLogger.colors.reset}` 
            : `🖥️ ${MetaAdsLogger.colors.white}Servidor${MetaAdsLogger.colors.reset}`;

        // Determinação de Status
        let statusEmoji = "✅ Aceito";
        let color = MetaAdsLogger.colors.green;

        if (status === 'error') {
            statusEmoji = "❌ Rejeitado";
            color = MetaAdsLogger.colors.red;
        } else if (status === 'duplicate') {
            statusEmoji = "⚠️ Ignorado (Dupe)";
            color = MetaAdsLogger.colors.yellow;
        } else if (status === 'test') {
            statusEmoji = "🧪 Teste OK";
            color = MetaAdsLogger.colors.cyan;
        }

        const msg = `📡 ${MetaAdsLogger.colors.magenta}META ADS${MetaAdsLogger.colors.reset} | ` +
                    `${MetaAdsLogger.colors.blue}${eventName}${MetaAdsLogger.colors.reset} → ` +
                    `${originLabel} → ` +
                    `🔄 ${stage} → ` +
                    `📤 CAPI → ` +
                    `${color}${statusEmoji}${MetaAdsLogger.colors.reset}${details ? ` (${details})` : ""}`;

        console.log(`[${time}] ${msg}`);
    }
};
