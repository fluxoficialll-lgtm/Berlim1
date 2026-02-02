
import React from 'react';
import { SalesFolder, SalesSection, Channel } from '../../../../types';
import { OptionToggle } from '../channels/options/OptionToggle';

interface FolderOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: 'folder' | 'section';
    target: SalesFolder | SalesSection | null;
    onUpdateFolder?: (updates: Partial<SalesFolder>) => void;
    onAddFolderInside?: () => void;
    onAddChannelInside?: () => void;
}

export const FolderOptionsModal: React.FC<FolderOptionsModalProps> = ({
    isOpen,
    onClose,
    title,
    type,
    target,
    onUpdateFolder,
    onAddFolderInside,
    onAddChannelInside
}) => {
    if (!isOpen) return null;

    const isSection = type === 'section';
    const folder = target as SalesFolder;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md bg-black/80 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-[#1a1e26] border border-white/10 rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-pop-in flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-[#00c2ff] uppercase tracking-[3px]">
                            {isSection ? 'Gerenciar Categoria' : 'Configurações da Pasta'}
                        </span>
                        <h3 className="text-base font-bold text-white truncate max-w-[200px]">{title}</h3>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-90">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-10">
                    {isSection && (
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1 mb-2">Adicionar Conteúdo</h4>
                            
                            <button 
                                onClick={() => {
                                    onAddFolderInside?.();
                                    onClose();
                                }}
                                className="w-full py-5 bg-[#00c2ff1a] border border-[#00c2ff33] text-[#00c2ff] font-black rounded-[24px] uppercase text-[11px] tracking-[2px] hover:bg-[#00c2ff2a] transition-all flex items-center justify-center gap-3"
                            >
                                <i className="fa-solid fa-folder-plus text-lg"></i>
                                Criar Pastas
                            </button>

                            <button 
                                onClick={() => {
                                    onAddChannelInside?.();
                                    onClose();
                                }}
                                className="w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-[24px] uppercase text-[11px] tracking-[2px] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                                <i className="fa-solid fa-hashtag text-lg"></i>
                                Criar Canais
                            </button>
                        </div>
                    )}

                    {!isSection && onUpdateFolder && (
                        <>
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1 mb-2">Permissões de Acesso</h4>
                                
                                <OptionToggle 
                                    label="Permitir Download" 
                                    sublabel="Membros podem baixar arquivos"
                                    icon="fa-cloud-arrow-down"
                                    checked={!!folder.allowDownload}
                                    onChange={() => onUpdateFolder({ allowDownload: !folder.allowDownload })}
                                />

                                <OptionToggle 
                                    label="Upload de Membros" 
                                    sublabel="Membros podem enviar arquivos"
                                    icon="fa-upload"
                                    checked={!!folder.allowMemberUpload}
                                    onChange={() => onUpdateFolder({ allowMemberUpload: !folder.allowMemberUpload })}
                                />
                            </div>

                            <div className="h-px bg-white/5 mx-2"></div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Descrição Curta</h4>
                                <textarea 
                                    value={(folder as any).description || ''}
                                    onChange={(e) => onUpdateFolder({ description: e.target.value } as any)}
                                    placeholder="Ex: Biblioteca de arquivos de apoio..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-[#00c2ff] resize-none min-h-[80px]"
                                />
                            </div>
                        </>
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
