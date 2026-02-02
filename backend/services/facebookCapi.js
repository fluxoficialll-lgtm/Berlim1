
import crypto from 'crypto';
import { MetaAdsLogger } from './audit/MetaAdsLogger.js';

const FB_API_VERSION = 'v19.0';

const hashData = (data, type = 'default') => {
    if (!data || data === undefined || data === null || data === '') return undefined;
    if (typeof data === 'string' && /^[a-f0-9]{64}$/i.test(data)) return data.toLowerCase();

    let normalized = String(data).trim().toLowerCase();
    if (type === 'email') normalized = normalized.replace(/\s/g, '');
    else if (type === 'phone') {
        normalized = normalized.replace(/\D/g, '');
        if (normalized.startsWith('0')) normalized = normalized.substring(1);
        if (normalized.length >= 10 && normalized.length <= 11) normalized = '55' + normalized;
    } 
    else if (type === 'country') normalized = normalized.substring(0, 2);

    return crypto.createHash('sha256').update(normalized).digest('hex');
};

export const facebookCapi = {
    hashData,
    sendEvent: async ({ pixelId, accessToken, eventName, origin = 'server', eventId, url, eventData, userData, testEventCode }) => {
        if (!pixelId || !accessToken) {
            MetaAdsLogger.logEvent(eventName, origin, "Falha", "error", "Credenciais Ausentes");
            return { error: 'Missing credentials' };
        }

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const stage = userData.email ? "Normalizado" : "Hashing";

        const user_data = {
            em: userData.email ? [hashData(userData.email, 'email')] : undefined,
            ph: userData.phone ? [hashData(userData.phone, 'phone')] : undefined,
            fn: userData.firstName ? [hashData(userData.firstName)] : undefined,
            ln: userData.lastName ? [hashData(userData.lastName)] : undefined,
            country: userData.country ? [hashData(userData.country, 'country')] : undefined,
            external_id: userData.externalId ? [hashData(userData.externalId)] : undefined,
            client_ip_address: userData.ip,
            client_user_agent: userData.userAgent,
            fbp: userData.fbp,
            fbc: userData.fbc
        };

        const payload = {
            data: [{
                event_name: eventName,
                event_time: currentTimestamp,
                event_source_url: url,
                event_id: eventId,
                action_source: origin === 'browser' ? "website" : "system",
                user_data: Object.fromEntries(Object.entries(user_data).filter(([_, v]) => v !== undefined)),
                custom_data: {
                    ...eventData,
                    value: eventData.value ? Number(eventData.value) : undefined,
                    currency: eventData.currency || 'BRL'
                }
            }]
        };

        if (testEventCode) payload.test_event_code = testEventCode;

        try {
            const fbUrl = `https://graph.facebook.com/${FB_API_VERSION}/${pixelId}/events?access_token=${accessToken}`;
            const response = await fetch(fbUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            
            if (result.error) {
                MetaAdsLogger.logEvent(eventName, origin, stage, "error", result.error.message);
            } else {
                const status = testEventCode ? "test" : "success";
                MetaAdsLogger.logEvent(eventName, origin, stage, status);
            }
            return result;
        } catch (error) {
            MetaAdsLogger.logEvent(eventName, origin, stage, "error", error.message);
            throw error;
        }
    }
};
