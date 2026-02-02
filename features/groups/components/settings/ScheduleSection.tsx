
import React from 'react';
import { ScheduledMessage, Channel } from '../../../../types';

interface ScheduleSectionProps {
    schedules: ScheduledMessage[];
    channels: Channel[];
    onAddClick: () => void;
    onDelete: (id: string) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ 
    schedules, channels, onAddClick, onDelete 
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Postagens em Fila</h2>
                <button onClick={onAddClick} className="bg-[#00c2ff] text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase">Programar</button>
            </div>

            <div className="space-y-4">
                {schedules.map(s => (
                    <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                                    <i className="fa-regular fa-clock"></i>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-widest">
                                        #{s.channelId === 'general' ? 'Geral' : channels.find(c => c.id === s.channelId)?.name}
                                    </span>
                                    <div className="text-xs font-bold">{new Date(s.scheduledTime).toLocaleString()}</div>
                                </div>
                            </div>
                            <button onClick={() => onDelete(s.id)} className="text-red-400 p-2"><i className="fa-solid fa-trash-can text-sm"></i></button>
                        </div>
                        <p className="text-sm text-gray-300 italic">"{s.text}"</p>
                    </div>
                ))}

                {schedules.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <i className="fa-solid fa-calendar-plus text-5xl mb-4"></i>
                        <p className="text-sm font-bold">Fila de agendamento vazia.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
