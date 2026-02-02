
import React from 'react';

interface Folder {
    id: string;
    name: string;
    itemsCount: number;
}

interface FolderSectionProps {
    title?: string;
    folders: Folder[];
    onFolderClick: (id: string) => void;
}

export const FolderSection: React.FC<FolderSectionProps> = ({ title, folders, onFolderClick }) => {
    return (
        <section className="mb-12 animate-fade-in last:mb-20">
            {title && (
                <div className="flex flex-col gap-1 mb-6 px-2">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-1 bg-[#00c2ff] rounded-full shadow-[0_0_10px_#00c2ff]"></div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[3px]">{title}</h3>
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent mt-2"></div>
                </div>
            )}
            
            <div className="grid gap-3">
                {folders.map(folder => (
                    <div 
                        key={folder.id} 
                        className="folder-item-premium" 
                        onClick={() => onFolderClick(folder.id)}
                    >
                        <style>{`
                            .folder-item-premium {
                                background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
                                border: 1px solid rgba(255, 255, 255, 0.05);
                                border-radius: 24px;
                                padding: 20px 24px;
                                display: flex;
                                align-items: center;
                                gap: 20px;
                                cursor: pointer;
                                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                                position: relative;
                                overflow: hidden;
                            }
                            .folder-item-premium:hover {
                                background: rgba(255, 255, 255, 0.07);
                                border-color: rgba(0, 194, 255, 0.3);
                                transform: translateY(-3px) scale(1.01);
                                box-shadow: 0 15px 30px rgba(0,0,0,0.4);
                            }
                            .folder-item-premium:active { transform: scale(0.98); }
                            
                            .icon-gradient-box {
                                width: 54px;
                                height: 54px;
                                background: linear-gradient(135deg, #1e2531 0%, #0c0f14 100%);
                                color: #00c2ff;
                                border-radius: 18px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 24px;
                                border: 1px solid rgba(0, 194, 255, 0.2);
                                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                            }
                            .count-badge-new {
                                background: #00c2ff;
                                color: #000;
                                padding: 2px 10px;
                                border-radius: 8px;
                                font-size: 10px;
                                font-weight: 900;
                                text-transform: uppercase;
                                box-shadow: 0 0 10px rgba(0, 194, 255, 0.2);
                            }
                        `}</style>

                        <div className="icon-gradient-box">
                            <i className="fa-solid fa-folder-open"></i>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-white text-base truncate mb-1.5">{folder.name}</h4>
                            <div className="flex items-center gap-2">
                                <span className="count-badge-new">{folder.itemsCount} Arquivos</span>
                            </div>
                        </div>
                        
                        <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
                    </div>
                ))}
            </div>
        </section>
    );
};
