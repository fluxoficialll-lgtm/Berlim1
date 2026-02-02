
import React from 'react';

interface GatewayCardProps {
    activeProvider: string; // Mudado de array para string única
    onManage: () => void;
}

export const GatewayCard: React.FC<GatewayCardProps> = ({ activeProvider, onManage }) => {
    const hasActive = !!activeProvider;

    return (
        <div className="flux-card bg-white/5 border border-white/10 rounded-[20px] p-6 shadow-2xl animate-fade-in">
            <div className="text-[16px] font-bold text-white mb-4">
                <i className="fa-solid fa-plug text-[#00c2ff] mr-2"></i> Gateway de Pagamento
            </div>
            
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold uppercase mb-4 ${hasActive ? 'bg-[#00ff82]/10 text-[#00ff82]' : 'bg-red-500/10 text-red-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${hasActive ? 'bg-[#00ff82] shadow-[0_0_5px_#00ff82]' : 'bg-red-500 shadow-[0_0_5px_#ff4d4d]'}`}></div>
                {hasActive ? (
                    <span>{activeProvider} Selecionado</span>
                ) : (
                    <span>Nenhum Provedor Ativo</span>
                )}
            </div>

            <button 
                className="w-full py-4 bg-[#1e2531] border border-[#00c2ff] text-[#00c2ff] text-[15px] font-extrabold rounded-xl cursor-pointer transition-all hover:bg-[#00c2ff]/10" 
                onClick={onManage}
            >
                {hasActive ? 'TROCAR GATEWAY' : 'CONECTAR AGORA'}
            </button>
        </div>
    );
};
