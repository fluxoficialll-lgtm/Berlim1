
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';
import { Group } from '../../types';

// Subcomponentes Modulares
import { ChannelsHero } from '../../features/groups/components/channels/ChannelsHero';
import { ChannelListRenderer } from '../../features/groups/components/channels/ChannelListRenderer';
import { ChannelsFooter } from '../../features/groups/components/channels/ChannelsFooter';
import { OwnerControls } from '../../features/groups/components/platform/OwnerControls';

export const GroupChannelsList: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (id) {
            const foundGroup = groupService.getGroupById(id);
            if (foundGroup) {
                setGroup(foundGroup);
                const currentUserId = authService.getCurrentUserId();
                const isAdm = foundGroup.creatorId === currentUserId || foundGroup.adminIds?.includes(currentUserId || '');
                setIsAdmin(!!isAdm);
            } else {
                navigate('/groups');
            }
            setLoading(false);
        }
    }, [id, navigate]);

    if (loading || !group) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    const handleChannelClick = (channelId: string) => {
        navigate(`/group-chat/${id}/${channelId}`);
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col">
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
                    z-index: 60;
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
            `}</style>

            <header className="platform-header">
                <button onClick={() => navigate('/groups')} className="text-[#00c2ff] text-xl p-2 -ml-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="ml-2 flex flex-col">
                    <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[3px]">Canais da Comunidade</span>
                </div>
            </header>

            {isAdmin && <OwnerControls group={group} />}

            <main className="flex-1 p-5 pt-10 max-w-[600px] mx-auto w-full flex flex-col">
                <ChannelsHero 
                    groupName={group.name} 
                    coverImage={group.coverImage} 
                />

                <ChannelListRenderer 
                    group={group} 
                    isAdmin={isAdmin} 
                    onChannelClick={handleChannelClick} 
                />
                
                <ChannelsFooter />
            </main>
        </div>
    );
};
