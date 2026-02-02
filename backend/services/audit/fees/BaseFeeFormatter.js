/**
 * BaseFeeFormatter
 * Centraliza a lógica de visualização comum para todos os loggers de taxas.
 */
export const BaseFeeFormatter = {
    flags: {
        BR: '🇧🇷', US: '🇺🇸', FR: '🇫🇷', DE: '🇩🇪', JP: '🇯🇵', 
        ES: '🇪🇸', IT: '🇮🇹', GB: '🇬🇧', IN: '🇮🇳', ALL: '🌍'
    },

    /**
     * Formata os valores de taxa conforme exigência:
     * - Fixa: 1,00
     * - Percentual: 1,33%
     * - Fixa + percentual: 1,00 + 1,33%
     */
    formatValues(fixed, percent) {
        const f = parseFloat(fixed || 0);
        const p = parseFloat(percent || 0);
        
        const fStr = f.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const pStr = p.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '%';

        if (f > 0 && p > 0) return `${fStr} + ${pStr}`;
        if (f > 0) return fStr;
        if (p > 0) return pStr;
        return '0,00';
    },

    getTimestamp() {
        return new Date().toLocaleTimeString('pt-BR');
    }
};