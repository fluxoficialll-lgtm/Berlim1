
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { authService } from '../services/authService';
import { syncPayService } from '../services/syncPayService';
import { currencyService } from '../services/currencyService';
import { Group } from '../types';

// Subcomponentes Modulares
import { RevenueHeader } from '../features/groups/components/revenue/RevenueHeader';
import { RevenueSummaryCard } from '../features/groups/components/revenue/RevenueSummaryCard';
import { RevenueMetricsGrid } from '../features/groups/components/revenue/RevenueMetricsGrid';
import { PaymentMixCard } from '../features/groups/components/revenue/PaymentMixCard';

type CurrencyCode = 'BRL' | 'USD' | 'EUR';

interface UnifiedMetric {
    provider: string;
    method: string;
    country: string;
    count: number;
    percentage: number;
}

interface RevenueStats {
    hoje: number;
    ontem: number;
    d30: number;
    d60: number;
    d90: number;
    d180: number;
    total: number;
    unifiedMetrics: UnifiedMetric[];
    totalSales: number;
}

const CURRENCY_CONFIG = {
    BRL: { symbol: 'R$', color: '#00ff82', flag: '🇧🇷' },
    USD: { symbol: '$', color: '#00c2ff', flag: '🇺🇸' },
    EUR: { symbol: '€', color: '#ffd700', flag: '🇪🇺' }
};

