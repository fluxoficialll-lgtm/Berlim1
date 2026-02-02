
import { useState, useEffect } from 'react';
import { i18nService, SupportedLanguage } from '../services/real/i18nService';
import { VipTranslationEngine, TranslatedVipData } from '../services/real/vip/VipTranslationEngine';
import { Group } from '../types';

export const useAutoLanguage = (group: Group | null) => {
    const [lang, setLang] = useState<SupportedLanguage>('pt');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedData, setTranslatedData] = useState<TranslatedVipData | null>(null);

    useEffect(() => {
        const runTranslation = async () => {
            if (!group) return;

            const detected = await VipTranslationEngine.getTargetLanguage();
            setLang(detected);

            setIsTranslating(true);
            const data = await VipTranslationEngine.translateGroupData(group, detected);
            setTranslatedData(data);
            setIsTranslating(false);
        };

        runTranslation();
    }, [group?.id]);

    return {
        lang,
        isTranslating,
        translatedData,
        t: (key: string) => i18nService.t(key, lang)
    };
};
