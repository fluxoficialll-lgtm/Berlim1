import { IPixelProvider } from './BaseProvider';
import { PixelEventData, PixelUserData } from '../../../types/pixel.types';
import { TikTokMapping } from '../mappings/TikTokMapping';
import { mapToTikTokParams } from '../mappings/params/TikTokParams';
import { anonymizeUserData } from '../utils/pixelHasher';

export class TikTokProvider implements IPixelProvider {
  id = 'tiktok';

  init(pixelId: string) {
    if (typeof window === 'undefined' || !pixelId) return;

    if (!(window as any).ttq) {
      (function (w:any, d:any, t:any) {
        w.TiktokAnalyticsObject = t;
        var ttq = w[t] = w[t] || [];
        ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
        ttq.setAndDefer = function (t:any, e:any) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function (t:any) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e };
        ttq.load = function (e:any, n:any) { var t = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = t, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {}; var o = d.createElement("script"); o.type = "text/javascript", o.async = !0, o.src = t + "?sdkid=" + e + "&lib=" + t; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a) };
      })(window, document, 'ttq');
    }

    (window as any).ttq.load(pixelId);
    (window as any).ttq.page();
  }

  async track(internalEvent: string, data?: PixelEventData, userData?: PixelUserData) {
    if (!(window as any).ttq) return;

    const eventName = TikTokMapping[internalEvent] || internalEvent;
    const hashedUserData = await anonymizeUserData(userData || {});
    
    // Converte para padrão TikTok
    const ttParams = mapToTikTokParams(hashedUserData, data);

    // No TikTok, Identify deve ser chamado antes ou junto com o Track
    if (ttParams.user_info.email || ttParams.user_info.phone_number) {
      (window as any).ttq.identify(ttParams.user_info);
    }

    (window as any).ttq.track(eventName, ttParams.properties);
  }
}
