
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { chatService } from '../services/chatService';
import { notificationService } from '../services/notificationService';
import { db } from '@/database';
import { MessagesMenuModal } from '../components/chat/MessagesMenuModal';
import { MainHeader } from '../components/layout/MainHeader';
import { MessageListItem } from '../components/chat/MessageListItem';
import { MessagesEmptyState } from '../components/chat/MessagesEmptyState';
import { MessagesFooter } from '../components/chat/MessagesFooter';

interface Contact {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: number; 
  time: string; 
  status: 'online' | string;
  isOnline: boolean;
  unreadCount: number;
}

export const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [uiVisible, setUiVisible] = useState(true);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  const formatLastSeen = (timestamp?: number) => {
      if (!timestamp) return "Offline";
      const diff = Date.now() - timestamp;
      if (diff < 2 * 60 * 1000) return "online"; 
      const date = new Date(timestamp);
      return `Visto por último às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const loadChats = useCallback(() => {
      const rawUserEmail = authService.getCurrentUserEmail();
      if (!rawUserEmail) return;
      const currentUserEmail = rawUserEmail.toLowerCase();
      const rawChats = chatService.getAllChats();
      
      const formatted: Contact[] = Object.values(rawChats).map((chat): Contact | null => {
          const chatIdStr = chat.id.toString().toLowerCase();
          if (!chatIdStr.includes('@') || !chatIdStr.includes(currentUserEmail)) return null;

          const unreadCount = chat.messages.filter(m => {
              const sender = (m.senderEmail || m.senderId || '').toLowerCase();
              return sender !== currentUserEmail && m.status !== 'read';
          }).length;
          
          const lastMsg = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
          if (!lastMsg) return null; 

          const sender = lastMsg.senderEmail?.toLowerCase() || lastMsg.senderId?.toLowerCase();
          const isMe = sender === currentUserEmail;
          const previewText = (isMe ? 'Você: ' : '') + (lastMsg.contentType === 'text' ? lastMsg.text : 'Mídia');

          const parts = chatIdStr.split('_');
          const otherEmail = parts.find(p => p.toLowerCase() !== currentUserEmail);
          
          let displayName = chat.contactName;
          let handle = '';
          let avatarUrl = undefined;
          let targetUser = undefined;

          if (otherEmail) {
              targetUser = Object.values(db.users.getAll()).find(u => u.email.toLowerCase() === otherEmail.toLowerCase());
              if (targetUser) {
                  displayName = targetUser.profile?.nickname || targetUser.profile?.name || 'Usuário';
                  handle = targetUser.profile?.name || '';
                  avatarUrl = targetUser.profile?.photoUrl;
              }
          }

          return {
              id: chat.id.toString(),
              name: displayName,
              handle: handle,
              avatar: avatarUrl,
              lastMessage: previewText,
              lastMessageTime: lastMsg.id, 
              time: lastMsg.timestamp,
              status: formatLastSeen(targetUser?.lastSeen),
              isOnline: formatLastSeen(targetUser?.lastSeen) === 'online',
              unreadCount: unreadCount
          };
      }).filter((c): c is Contact => c !== null).sort((a, b) => b.lastMessageTime - a.lastMessageTime);

      setContacts(formatted);
  }, []);

  useEffect(() => {
    loadChats();
    const unsubscribeChats = db.subscribe('chats', loadChats);
    const unsubscribeUsers = db.subscribe('users', loadChats);
    return () => { unsubscribeChats(); unsubscribeUsers(); };
  }, [loadChats]);

  useEffect(() => {
      const updateCounts = () => {
          setUnreadNotifs(notificationService.getUnreadCount());
          setUnreadMsgs(chatService.getUnreadCount());
      };
      updateCounts();
      const unsubNotif = db.subscribe('notifications', updateCounts);
      const unsubChat = db.subscribe('chats', updateCounts);
      return () => { unsubNotif(); unsubChat(); };
  }, []);

  const handleMarkAllRead = () => {
      chatService.markAllAsRead();
      loadChats();
  };

  const handleContactClick = (contact: Contact) => {
      if (isSelectionMode) {
          setSelectedIds(prev => 
            prev.includes(contact.id) 
              ? prev.filter(i => i !== contact.id) 
              : [...prev, contact.id]
          );
      } else {
          navigate(`/chat/${contact.id}`);
      }
  };

  const handleProfileNavigate = (e: React.MouseEvent, handle: string) => {
      e.stopPropagation();
      if (handle) navigate(`/user/${handle.replace('@', '')}`);
  };

  return (
    <div className="h-[100dvh] bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
        <MainHeader 
            leftContent={isSelectionMode ? (
                <button onClick={() => { setIsSelectionMode(false); setSelectedIds([]); }} className="text-[#00c2ff] text-lg"><i className="fa-solid fa-xmark"></i></button>
            ) : (
                <button onClick={() => setIsMenuModalOpen(true)} className="text-[#00c2ff] text-lg"><i className="fa-solid fa-sliders"></i></button>
            )}
            rightContent={isSelectionMode ? (
                <button 
                  onClick={() => { if(window.confirm('Apagar?')) { setIsSelectionMode(false); setSelectedIds([]); } }} 
                  disabled={selectedIds.length === 0} 
                  className="text-[#ff4d4d] text-lg disabled:opacity-30"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
            ) : (
                <button onClick={() => navigate('/groups')} className="text-[#00c2ff] text-lg"><i className="fa-solid fa-users"></i></button>
            )}
        />

        <main ref={mainScrollRef} className="flex-grow pt-[80px] pb-[100px] overflow-y-auto no-scrollbar">
            {isSelectionMode && (
              <div className="w-full text-center py-2 bg-[#0f2b38] font-bold text-xs sticky top-0 z-10">
                {selectedIds.length} selecionada(s)
              </div>
            )}
            
            <div className="w-full">
                {contacts.length > 0 ? contacts.map(contact => (
                    <MessageListItem 
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedIds.includes(contact.id)}
                      isSelectionMode={isSelectionMode}
                      onClick={() => handleContactClick(contact)}
                      onAvatarClick={(e) => handleProfileNavigate(e, contact.handle)}
                    />
                )) : (
                    <MessagesEmptyState />
                )}
            </div>
        </main>

        <MessagesFooter 
          uiVisible={uiVisible}
          unreadMsgs={unreadMsgs}
          unreadNotifs={unreadNotifs}
        />

        <MessagesMenuModal 
            isOpen={isMenuModalOpen}
            onClose={() => setIsMenuModalOpen(false)}
            onSelectMode={() => setIsSelectionMode(true)}
            onMarkAllRead={handleMarkAllRead}
            onViewBlocked={() => navigate('/blocked-users')}
        />
    </div>
  );
};
