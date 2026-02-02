
import { geoService } from './geoService';

export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'zh' | 'ja' | 'ru';

const DICTIONARY: Record<SupportedLanguage, Record<string, string>> = {
    pt: {
        buy_now: 'ASSINAR ACESSO VIP',
        restricted_area: 'ÁREA RESTRITA',
        members_online: 'membros online',
        secure_payment: 'Pagamento processado com segurança',
        loading_translation: 'Traduzindo oferta para seu idioma...'
    },
    en: {
        buy_now: 'SUBSCRIBE TO VIP ACCESS',
        restricted_area: 'RESTRICTED AREA',
        members_online: 'members online',
        secure_payment: 'Securely processed payment',
        loading_translation: 'Translating offer to your language...'
    },
    es: {
        buy_now: 'SUSCRIBIRSE AL ACCESO VIP',
        restricted_area: 'ÁREA RESTRINGIDA',
        members_online: 'miembros en línea',
        secure_payment: 'Pago procesado de forma segura',
        loading_translation: 'Traduciendo oferta a su idioma...'
    },
    fr: {
        buy_now: 'S\'ABONNER À L\'ACCÈS VIP',
        restricted_area: 'ZONE RESTREINTE',
        members_online: 'membres en ligne',
        secure_payment: 'Paiement traité en toute sécurité',
        loading_translation: 'Traduction de l\'offre...'
    },
    de: {
        buy_now: 'VIP-ZUGANG ABONNIEREN',
        restricted_area: 'SPERRGEBIET',
        members_online: 'Mitglieder online',
        secure_payment: 'Sicher verarbeitete Zahlung',
        loading_translation: 'Übersetzung läuft...'
    },
    it: {
        buy_now: 'ABBONATI ALL\'ACCESSO VIP',
        restricted_area: 'AREA RISERVATA',
        members_online: 'membri online',
        secure_payment: 'Pagamento elaborato in modo sicuro',
        loading_translation: 'Traduzione in corso...'
    },
    zh: {
        buy_now: '订阅 VIP 权限',
        restricted_area: '限制区域',
        members_online: '在线成员',
        secure_payment: '安全支付处理',
        loading_translation: '正在翻译报价...'
    },
    ja: {
        buy_now: 'VIPアクセスを購読する',
        restricted_area: '制限区域',
        members_online: 'オンラインメンバー',
        secure_payment: '安全に決済処理されました',
        loading_translation: '翻訳中...'
    },
    ru: {
        buy_now: 'ПОДПИСАТЬСЯ НА VIP-ДОСТУП',
        restricted_area: 'ОГРАНИЧЕННАЯ ЗОНА',
        members_online: 'участников онлайн',
        secure_payment: 'Безопасная обработка платежа',
        loading_translation: 'Перевод предложения...'
    }
};

export const i18nService = {
    async detectLanguage(): Promise<SupportedLanguage> {
        // 1. Prioridade para o navegador
        const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
        if (DICTIONARY[browserLang]) return browserLang;

        // 2. Fallback para o país do IP
        try {
            const geo = await geoService.detectCountry();
            const countryMap: Record<string, SupportedLanguage> = {
                'BR': 'pt', 'US': 'en', 'ES': 'es', 'AR': 'es', 'MX': 'es',
                'FR': 'fr', 'DE': 'de', 'IT': 'it', 'CN': 'zh', 'JP': 'ja', 'RU': 'ru'
            };
            return countryMap[geo.countryCode] || 'en';
        } catch {
            return 'en';
        }
    },

    t(key: string, lang: SupportedLanguage): string {
        return DICTIONARY[lang]?.[key] || DICTIONARY['en'][key] || key;
    }
};
