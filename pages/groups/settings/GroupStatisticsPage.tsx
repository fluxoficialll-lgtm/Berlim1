
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupSettings } from '../../../features/groups/hooks/useGroupSettings';
import { StatisticsSection } from '../../../features/groups/components/settings/StatisticsSection';

export const GroupStatisticsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { group, loading, form } = useGroupSettings();

    if (loading || !group) return null;

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
                <button onClick={() => navigate(`/group-settings/${id}`)} className="mr-4 text-white text-xl">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold">Estrutura e Estatísticas</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-5 max-w-[600px] mx-auto w-full pb-24 no-scrollbar">
                <StatisticsSection 
                    members={form.members} 
                    roles={form.roles || []}
                    memberLimit={form.memberLimit}
                />
                
                <div className="mt-8 bg-[#00c2ff1a] border border-[#00c2ff33] p-5 rounded-2xl">
                    <div className="flex gap-4">
                        <i className="fa-solid fa-circle-nodes text-[#00c2ff] text-xl"></i>
                        <div>
                            <h4 className="text-sm font-black text-[#00c2ff] uppercase tracking-wider mb-1">Escalabilidade Flux</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Seu grupo está preparado para o crescimento em massa. Os limites garantem que comunidades gigantescas mantenham uma moderação eficiente.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0a0c10] to-transparent">
                <button 
                    className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase tracking-widest text-xs transition-all hover:bg-white/10"
                    onClick={() => navigate(`/group-settings/${id}`)}
                >
                    Voltar
                </button>
            </div>
        </div>
    );
};
