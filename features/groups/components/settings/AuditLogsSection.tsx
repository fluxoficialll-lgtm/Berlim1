
import React from 'react';
import { AuditLog } from '../../../../types';

interface AuditLogsSectionProps {
    logs: AuditLog[];
}

export const AuditLogsSection: React.FC<AuditLogsSectionProps> = ({ logs }) => {
    const formatTime = (ts: number) => new Date(ts).toLocaleString('pt-BR', { 
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <i className="fa-solid fa-list-check"></i>
                </div>
                <div>
                    <h4 className="text-sm font-bold">Transparência Administrativa</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Histórico de ações recentes</p>
                </div>
            </div>

            <div className="space-y-4">
                {logs.length > 0 ? logs.map(log => (
                    <div key={log.id} className="relative pl-6 border-l border-white/10 py-1">
                        <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-[#00c2ff] shadow-[0_0_10px_#00c2ff]"></div>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[11px] font-bold text-[#00c2ff] uppercase tracking-tighter">{log.action}</span>
                            <span className="text-[10px] text-gray-600">{formatTime(log.timestamp)}</span>
                        </div>
                        <p className="text-sm text-white/90 font-medium mb-1">{log.target}</p>
                        <div className="text-[10px] text-gray-500">Por: <strong className="text-white/60">{log.adminName}</strong></div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-600 italic text-xs">
                        Nenhum log disponível.
                    </div>
                )}
            </div>
        </div>
    );
};
