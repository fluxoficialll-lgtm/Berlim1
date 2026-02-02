
import React from 'react';
import { Channel, ChannelSection } from '../../../../types';
import { ChannelListItem } from './channels/ChannelListItem';

interface ChannelsSectionProps {
    channels: Channel[];
    sections: ChannelSection[];
    onAddChannel: () => void;
    onAddSection: () => void;
    onOptions: (target: Channel | ChannelSection, type: 'channel' | 'section') => void;
    onDeleteChannel: (id: string) => void;
    onDeleteSection: (id: string) => void;
    onUpdateSectionTitle: (id: string, title: string) => void;
    onMoveSection: (index: number, direction: 'up' | 'down') => void;
}

export const ChannelsSection: React.FC<ChannelsSectionProps> = ({ 
    channels, sections, onAddChannel, onAddSection, onOptions, onDeleteChannel, onDeleteSection, onUpdateSectionTitle, onMoveSection
}) => {
    
    const getChannelsForSection = (section: ChannelSection) => {
        return (section.channelIds || []).map(id => {
            if (id === 'general') return { id: 'general', name: 'Geral', onlyAdminsPost: false, type: 'text' };
            return channels.find(c => c.id === id);
        }).filter(Boolean) as Channel[];
    };

    const orphans = channels.filter(c => !sections.some(s => (s.channelIds || []).includes(c.id)));
    const hasGeneralOrphan = !sections.some(s => (s.channelIds || []).includes('general'));

    return (
        <div className="space-y-10">
            {/* Seções Criadas pelo Usuário */}
            {sections.map((section, index) => (
                <div key={section.id} className="bg-white/5 border border-white/10 rounded-[32px] p-6 animate-slide-up shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex flex-col gap-1 mr-1">
                            <button 
                                onClick={() => onMoveSection(index, 'up')}
                                disabled={index === 0}
                                className="w-8 h-8 rounded-lg bg-white/5 text-[#00c2ff] disabled:opacity-10 hover:bg-[#00c2ff]/10 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-up text-[10px]"></i>
                            </button>
                            <button 
                                onClick={() => onMoveSection(index, 'down')}
                                disabled={index === sections.length - 1}
                                className="w-8 h-8 rounded-lg bg-white/5 text-[#00c2ff] disabled:opacity-10 hover:bg-[#00c2ff]/10 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-down text-[10px]"></i>
                            </button>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-[#00c2ff1a] flex items-center justify-center text-[#00c2ff]">
                            <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <input 
                            type="text"
                            className="flex-1 bg-transparent border-none text-white font-black text-sm uppercase tracking-widest outline-none focus:text-[#00c2ff] transition-all"
                            value={section.title}
                            onChange={(e) => onUpdateSectionTitle(section.id, e.target.value)}
                            placeholder="Nome da Seção"
                        />
                        
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => onOptions(section, 'section')}
                                className="text-gray-400 hover:text-[#00c2ff] p-2"
                            >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <button 
                                onClick={() => onDeleteSection(section.id)}
                                className="text-gray-600 hover:text-red-500 p-2"
                            >
                                <i className="fa-solid fa-trash-can text-sm"></i>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {getChannelsForSection(section).map(c => (
                            <ChannelListItem 
                                key={c.id}
                                channel={c}
                                onOptions={(channel) => onOptions(channel, 'channel')}
                                onDelete={c.id === 'general' ? () => {} : () => onDeleteChannel(c.id)}
                                isDefault={c.id === 'general'}
                            />
                        ))}
                        {(!section.channelIds || section.channelIds.length === 0) && (
                            <div className="py-4 text-center border border-dashed border-white/5 rounded-2xl opacity-20">
                                <span className="text-[10px] font-black uppercase tracking-widest">Seção Vazia</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Seção Padrão (Canais órfãos e Geral) */}
            {(hasGeneralOrphan || orphans.length > 0) && (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-[32px] p-6 animate-slide-up shadow-sm">
                    <div className="flex items-center gap-3 mb-6 opacity-60">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                            <i className="fa-solid fa-folder-tree"></i>
                        </div>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            Canais Principais
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {hasGeneralOrphan && (
                            <ChannelListItem 
                                channel={{ id: 'general', name: 'Geral', onlyAdminsPost: false, type: 'text' }}
                                onOptions={(c) => onOptions(c, 'channel')}
                                onDelete={() => {}}
                                isDefault
                            />
                        )}
                        {orphans.map(c => (
                            <ChannelListItem 
                                key={c.id}
                                channel={c}
                                onOptions={(channel) => onOptions(channel, 'channel')}
                                onDelete={() => onDeleteChannel(c.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Ações de Criação */}
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={onAddSection}
                    className="py-4 bg-[#00c2ff1a] border border-[#00c2ff33] text-[#00c2ff] font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-[#00c2ff2a] active:scale-[0.98] transition-all"
                >
                    <i className="fa-solid fa-folder-plus mr-2"></i> Nova Seção
                </button>
                <button 
                    onClick={onAddChannel}
                    className="py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                    <i className="fa-solid fa-hashtag mr-2"></i> Novo Canal
                </button>
            </div>
        </div>
    );
};
