
import React from 'react';
import { Channel } from '../../../../../types';
import { OptionToggle } from './OptionToggle';

interface ModerationOptionsProps {
    channel: Partial<Channel>;
    onUpdate: (updates: Partial<Channel>) => void;
}

export const ModerationOptions: React.FC<ModerationOptionsProps> = ({ channel, onUpdate }) => {
    return (
        <div className="space-y-3">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1 mb-2">Fluxo & Moderação</h4>
            
            <OptionToggle 
                label="Somente Admins" 
                sublabel="Membros apenas leem"
                icon="fa-shield-halved"
                checked={!!channel.onlyAdminsPost}
                onChange={() => onUpdate({ onlyAdminsPost: !channel.onlyAdminsPost })}
            />

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-orange-400">
                        <i className="fa-solid fa-hourglass-half text-xs"></i>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-200">Modo Lento</span>
                        <span className="text-[9px] text-gray-600 uppercase font-black">Intervalo de envio</span>
                    </div>
                </div>
                <select 
                    value={channel.slowMode || 0}
                    onChange={(e) => onUpdate({ slowMode: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00c2ff]"
                >
                    <option value={0}>Desativado</option>
                    <option value={10}>10 segundos</option>
                    <option value={30}>30 segundos</option>
                    <option value={60}>1 minuto</option>
                    <option value={300}>5 minutos</option>
                </select>
            </div>

            <OptionToggle 
                label="Desativar Reações" 
                sublabel="Ocultar emojis em msgs"
                icon="fa-face-smile-slash"
                checked={!!channel.disableReactions}
                onChange={() => onUpdate({ disableReactions: !channel.disableReactions })}
            />
        </div>
    );
};
