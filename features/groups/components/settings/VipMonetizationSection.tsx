
import React, { useState } from 'react';
import { PixelConfigCard } from './PixelConfigCard';

interface PixelConfig {
    metaId?: string;
    metaToken?: string;
    tiktokId?: string;
    tiktokToken?: string;
    googleId?: string;
    xId?: string;
}

interface VipMonetizationSectionProps {
    vipPrice: string;
    setVipPrice: (val: string) => void;
    vipCurrency: 'BRL' | 'USD';
    setVipCurrency: (val: 'BRL' | 'USD') => void;
    selectedProviderId?: string;
    onOpenProviderSelector: () => void;
    pixelConfig: PixelConfig;
    onOpenDoorEditor: () => void;
    onOpenPixelEditor: (platform?: string) => void;
    onManualRelease: (username: string) => Promise<boolean>;
}

export const VipMonetizationSection: React.FC<VipMonetizationSectionProps> = ({
    vipPrice, setVipPrice, vipCurrency, setVipCurrency,
    selectedProviderId, onOpenProviderSelector,
    pixelConfig, onOpenDoorEditor, onOpenPixelEditor, onManualRelease
}) => {
    const [manualUser, setManualUser] = useState('');

    const getProviderName = () => {
        if (!selectedProviderId) return 'Nenhum';
        const names: Record<string, string> = {
            'syncpay': 'SyncPay (Pix)',
            'stripe': 'Stripe (Global)',
            'paypal': 'PayPal'
        };
        return names[selectedProviderId] || selectedProviderId.toUpperCase();
    };

    return (
        <div className="flex flex-col gap-5">
            
            {/* CARD 1: PRECIFICAÇÃO */}
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#00ff821a] flex items-center justify-center text-[#00ff82]">
                        <i className="fa-solid fa-tag text-xs"></i>
                    </div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Estratégia de Preço</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="input-group mb-0">
                        <label>Valor do Acesso</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-black text-xs">
                                {vipCurrency === 'BRL' ? 'R$' : '$'}
                            </span>
                            <input 
                                type="text" 
                                className="input-field pl-12 font-black text-[#00ff82] border-white/5" 
                                value={vipPrice} 
                                onChange={e => {
                                    const v = e.target.value.replace(/\D/g, "");
                                    const n = parseFloat(v) / 100;
                                    setVipPrice(n.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
                                }} 
                            />
                        </div>
                    </div>
                    <div className="input-group mb-0">
                        <label>Moeda de Recebimento</label>
                        <select className="input-field font-black uppercase text-xs border-white/5" value={vipCurrency} onChange={e => setVipCurrency(e.target.value as any)}>
                            <option value="BRL">BRL</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* CARD 2: PROVEDOR DE PAGAMENTO */}
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#00c2ff1a] flex items-center justify-center text-[#00c2ff]">
                            <i className="fa-solid fa-wallet text-xs"></i>
                        </div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Motor de Pagamento</h4>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#00ff821a] px-2 py-0.5 rounded-md border border-[#00ff8222]">
                        <div className="w-1 h-1 rounded-full bg-[#00ff82] animate-pulse"></div>
                        <span className="text-[8px] font-black text-[#00ff82] uppercase">Ativo</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white">{getProviderName()}</span>
                        <span className="text-[9px] text-gray-600 uppercase font-medium">Checkout Verificado</span>
                    </div>
                    <button 
                        onClick={onOpenProviderSelector}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-[#00c2ff] uppercase tracking-widest hover:bg-[#00c2ff1a] transition-all"
                    >
                        Trocar Provedor
                    </button>
                </div>
            </div>
            
            {/* CARD 3: CUSTOMIZAÇÃO VISUAL */}
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD7001a] flex items-center justify-center text-[#FFD700]">
                        <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                    </div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px]">Interface da Porta VIP</h4>
                </div>
                
                <button 
                    className="w-full py-4 bg-white/5 border border-dashed border-[#FFD700]/30 text-[#FFD700] rounded-2xl font-black uppercase text-[10px] tracking-[2px] transition-all hover:bg-[#FFD700]/10 flex items-center justify-center gap-3" 
                    onClick={onOpenDoorEditor}
                >
                    <i className="fa-solid fa-palette"></i> Editar Design do Funil
                </button>
            </div>

            {/* CARD 4: MARKETING & TRACKING */}
            <PixelConfigCard 
                config={pixelConfig}
                onOpen={onOpenPixelEditor}
            />

            {/* CARD 5: CONTROLE MANUAL */}
            <div className="bg-black/20 rounded-[28px] border border-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                        <i className="fa-solid fa-user-plus text-xs"></i>
                    </div>
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[2px]">Concessão Administrativa</h4>
                </div>
                
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        className="input-field flex-1 border-white/5" 
                        placeholder="@usuario..." 
                        value={manualUser} 
                        onChange={e => setManualUser(e.target.value)} 
                    />
                    <button 
                        onClick={async () => { if(await onManualRelease(manualUser)) setManualUser(''); }} 
                        className="bg-white text-black px-6 rounded-xl font-black uppercase text-[10px] hover:bg-[#FFD700] transition-all active:scale-95"
                    >
                        Liberar
                    </button>
                </div>
                <p className="text-[9px] text-gray-700 mt-3 px-1 italic">
                    Utilize para liberar acessos de cortesia ou parcerias manuais.
                </p>
            </div>
        </div>
    );
};
