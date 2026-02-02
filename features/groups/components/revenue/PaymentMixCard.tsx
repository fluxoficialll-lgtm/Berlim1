
import React from 'react';

interface UnifiedMetric {
    provider: string;
    method: string;
    country: string;
    count: number;
    percentage: number;
}

interface PaymentMixCardProps {
    metrics: UnifiedMetric[];
}

const PROVIDER_ICONS: Record<string, string> = {
    'syncpay': 'fa-bolt',
    'stripe': 'fa-brands fa-stripe',
    'paypal': 'fa-brands fa-paypal'
};

const COUNTRY_FLAGS: Record<string, string> = {
    'BR': '🇧🇷', 'US': '🇺🇸', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'GB': '🇬🇧', 'ES': '🇪🇸', 'JP': '🇯🇵'
};

export const PaymentMixCard: React.FC<PaymentMixCardProps> = ({ metrics }) => (
    <section className="mb-10 animate-slide-up">
        <div className="flex items-center justify-between mb-5 px-2">
            <h2 className="text-[11px] font-black text-[#00c2ff] uppercase tracking-[3px] flex items-center gap-2">
                <i className="fa-solid fa-chart-pie"></i> Mix de Pagamentos
            </h2>
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Desempenho por Canal</span>
        </div>

        <div className="space-y-2">
            {metrics.length > 0 ? metrics.map((m, idx) => (
                <div key={idx} className="relative group overflow-hidden bg-white/[0.02] border border-white/5 rounded-2xl transition-all hover:border-[#00c2ff33] hover:bg-white/[0.04]">
                    {/* Barra de progresso sutil no fundo */}
                    <div 
                        className="absolute bottom-0 left-0 h-[2px] bg-[#00c2ff]/30 transition-all duration-1000"
                        style={{ width: `${m.percentage}%` }}
                    ></div>

                    <div className="flex items-center justify-between p-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-[#00c2ff] border border-white/5">
                                <i className={`fa-solid ${PROVIDER_ICONS[m.provider] || 'fa-credit-card'}`}></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-white capitalize leading-tight">
                                    {m.method} <span className="text-[10px] text-gray-600 lowercase font-medium mx-1">via</span> {m.provider}
                                </span>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[14px]">{COUNTRY_FLAGS[m.country] || '🌍'}</span>
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{m.country}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="text-sm font-black text-white">{m.count} <span className="text-[10px] text-gray-600 font-normal">vendas</span></div>
                            <div className="text-[11px] font-black text-[#00ff82]">{m.percentage.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-16 opacity-30 border-2 border-dashed border-white/5 rounded-[32px]">
                    <i className="fa-solid fa-money-bill-transfer text-4xl mb-4 text-gray-600"></i>
                    <p className="text-[10px] font-black uppercase tracking-[2px]">Aguardando dados de mercado...</p>
                </div>
            )}
        </div>
    </section>
);
