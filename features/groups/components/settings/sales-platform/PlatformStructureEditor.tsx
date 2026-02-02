
import React from 'react';
import { SalesSection, SalesFolder, Channel } from '../../../../types';

interface PlatformStructureEditorProps {
    sections: SalesSection[];
    onSectionsChange: (sections: SalesSection[]) => void;
    onOptions: (target: SalesFolder | SalesSection | Channel, type: 'folder' | 'section' | 'channel') => void;
}

export const PlatformStructureEditor: React.FC<PlatformStructureEditorProps> = ({ 
    sections, 
    onSectionsChange, 
    onOptions 
}) => {
    
    // --- Lógica de Movimentação ---
    
    const moveItem = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
        const newArr = [...arr];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newArr.length) return newArr;
        
        [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
        return newArr;
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        onSectionsChange(moveItem(sections, index, direction));
    };

    // --- Lógica de CRUD ---

    const addSection = () => {
        const newSection: SalesSection = {
            id: `sec_${Date.now()}`,
            title: `Nova Categoria`,
            folders: [],
            channels: []
        };
        onSectionsChange([...sections, newSection]);
    };

    const updateSectionTitle = (id: string, title: string) => {
        onSectionsChange(sections.map(s => s.id === id ? { ...s, title } : s));
    };

    const removeSection = (id: string) => {
        if (confirm("Deseja apagar toda esta categoria, suas pastas e canais?")) {
            onSectionsChange(sections.filter(s => s.id !== id));
        }
    };

    const updateFolderName = (sectionId: string, folderId: string, name: string) => {
        onSectionsChange(sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    folders: (s.folders || []).map(f => f.id === folderId ? { ...f, name } : f)
                };
            }
            return s;
        }));
    };

    const removeFolder = (sectionId: string, folderId: string) => {
        onSectionsChange(sections.map(s => {
            if (s.id === sectionId) {
                return { ...s, folders: (s.folders || []).filter(f => f.id !== folderId) };
            }
            return s;
        }));
    };

    const removeChannelFromSection = (sectionId: string, channelId: string) => {
        onSectionsChange(sections.map(s => {
            if (s.id === sectionId) {
                return { ...s, channels: s.channels?.filter(c => c.id !== channelId) };
            }
            return s;
        }));
    };

    const updateChannelName = (sectionId: string, channelId: string, name: string) => {
        onSectionsChange(sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    channels: s.channels?.map(c => c.id === channelId ? { ...c, name } : c)
                };
            }
            return s;
        }));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex items-center justify-between px-1">
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Estrutura da Vitrine</h3>
                    <p className="text-xs text-gray-500 font-medium">Categorias com pastas de conteúdo e canais de chat.</p>
                </div>
            </header>

            <div className="space-y-6">
                {sections.map((section, sIndex) => (
                    <div key={section.id} className="bg-white/5 border border-white/10 rounded-[32px] p-6 animate-slide-up relative">
                        
                        {/* Header da Seção (Categoria) */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex flex-col gap-1 mr-1">
                                <button onClick={() => moveSection(sIndex, 'up')} disabled={sIndex === 0} className="w-8 h-8 rounded-lg bg-white/5 text-[#00c2ff] disabled:opacity-10">
                                    <i className="fa-solid fa-chevron-up text-[10px]"></i>
                                </button>
                                <button onClick={() => moveSection(sIndex, 'down')} disabled={sIndex === sections.length - 1} className="w-8 h-8 rounded-lg bg-white/5 text-[#00c2ff] disabled:opacity-10">
                                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                </button>
                            </div>

                            <input 
                                type="text"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white font-black text-sm uppercase tracking-widest outline-none focus:border-[#00c2ff]"
                                placeholder="Nome da Categoria"
                                value={section.title}
                                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                            />
                            
                            <div className="flex items-center gap-1">
                                <button onClick={() => onOptions(section, 'section')} className="text-gray-400 hover:text-[#00c2ff] p-2">
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                                <button onClick={() => removeSection(section.id)} className="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Excluir Categoria">
                                    <i className="fa-solid fa-trash-can text-sm"></i>
                                </button>
                            </div>
                        </div>

                        {/* Itens da Seção */}
                        <div className="space-y-3 pl-4 border-l-2 border-white/5 ml-4">
                            {/* Renderizar Pastas */}
                            {section.folders?.map((folder) => (
                                <div key={folder.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff] text-[10px]">
                                        <i className="fa-solid fa-folder"></i>
                                    </div>
                                    <input 
                                        type="text"
                                        className="flex-1 bg-transparent border-none text-white font-bold text-sm outline-none"
                                        placeholder="Nome da Pasta"
                                        value={folder.name}
                                        onChange={(e) => updateFolderName(section.id, folder.id, e.target.value)}
                                    />
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => onOptions(folder, 'folder')} className="text-gray-500 hover:text-[#00c2ff] p-2"><i className="fa-solid fa-ellipsis-vertical text-xs"></i></button>
                                        <button 
                                            onClick={() => removeFolder(section.id, folder.id)} 
                                            className="text-red-400/40 hover:text-red-500 p-2 transition-colors"
                                            title="Excluir Pasta"
                                        >
                                            <i className="fa-solid fa-trash-can text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Renderizar Canais */}
                            {section.channels?.map((channel) => (
                                <div key={channel.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-[#00ff821a] group hover:border-[#00ff8233] transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-[#00ff82]/10 flex items-center justify-center text-[#00ff82] text-[10px]">
                                        <i className="fa-solid fa-hashtag"></i>
                                    </div>
                                    <input 
                                        type="text"
                                        className="flex-1 bg-transparent border-none text-white font-bold text-sm outline-none"
                                        placeholder="Nome do Canal"
                                        value={channel.name}
                                        onChange={(e) => updateChannelName(section.id, channel.id, e.target.value)}
                                    />
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => onOptions(channel, 'channel')} className="text-gray-500 hover:text-[#00ff82] p-2"><i className="fa-solid fa-ellipsis-vertical text-xs"></i></button>
                                        <button 
                                            onClick={() => removeChannelFromSection(section.id, channel.id)} 
                                            className="text-red-400/40 hover:text-red-500 p-2 transition-colors"
                                            title="Excluir Canal"
                                        >
                                            <i className="fa-solid fa-trash-can text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {(!section.folders || section.folders.length === 0) && (!section.channels || section.channels.length === 0) && (
                                <div className="py-4 text-center opacity-20">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Seção Vazia - Clique nos 3 pontos para adicionar</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Botão de Criação de Categoria */}
                <button 
                    onClick={addSection}
                    className="w-full py-8 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center gap-3 text-gray-600 hover:text-[#00c2ff] hover:border-[#00c2ff33] transition-all group mt-4"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#00c2ff1a]">
                        <i className="fa-solid fa-plus text-xl transition-transform group-hover:scale-110"></i>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[4px]">Adicionar Nova Categoria</span>
                </button>
            </div>
        </div>
    );
};
