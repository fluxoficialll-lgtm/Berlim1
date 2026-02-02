
import React from 'react';
import { UserAvatar } from '../ui/user/UserAvatar';

interface Contact {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  isOnline: boolean;
  unreadCount: number;
}

interface MessageListItemProps {
  contact: Contact;
  isSelected: boolean;
  isSelectionMode: boolean;
  onClick: () => void;
  onAvatarClick: (e: React.MouseEvent) => void;
}

export const MessageListItem: React.FC<MessageListItemProps> = ({
  contact,
  isSelected,
  isSelectionMode,
  onClick,
  onAvatarClick,
}) => {
  return (
    <div
      className={`flex items-center p-3 border-b border-white/5 cursor-pointer transition-all relative ${
        isSelected ? 'bg-[#00c2ff]/10' : 'hover:bg-white/[0.02]'
      }`}
      onClick={onClick}
    >
      {isSelectionMode && (
        <div
          className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
            isSelected ? 'bg-[#00c2ff] border-[#00c2ff]' : 'border-gray-600'
          }`}
        >
          {isSelected && <span className="text-[10px] text-black font-bold">✔</span>}
        </div>
      )}

      <div className="relative flex-shrink-0 mr-4">
        <UserAvatar
          src={contact.avatar}
          className="w-[50px] h-[50px]"
          onClick={onAvatarClick}
        />
        {contact.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00ff82] rounded-full border-2 border-[#0c0f14]"></div>
        )}
      </div>

      <div className="flex flex-col flex-grow min-w-0 mr-2.5">
        <div className="font-bold text-base mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis text-white">
          {contact.name}
        </div>
        <div
          className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
            contact.unreadCount > 0 ? 'text-white font-semibold' : 'text-gray-400'
          }`}
        >
          {contact.lastMessage}
        </div>
      </div>

      <div className="flex flex-col items-end flex-shrink-0">
        <div className={`text-[10px] uppercase font-bold ${contact.unreadCount > 0 ? 'text-[#00c2ff]' : 'text-gray-500'}`}>
          {contact.time}
        </div>
        {contact.unreadCount > 0 && (
          <div className="bg-[#ff4d4d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center mt-1">
            {contact.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};
