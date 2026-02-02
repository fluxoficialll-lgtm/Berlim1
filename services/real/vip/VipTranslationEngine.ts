
import { i18nService, SupportedLanguage } from '../i18nService';
import { aiTranslationService } from '../aiTranslationService';
import { Group } from '../../../types';

export interface TranslatedVipData {
    name: string;
    description: string;
    vipDoorText: string;
    vipButtonText: string;
}

export const VipTranslationEngine = {
    /**
     * Detecta o idioma preferencial do usuário.
     */
    async getTargetLanguage(): Promise<SupportedLanguage> {
        return await i18nService.detectLanguage();
    },

    /**
     * Traduz os elementos de copy da página VIP.
     */
    async translateGroupData(group: Group, lang: SupportedLanguage): Promise<TranslatedVipData> {
        // Se for português, não gastamos tokens de IA
        if (lang === 'pt') {
            return {
                name: group.name,
                description: group.description,
                vipDoorText: group.vipDoor?.text || '',
                vipButtonText: group.vipDoor?.buttonText || ''
            };
        }

        try {
            const [tName, tDesc, tCopy, tBtn] = await Promise.all([
                aiTranslationService.translateCopy(group.name, lang),
                aiTranslationService.translateCopy(group.description, lang),
                aiTranslationService.translateCopy(group.vipDoor?.text || '', lang),
                aiTranslationService.translateCopy(group.vipDoor?.buttonText || '', lang)
            ]);

            return {
                name: tName,
                description: tDesc,
                vipDoorText: tCopy,
                vipButtonText: tBtn
            };
        } catch (e) {
            console.error("[VipTranslationEngine] AI Fallback triggered", e);
            return {
                name: group.name,
                description: group.description,
                vipDoorText: group.vipDoor?.text || '',
                vipButtonText: group.vipDoor?.buttonText || ''
            };
        }
    }
};