export const GroupRevenue: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [isConverting, setIsConverting] = useState(false);
    const [statsBRL, setStatsBRL] = useState<RevenueStats | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('BRL');
    const [conversionRate, setConversionRate] = useState(1);

    const loadData = async () => {
        const user = authService.getCurrentUser();
        if (!user || !id) {
            setLoading(false);
            return;
        }

        const foundGroup = groupService.getGroupById(id);
        if (foundGroup) setGroup(foundGroup);

        try {
            const transactions = await syncPayService.getTransactions(user.email);
            const groupTransactions = transactions.filter(t => {
                const isPaid = ['paid', 'completed', 'approved', 'settled'].includes((t.status || '').toLowerCase());
                return isPaid && (t.groupId === id);
            });

            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            const todayStart = new Date(new Date().setHours(0,0,0,0)).getTime();
            const yesterdayStart = todayStart - oneDay;

            const metricMap: Record<string, number> = {};
            const result: RevenueStats = {
                hoje: 0, ontem: 0, d30: 0, d60: 0, d90: 0, d180: 0, total: 0,
                unifiedMetrics: [],
                totalSales: groupTransactions.length
            };

            groupTransactions.forEach(t => {
                const amount = parseFloat(t.amount || 0);
                const ts = new Date(t.created_at || t.createdAt || t.date_created || 0).getTime();
                
                result.total += amount;

                if (ts >= todayStart) result.hoje += amount;
                else if (ts >= yesterdayStart && ts < todayStart) result.ontem += amount;

                if (ts >= now - (30 * oneDay)) result.d30 += amount;
                if (ts >= now - (60 * oneDay)) result.d60 += amount;
                if (ts >= now - (90 * oneDay)) result.d90 += amount;
                if (ts >= now - (180 * oneDay)) result.d180 += amount;

                const prov = (t.provider || t.data?.providerId || 'syncpay').toLowerCase();
                const meth = (t.method || t.data?.method || (prov === 'syncpay' ? 'Pix' : 'Card')).split(' ')[0];
                const country = (t.country || t.data?.country || 'BR').toUpperCase();
                
                const key = `${prov}|${meth}|${country}`;
                metricMap[key] = (metricMap[key] || 0) + 1;
            });

            result.unifiedMetrics = Object.entries(metricMap).map(([key, count]) => {
                const [provider, method, country] = key.split('|');
                return {
                    provider,
                    method,
                    country,
                    count,
                    percentage: (count / result.totalSales) * 100
                };
            }).sort((a, b) => b.count - a.count);

            setStatsBRL(result);
        } catch (e) {
            console.error("Erro ao carregar faturamento:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [id]);

    useEffect(() => {
        const updateRate = async () => {
            if (selectedCurrency === 'BRL') { setConversionRate(1); return; }
            setIsConverting(true);
            try {
                const rate = await currencyService.getRate('BRL', selectedCurrency);
                setConversionRate(rate);
            } catch (e) { console.error("Erro na conversão", e); }
            finally { setIsConverting(false); }
        };
        updateRate();
    }, [selectedCurrency]);

    const stats = useMemo(() => {
        if (!statsBRL) return null;
        if (conversionRate === 1) return statsBRL;
        const rate = conversionRate;
        return {
            ...statsBRL,
            hoje: statsBRL.hoje * rate, ontem: statsBRL.ontem * rate,
            d30: statsBRL.d30 * rate, d60: statsBRL.d60 * rate,
            d90: statsBRL.d90 * rate, d180: statsBRL.d180 * rate,
            total: statsBRL.total * rate
        };
    }, [statsBRL, conversionRate]);

    const formatVal = (val: number) => {
        return val.toLocaleString(currencyService.getLocale(selectedCurrency), { 
            style: 'currency', currency: selectedCurrency 
        });
    };

    const metricItems = useMemo(() => {
        if (!stats) return [];
        return [
            { label: 'Hoje', value: formatVal(stats.hoje) },
            { label: 'Ontem', value: formatVal(stats.ontem) },
            { label: '30d', value: formatVal(stats.d30) },
            { label: '60d', value: formatVal(stats.d60) },
            { label: '90d', value: formatVal(stats.d90) },
            { label: '180d', value: formatVal(stats.d180) }
        ];
    }, [stats, selectedCurrency]);

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col pb-10 overflow-x-hidden">
            <style>{`
                .currency-pill {
                    padding: 8px 16px; border-radius: 12px; font-size: 11px; font-weight: 800; cursor: pointer; transition: 0.2s;
                    border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); color: #555; text-transform: uppercase;
                }
                .currency-pill.active { color: #fff; background: rgba(255,255,255,0.05); border-color: #00c2ff; }
            `}</style>
            
            <RevenueHeader onBack={() => navigate(-1)} groupName={group?.name || 'Carregando...'} />

            <main className="p-5 max-w-[600px] mx-auto w-full no-scrollbar">
                <div className="flex justify-center gap-3 mb-8 p-1.5 bg-black/40 rounded-2xl border border-white/5 w-fit mx-auto">
                    {(['BRL', 'USD', 'EUR'] as CurrencyCode[]).map(curr => (
                        <button key={curr} className={`currency-pill ${selectedCurrency === curr ? 'active' : ''}`} onClick={() => setSelectedCurrency(curr)}>
                            {CURRENCY_CONFIG[curr].flag} {curr}
                        </button>
                    ))}
                </div>

                {loading || !stats ? (
                    <div className="flex flex-col items-center justify-center py-24 opacity-30">
                        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff] mb-4"></i>
                        <p className="text-[10px] font-black uppercase tracking-[3px]">Auditoria Financeira...</p>
                    </div>
                ) : (
                    <div className="animate-fade-in relative">
                        {isConverting && (
                            <div className="absolute inset-0 bg-[#0a0c10]/60 backdrop-blur-sm z-20 flex items-center justify-center rounded-3xl">
                                <i className="fa-solid fa-rotate fa-spin text-[#00c2ff] text-2xl"></i>
                            </div>
                        )}

                        <RevenueSummaryCard 
                            totalAmount={formatVal(stats.total)}
                            totalSales={stats.totalSales}
                            avgTicket={stats.totalSales > 0 ? formatVal(stats.total / stats.totalSales) : formatVal(0)}
                            color={CURRENCY_CONFIG[selectedCurrency].color}
                        />

                        <RevenueMetricsGrid metrics={metricItems} />

                        <PaymentMixCard metrics={stats.unifiedMetrics} />

                        <div className="bg-white/5 p-5 rounded-2xl border border-dashed border-white/10 text-center opacity-40">
                             <p className="text-[9px] text-gray-500 uppercase font-black tracking-[2px] leading-relaxed">
                                <i className="fa-solid fa-shield-halved mr-1"></i> Inteligência Flux: Dados sincronizados em tempo real.
                             </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
