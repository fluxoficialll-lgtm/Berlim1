
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AvatarPreviewModal } from './ui/AvatarPreviewModal';
import { UserBadge } from './ui/user/UserBadge';

interface PostHeaderProps {
    username: string;
    time: string;
    location?: string;
    isAdult?: boolean;
    isAd?: boolean;
    onClick: () => void;
    isOwner: boolean;
    onDelete: (e: React.MouseEvent) => void;
    authorEmail?: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ 
    username, 
    time, 
    location, 
    isAdult, 
    isAd, 
    onClick, 
    isOwner, 
    onDelete,
    authorEmail
}) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!username) return;
        const fetchUserData = async () => {
            const user = await authService.fetchUserByHandle(username, authorEmail);
            if (user) {
                setUserData(user);
            }
            setIsLoading(false);
        };
        fetchUserData();
    }, [username, authorEmail]);

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const cleanHandle = username.replace('@', '').toLowerCase().trim();
        navigate(`/user/${cleanHandle}`, { state: { emailFallback: authorEmail } });
    };

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userData?.profile?.photoUrl) {
            setIsPreviewOpen(true);
        } else {
            handleProfileClick(e);
        }
    };

    const displayName = userData?.profile?.nickname || userData?.profile?.name || username.replace('@', '');

    return (
        <div className="flex items-center justify-between mb-3 relative px-4 pt-4">
            <div className="flex items-center gap-3">
                <UserBadge 
                    avatarUrl={userData?.profile?.photoUrl}
                    nickname={displayName}
                    handle={username}
                    isVip={false}
                    avatarSize="md"
                    showHandle={false}
                    onAvatarClick={handleAvatarClick}
                    onNameClick={handleProfileClick}
                />
                <div className="flex flex-col ml-[-8px]">
                    <div className="flex items-center">
                         {isAdult && <span className="bg-[#ff4d4d] text-white text-[9px] font-bold px-1.5 rounded ml-1">18+</span>}
                    </div>
                    <span className="text-[11px] text-[#aaa] font-medium">{time}</span>
                </div>
            </div>

            {isOwner && (
                <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="text-gray-400 p-2 hover:text-white transition-colors">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
                            <div className="absolute right-0 top-8 bg-[#1a1e26] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden w-32" onClick={e => e.stopPropagation()}>
                                <button 
                                    onClick={(e) => { onDelete(e); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 text-sm font-semibold flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-trash-can"></i> Excluir
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <AvatarPreviewModal 
                isOpen={isPreviewOpen} 
                onClose={() => setIsPreviewOpen(false)} 
                imageSrc={userData?.profile?.photoUrl || ''} 
                username={displayName} 
            />
        </div>
    );
};
