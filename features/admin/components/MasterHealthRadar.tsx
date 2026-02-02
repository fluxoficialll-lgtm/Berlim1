import React, { useState, useEffect } from 'react';
import { fluxClient } from '../../../services/fluxClient';
import { MASTER_HEALTH_COPY, PROVIDER_LABELS, MasterStatus } from '../constants/MasterHealthCopy';

export const MasterHealthRadar: React.FC = () => {
    const [health, setHealth] = useState<Record<string, MasterStatus>>({
        syncpay: 'validating',
        stripe: 'validating',
        paypal: 'validating'
    });
    const [loading, setLoading] = useState(true);

    const refreshHealth = async () => {
        setLoading(true);
        try {
            const res = await fluxClient.call<{ data: Record<string, MasterStatus> }>('/api/admin/execute/system/master-health');
            setHealth(res.data);
        } catch (e) {
            console.error("Radar Fail", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshHealth();
        const interval = setInterval(refreshHealth, 60000 * 5); // Check a cada 5 min
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 shadow-2xl animate-fade-in mb-8">
            <style>{`
                .status-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    position: relative;
                }
                .status-dot.active {
                    animation: status-pulse 2s infinite;
                }
                @keyframes status-pulse {
                    0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 currentColor; }
                    70% { transform: scale(1.2); opacity: 0.5; box-shadow: 0 0 0 10px rgba(255,255,255,0); }
                    100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(255,255,255,0); }
                }
            `}</style>

            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h3 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[3px]">Revenue Shield</h3>
                    <span className="text-white font-bold text-sm">Radar de Saúde Financeira 🛰️</span>
                </div>
                <button 
                    onClick={refreshHealth}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                >
                    <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
                </button>
            </div>

            <div className="space-y-3">
                {Object.entries(health).map(([provider, status]) => {
                    // Comment: Fix: Explicitly casting 'status' as 'MasterStatus' to resolve "Type 'unknown' cannot be used as an index type" error.
                    const copy = MASTER_HEALTH_COPY[status as MasterStatus];
                    const isOk = status === 'ok';

                    return (
                        <div key={provider} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div 
                                    className="status-dot active" 
                                    style={{ backgroundColor: copy.color, color: copy.color }}
                                />
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-white uppercase tracking-tight">
                                        {PROVIDER_LABELS[provider]}
                                    </span>
                                    <span className="text-[12px] text-gray-400 font-medium">
                                        {PROVIDER_LABELS[provider]} {copy.label}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">
                                <i className={`fa-solid ${copy.icon}`} style={{ color: copy.color }}></i>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 opacity-30">
                <i className="fa-solid fa-shield-halved text-[9px]"></i>
                <span className="text-[8px] font-black uppercase tracking-[2px]">Monitoramento mestre em tempo real</span>
            </div>
        </div>
    );
};