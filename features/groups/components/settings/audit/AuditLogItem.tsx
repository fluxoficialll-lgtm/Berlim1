
import React from 'react';
import { AuditLog } from '../../../../../types';

interface AuditLogItemProps {
    log: AuditLog;
}

export const AuditLogItem: React.FC<AuditLogItemProps> = ({ log }) => {
    const formatTime = (ts: number) => new Date(ts).toLocaleString('pt-BR', { 
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });

    return (
        <div className="relative pl-6 border-l border-white/10 py-1">
            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-[#00c2ff] shadow-[0_0_10px_#00c2ff]"></div>
            <div className="flex justify-between items-start mb-1">
                <span className="text-[11px] font-bold text-[#00c2ff] uppercase tracking-tighter">
                    {log.action}
                </span>
                <span className="text-[10px] text-gray-600">
                    {formatTime(log.timestamp)}
                </span>
            </div>
            <p className="text-sm text-white/90 font-medium mb-1">{log.target}</p>
            <div className="text-[10px] text-gray-500">
                Por: <strong className="text-white/60">{log.adminName}</strong>
            </div>
        </div>
    );
};
