
import React from 'react';
import { Channel } from '../../../../../types';
import { OptionToggle } from './OptionToggle';

interface ContentOptionsProps {
    channel: Partial<Channel>;
    onUpdate: (updates: Partial<Channel>) => void;
}

export const ContentOptions: React.FC<ContentOptionsProps> = ({ channel, onUpdate }) => {
    return (
        <div className="space-y-3">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1 mb-2">Restrições de Mídia</h4>
            
            <OptionToggle 
                label="Apenas Mídia" 
                sublabel="Bloquear texto puro"
                icon="fa-image"
                checked={!!channel.mediaOnly}
                onChange={() => onUpdate({ mediaOnly: !channel.mediaOnly })}
            />

            <OptionToggle 
                label="Bloquear Links" 
                sublabel="Anti-spam de URLs"
                icon="fa-link-slash"
                checked={!!channel.blockLinks}
                onChange={() => onUpdate({ blockLinks: !channel.blockLinks })}
            />

            <OptionToggle 
                label="Proibir Áudios" 
                sublabel="Remover msgs de voz"
                icon="fa-microphone-slash"
                checked={!!channel.noAudio}
                onChange={() => onUpdate({ noAudio: !channel.noAudio })}
            />

            <OptionToggle 
                label="Conteúdo Sensível" 
                sublabel="Marcador NSFW (+18)"
                icon="fa-triangle-exclamation"
                checked={!!channel.nsfw}
                danger
                onChange={() => onUpdate({ nsfw: !channel.nsfw })}
            />
        </div>
    );
};
