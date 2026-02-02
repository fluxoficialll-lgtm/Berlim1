
import React from 'react';
import { Group, ChatMessage } from '../../../types';
import { GroupMenuDropdown } from './GroupMenuDropdown';
import { db } from '../../../database';

interface GroupListItemProps {
    group: Group;
    currentUserEmail: string | null;
    unreadCount: number;
    isMenuActive: boolean;
    onToggleMenu: (e: React.MouseEvent) => void;
    onItemClick: () => void;
    onTracking: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export const GroupListItem: React.FC<GroupListItemProps> = ({
    group,
    currentUserEmail,
    unreadCount,
    isMenuActive,
    onToggleMenu,
    onItemClick,
    onTracking,
    onDelete
}) => {
    const isCreator = group.creatorEmail === currentUserEmail;

    // Busca todas as conversas do DB e filtra as que pertencem a este grupo (incluindo sub-canais)
    const allChats = db.chats.getAll();
    const groupChats = Object.values(allChats).filter(chat => {
        const chatIdStr = chat.id.toString();
        return chatIdStr === group.id || chatIdStr.startsWith(`${group.id}_`);
    });

    // Encontra a mensagem mais recente entre todos os canais da comunidade
    let lastMsg: ChatMessage | null = null;
    groupChats.forEach(chat => {
        if (chat.messages && chat.messages.length > 0) {
            const latestInChat = chat.messages[chat.messages.length - 1];
            // O ID da mensagem no sistema Flux é um timestamp numérico, perfeito para ordenação
            if (!lastMsg || latestInChat.id > lastMsg.id) {
                lastMsg = latestInChat;
            }
        }
    });

    let displayMsg = '';
    let displayTime = '';

    if (lastMsg) {
        const sender = (lastMsg.senderEmail || lastMsg.senderId || '').toLowerCase();
        const isMe = sender === currentUserEmail?.toLowerCase();
        
        // Formatação idêntica à lista de mensagens privadas para consistência visual
        const prefix = isMe ? 'Você: ' : (lastMsg.senderName ? `${lastMsg.senderName}: ` : '');
        
        const content = lastMsg.contentType === 'text' ? lastMsg.text : 
                       (lastMsg.contentType === 'image' ? '📷 Foto' : 
                       (lastMsg.contentType === 'video' ? '🎥 Vídeo' : 
                       (lastMsg.contentType === 'audio' ? '🎤 Áudio' : '📎 Arquivo')));
        
        displayMsg = prefix + content;
        displayTime = lastMsg.timestamp;
    } else {
        // Fallback elegante para grupos sem histórico de chat
        displayMsg = group.isSalesPlatformEnabled ? 'Acesse o catálogo do grupo' : (group.description || 'Toque para abrir a comunidade');
        displayTime = 'Novo';
    }

    return (
        <div className="group-preview flex items-center p-3 border-b border-white/5 cursor-pointer transition-all relative" onClick={onItemClick}>
            <div className="group-avatar w-[50px] h-[50px] rounded-full mr-4 border-2 border-[#00c2ff] bg-[#00c2ff33] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {group.coverImage ? (
                    <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                ) : (
                    <i className={`fa-solid ${group.isVip ? 'fa-crown' : 'fa-users'}`}></i>
                )}
            </div>
            
            <div className="group-info flex flex-col flex-grow min-w-0 mr-2.5">
                <div className="groupname font-bold text-base mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis text-white">
                    {group.name}
                </div>
                <div className={`last-message text-sm whitespace-nowrap overflow-hidden text-ellipsis ${unreadCount > 0 ? 'text-white font-semibold' : 'text-gray-400'}`}>
                    {displayMsg}
                </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
                <div className={`text-[10px] uppercase font-bold ${unreadCount > 0 ? 'text-[#00c2ff]' : 'text-gray-500'}`}>
                    {displayTime}
                </div>
                {unreadCount > 0 && (
                    <div className="group-unread-badge bg-[#ff4d4d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center mt-1">
                        {unreadCount}
                    </div>
                )}
            </div>

            {isCreator && (
                <>
                    <button className="group-menu-btn absolute right-1 top-1 text-gray-500 p-2 cursor-pointer z-[5]" onClick={onToggleMenu}>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <GroupMenuDropdown 
                        group={group} 
                        isActive={isMenuActive} 
                        onTracking={onTracking}
                        onDelete={onDelete}
                    />
                </>
            )}
        </div>
    );
};
