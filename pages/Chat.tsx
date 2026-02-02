
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { db } from '@/database';
import { useModal } from '../components/ModalSystem';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatInput } from '../components/chat/ChatInput';
import { MessageItem } from '../components/chat/MessageItem';
import { MediaPreviewOverlay } from '../components/chat/MediaPreviewOverlay';
import { ChatMenuModal } from '../components/chat/ChatMenuModal';
import { socketService } from '../services/socketService';

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showConfirm, showOptions, showAlert } = useModal();
  const chatId = id || '1';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactHandle, setContactHandle] = useState(''); 
  const [contactAvatar, setContactAvatar] = useState<string | undefined>(undefined);
  const [contactStatus, setContactStatus] = useState('Offline');
  const [isBlocked, setIsBlocked] = useState(false);

  const [loadingHistory, setLoadingHistory] = useState(false);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const audioTimeoutRef = useRef<any>(null);

  const [zoomedMedia, setZoomedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [mediaPreview, setMediaPreview] = useState<{ file: File, url: string, type: 'image' | 'video' | 'file' } | null>(null);
  const [mediaCaption, setMediaCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const currentUserEmail = authService.getCurrentUserEmail()?.toLowerCase();

  const loadChatData = useCallback((isSilent = false) => {
      const chatData = chatService.getChat(chatId);
      setIsBlocked(chatData.isBlocked);

      let targetUser = undefined;
      let displayName = chatData.contactName;
      let displayAvatar = undefined;
      let handle = '';

      if (chatId.includes('_') && chatId.includes('@') && currentUserEmail) {
          const otherEmail = chatId.split('_').find(p => p.toLowerCase() !== currentUserEmail);
          if (otherEmail) {
              const userRecord = Object.values(db.users.getAll()).find(u => u.email.toLowerCase() === otherEmail.toLowerCase());
              if (userRecord) {
                  targetUser = userRecord;
                  displayName = userRecord.profile?.nickname || userRecord.profile?.name || `@${userRecord.profile?.name}`;
                  displayAvatar = userRecord.profile?.photoUrl;
                  handle = userRecord.profile?.name || '';
              } else {
                  displayName = otherEmail.split('@')[0];
              }
          }
      }

      setContactName(displayName);
      setContactAvatar(displayAvatar);
      setContactHandle(handle);

      if (targetUser?.lastSeen) {
          const diff = Date.now() - targetUser.lastSeen;
          if (diff < 2 * 60 * 1000) setContactStatus('Online');
          else setContactStatus('Offline');
      } else setContactStatus('Offline');

      const rawMessages = chatData.messages || [];
      const uniqueMap = new Map();
      rawMessages.forEach(m => {
          // Filtragem de Mensagem Deletada para Mim
          const deletedBy = m.deletedBy || [];
          if (!deletedBy.includes(currentUserEmail || '')) {
              uniqueMap.set(m.id, m);
          }
      });
      const deduplicated = Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
      
      setMessages(deduplicated);
  }, [chatId, currentUserEmail]);

  useEffect(() => {
      loadChatData();
      
      // Listeners de Socket para Sincronização de Deleção
      const unsubDeleteChat = socketService.on('chat_deleted_globally', (data: any) => {
          if (data.chatId === chatId) {
              navigate('/messages', { replace: true });
          }
      });

      const unsubDeleteMsgs = socketService.on('messages_deleted_globally', (data: any) => {
          if (data.chatId === chatId) {
              loadChatData(true);
          }
      });

      return () => {
          unsubDeleteChat();
          unsubDeleteMsgs();
      };
  }, [chatId, loadChatData, navigate]);

  useEffect(() => {
      const unsub = db.subscribe('chats', () => loadChatData(true));
      return () => unsub();
  }, [loadChatData]);

  const handleSendMessage = (text: string) => {
      const userInfo = authService.getCurrentUser();
      const newMessage: ChatMessage = {
          id: Date.now(),
          text,
          type: 'sent',
          contentType: 'text',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          senderEmail: userInfo?.email,
          senderAvatar: userInfo?.profile?.photoUrl,
          senderName: userInfo?.profile?.nickname || userInfo?.profile?.name || 'Você',
          deletedBy: []
      };
      chatService.sendMessage(chatId, newMessage);
  };

  const handleToggleSelection = (msgId: number) => {
      setSelectedIds(prev => {
          const next = prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId];
          if (next.length === 0) setIsSelectionMode(false);
          return next;
      });
  };

  const handleStartSelection = (msgId: number) => {
      setIsSelectionMode(true);
      setSelectedIds([msgId]);
      // Feedback tátil leve se possível
      if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleDeleteSelected = async () => {
      if (selectedIds.length === 0) return;
      
      const target = await showOptions("Excluir Mensagem", [
          { label: 'Excluir para mim', value: 'me', icon: 'fa-solid fa-user' },
          { label: 'Excluir para todos', value: 'all', icon: 'fa-solid fa-users', isDestructive: true }
      ]);

      if (target) {
          await chatService.deleteMessages(chatId, selectedIds, target);
          setIsSelectionMode(false);
          setSelectedIds([]);
          loadChatData(true);
      }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(m => (m.text || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, searchTerm]);

  return (
    <div className="messages-page h-[100dvh] flex flex-col overflow-hidden" style={{ background: 'radial-gradient(circle at top left, #0c0f14, #0a0c10)', color: '#fff' }}>
      <ChatHeader
        title={contactName}
        subtitle={isBlocked ? 'Bloqueado' : contactStatus}
        avatar={contactAvatar}
        onBack={() => navigate('/messages')}
        onInfoClick={() => contactHandle && navigate(`/user/${contactHandle}`)}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedIds.length}
        onCancelSelection={() => { setIsSelectionMode(false); setSelectedIds([]); }}
        onDeleteSelection={handleDeleteSelected}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => { setIsSearchOpen(!isSearchOpen); setSearchTerm(''); }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuClick={() => setIsMenuModalOpen(true)}
      />

      <main style={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', paddingTop: '60px' }}>
            <Virtuoso
                ref={virtuosoRef}
                style={{ height: '100%', paddingBottom: '80px' }}
                data={filteredMessages}
                initialTopMostItemIndex={filteredMessages.length - 1}
                followOutput="smooth"
                itemContent={(index, msg) => (
                    <MessageItem
                        key={msg.id}
                        msg={msg}
                        isMe={msg.senderEmail?.toLowerCase() === currentUserEmail}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedIds.includes(msg.id)}
                        onSelect={handleToggleSelection}
                        onStartSelection={handleStartSelection}
                        onMediaClick={(url, type) => setZoomedMedia({ url, type })}
                        onProductClick={(pid) => navigate(`/marketplace/product/${pid}`)}
                        playingAudioId={playingAudioId}
                        onPlayAudio={() => {}}
                    />
                )}
            />
      </main>

      {!isSelectionMode && (
        <ChatInput
            onSendMessage={handleSendMessage}
            onSendAudio={() => {}}
            onFileSelect={() => {}}
            isBlocked={isBlocked}
            isUploading={isUploading}
        />
      )}

      <ChatMenuModal 
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        isBlocked={isBlocked}
        onSearch={() => setIsSearchOpen(true)}
        onSelect={() => setIsSelectionMode(true)}
        onBlock={() => {}}
        onClear={() => {}}
      />

      {zoomedMedia && (
          <div className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-2" onClick={() => setZoomedMedia(null)}>
              <img src={zoomedMedia.url} className="max-w-full max-h-full object-contain" />
          </div>
      )}
    </div>
  );
};
