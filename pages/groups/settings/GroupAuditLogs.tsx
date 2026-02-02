
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupAuditLogs } from '../../../features/groups/hooks/settings/useGroupAuditLogs';
import { AuditLogList } from '../../../features/groups/components/settings/audit/AuditLogList';

export const GroupAuditLogs: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { logs, loading } = useGroupAuditLogs(id);

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
                <button 
                    onClick={() => navigate(`/group-settings/${id}`)} 
                    className="mr-4 text-white text-xl p-2 hover:bg-white/5 rounded-full transition-all"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold">Logs de Auditoria</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-5 max-w-[600px] mx-auto w-full pb-10 no-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <i className="fa-solid fa-list-check"></i>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Transparência Administrativa</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                                    Histórico de ações recentes
                                </p>
                            </div>
                        </div>

                        <AuditLogList logs={logs} />
                    </div>
                )}
                
                <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
                    <p className="text-[11px] text-blue-300 leading-relaxed italic text-center">
                        "Logs de auditoria são imutáveis e essenciais para a segurança de grupos com múltiplos moderadores."
                    </p>
                </div>
            </main>
        </div>
    );
};
