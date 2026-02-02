
import React from 'react';
import { Channel, ChannelSection } from '../../../../types';
import { ModerationOptions } from './options/ModerationOptions';
import { ContentOptions } from './options/ContentOptions';

interface ChannelOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: 'channel' | 'section';
    target: Channel | ChannelSection | null;
    onUpdateChannel?: (updates: Partial<Channel>) => void;
    onAddChannelInside?: () => void;
}

export const ChannelOptionsModal: React.FC<ChannelOptionsModalProps> = ({
    isOpen,
    onClose,
    title,
    type,
    target,
    onUpdateChannel,
    onAddChannelInside
}) => {
    if (!isOpen) return null;

    const isSection = type === 'section';
    const channel = target as Channel;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-[#1a1e26] border border-white/10 rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-pop-in flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-[#00c2ff] uppercase tracking-[3px]">Preferências</span>
                        <h3 className="text-base font-bold text-white truncate max-w-[200px]">{title}</h3>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-90">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-10">
                    {/* Ação primária se for Seção: Criar Canal */}
                    {isSection && onAddChannelInside && (
                        <button 
                            onClick={() => {
                                onAddChannelInside();
                                onClose();
                            }}
                            className="w-full py-5 bg-[#00c2ff1a] border border-[#00c2ff33] text-[#00c2ff] font-black rounded-[24px] uppercase text-[11px] tracking-[2px] hover:bg-[#00c2ff2a] transition-all flex items-center justify-center gap-3 mb-2"
                        >
                            <i className="fa-solid fa-plus-circle text-lg"></i>
                            Novo Canal nesta Seção
                        </button>
                    )}

                    {!isSection && onUpdateChannel && (
                        <>
                            {/* Bloco 1: Moderação */}
                            <ModerationOptions 
                                channel={channel} 
                                onUpdate={onUpdateChannel} 
                            />

                            <div className="h-px bg-white/5 mx-2"></div>

                            {/* Bloco 2: Restrições */}
                            <ContentOptions 
                                channel={channel} 
                                onUpdate={onUpdateChannel} 
                            />

                            <div className="h-px bg-white/5 mx-2"></div>

                            {/* Bloco 3: Tópico */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Assunto do Canal</h4>
                                <textarea 
                                    value={channel.topic || ''}
                                    onChange={(e) => onUpdateChannel({ topic: e.target.value })}
                                    placeholder="Ex: Espaço para tirar dúvidas sobre o módulo 1..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-[#00c2ff] resize-none min-h-[80px]"
                                />
                            </div>
                        </>
                    )}

                    {isSection && (
                        <div className="p-10 text-center opacity-20 flex flex-col items-center gap-4">
                            <i className="fa-solid fa-layer-group text-4xl"></i>
                            <p className="text-[10px] font-black uppercase tracking-widest">Opções de Seção em breve</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-[#0c0f14] border-t border-white/5 shrink-0">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-white/5 text-gray-400 font-black rounded-2xl uppercase text-[10px] tracking-[2px] hover:text-white transition-all active:scale-95"
                    >
                        Concluído
                    </button>
                </div>
            </div>
        </div>
    );
};
