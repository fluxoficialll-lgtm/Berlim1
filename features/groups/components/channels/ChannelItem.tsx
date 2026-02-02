
import React from 'react';
import { chatService } from '../../../../services/chatService';

interface ChannelItemProps {
    id: string;
    groupId: string;
    name: string;
    icon?: string;
    isPrivate?: boolean;
    onClick: () => void;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({ 
    id, 
    groupId, 
    name, 
    icon = 'fa-hashtag', 
    isPrivate = false, 
    onClick 
}) => {
    const unreadCount = chatService.getGroupUnreadCount(`${groupId}_${id}`);
    
    return (
        <div 
            onClick={onClick}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all active:scale-[0.98] group"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-[#00c2ff] group-hover:bg-[#00c2ff1a] transition-colors">
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-200"># {name}</span>
                    {isPrivate && <span className="text-[9px] text-gray-500 uppercase font-black">Somente Admins</span>}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                    <div className="bg-[#ff4d4d] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {unreadCount}
                    </div>
                )}
                <i className="fa-solid fa-chevron-right text-gray-700 text-xs"></i>
            </div>
        </div>
    );
};
