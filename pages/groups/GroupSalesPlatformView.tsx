
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';
import { Group } from '../../types';

// Subcomponentes
import { OwnerControls } from '../../features/groups/components/platform/OwnerControls';
import { PlatformGroupCard } from '../../features/groups/components/platform/PlatformGroupCard';

export const GroupSalesPlatformView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [canManage, setCanManage] = useState(false);

    useEffect(() => {
        if (id) {
            const foundGroup = groupService.getGroupById(id);
            if (foundGroup) {
                setGroup(foundGroup);
                const currentUserId = authService.getCurrentUserId();
                // Permitir controles para o dono OU administradores
                const hasPower = foundGroup.creatorId === currentUserId || foundGroup.adminIds?.includes(currentUserId || '');
                setCanManage(hasPower);
            } else {
                navigate('/groups');
            }
        }
    }, [id, navigate]);

    if (!group) return null;

    const handleFolderClick = (folderId: string) => {
        navigate(`/group-folder/${group.id}/${folderId}`);
    };

    const handleChannelClick = (channelId: string) => {
        navigate(`/group-chat/${group.id}/${channelId}`);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <style>{`
                .platform-header {
                    height: 75px;
                    padding: 0 24px;
                    display: flex;
                    align-items: center;
                    background: #0c0f14;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    position: sticky;
                    top: 0;
                    z-index: 40;
                }
                
                .owner-controls {
                    position: fixed;
                    top: 17px;
                    right: 20px;
                    z-index: 50;
                    display: flex;
                    gap: 12px;
                    height: 40px;
                    align-items: center;
                }
                .ctrl-btn {
                    width: 42px;
                    height: 42px;
                    background: rgba(255,255,255,0.05);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00c2ff;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .ctrl-btn:hover { 
                    background: #00c2ff; 
                    color: #000; 
                    box-shadow: 0 0 20px rgba(0, 194, 255, 0.4);
                    transform: translateY(-2px);
                }
                
                .main-scroll-area {
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }

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
                .channel-icon-box {
                    background: linear-gradient(135deg, #00ff821a 0%, #00ff8205 100%);
                    border-color: rgba(0, 255, 130, 0.3);
                    color: #00ff82;
                }
                .count-badge-new {
                    background: #00c2ff;
                    color: #000;
                    padding: 2px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                }
                .channel-badge {
                    background: #00ff82;
                }
            `}</style>

            <header className="platform-header">
                <button onClick={() => navigate('/groups')} className="text-[#00c2ff] text-xl p-2 -ml-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="ml-2 flex flex-col">
                    <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[3px]">Hub da Comunidade</span>
                </div>
            </header>

            {canManage && <OwnerControls group={group} />}

            <main className="main-scroll-area p-5 pb-32">
                <div className="max-w-[600px] mx-auto w-full">
                    
                    <div className="mb-12">
                        <PlatformGroupCard group={group} />
                    </div>

                    {(group.salesPlatformSections || []).map(section => (
                        <section key={section.id} className="mb-12 animate-fade-in">
                            <div className="flex flex-col gap-1 mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-1 bg-[#00c2ff] rounded-full shadow-[0_0_10px_#00c2ff]"></div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-[3px]">{section.title}</h3>
                                </div>
                                <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent mt-2"></div>
                            </div>
                            
                            <div className="grid gap-3">
                                {/* Renderizar Pastas da Seção */}
                                {(section.folders || []).map(folder => (
                                    <div key={folder.id} className="folder-item-premium" onClick={() => handleFolderClick(folder.id)}>
                                        <div className="icon-gradient-box">
                                            <i className="fa-solid fa-folder-open"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-extrabold text-white text-base truncate mb-1.5">{folder.name}</h4>
                                            <span className="count-badge-new">{folder.items?.length || 0} Arquivos</span>
                                        </div>
                                        <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
                                    </div>
                                ))}

                                {/* Renderizar Canais da Seção */}
                                {(section.channels || []).map(channel => (
                                    <div key={channel.id} className="folder-item-premium" onClick={() => handleChannelClick(channel.id)}>
                                        <div className="icon-gradient-box channel-icon-box">
                                            <i className="fa-solid fa-comments"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-extrabold text-white text-base truncate mb-1.5"># {channel.name}</h4>
                                            <span className="count-badge-new channel-badge">Canal de Chat</span>
                                        </div>
                                        <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {(!group.salesPlatformSections || group.salesPlatformSections.length === 0) && (
                        <div className="text-center py-20 opacity-30 border-2 border-dashed border-white/5 rounded-[40px] mt-4">
                            <i className="fa-solid fa-store-slash text-3xl text-gray-600 mb-4"></i>
                            <p className="font-black uppercase tracking-widest text-[11px]">Nenhum conteúdo disponível.</p>
                        </div>
                    )}

                    <div className="mt-20 text-center opacity-10">
                        <div className="text-[9px] uppercase font-black tracking-[5px] mb-2">Flux Hub Engine v4.3</div>
                        <div className="w-10 h-1 bg-white mx-auto rounded-full"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};
