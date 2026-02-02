
import React, { useEffect, useRef, useState, useCallback, Suspense, lazy } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { groupService } from '../services/groupService';
import { chatService } from '../services/chatService';
import { Group } from '../types';
import { db } from '@/database';
import { useModal } from '../components/ModalSystem';
import { Footer } from '../components/layout/Footer';
import { MainHeader } from '../components/layout/MainHeader';

// Novos Componentes Isolados
import { JoinViaLinkBtn } from '../components/groups/list/JoinViaLinkBtn';
import { GroupListItem } from '../components/groups/list/GroupListItem';
import { CreateGroupFAB } from '../components/groups/list/CreateGroupFAB';

const TrackingModal = lazy(() => import('../components/groups/TrackingModal').then(m => ({ default: m.TrackingModal })));

export const Groups: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert, showConfirm, showPrompt } = useModal();
  
  const [uiVisible, setUiVisible] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedGroupForTracking, setSelectedGroupForTracking] = useState<Group | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10; 
  
  const lastScrollY = useRef(0);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadLocalGroups = useCallback((currentOffset: number, reset: boolean = false) => {
      const { groups: newGroups, hasMore: moreAvailable } = groupService.getGroupsPaginated(currentOffset, LIMIT);
      if (reset) {
          setGroups(newGroups);
          setOffset(LIMIT);
      } else {
          setGroups(prev => {
              const ids = new Set(prev.map(g => g.id));
              const unique = newGroups.filter(g => !ids.has(g.id));
              return [...prev, ...unique];
          });
          setOffset(prev => prev + LIMIT);
      }
      setHasMore(moreAvailable);
      setLoading(false);
  }, []);

  useEffect(() => {
    const userEmail = authService.getCurrentUserEmail();
    const userId = authService.getCurrentUserId();
    if (!userEmail) { navigate('/'); return; }
    setCurrentUserEmail(userEmail);
    setCurrentUserId(userId);
    loadLocalGroups(0, true);
    groupService.fetchGroups();
    const params = new URLSearchParams(location.search);
    const joinCode = params.get('join');
    if (joinCode) { handleJoinByLink(joinCode); navigate('/groups', { replace: true }); }
    
    // Inscreve-se em grupos E chats para garantir que a última mensagem seja atualizada na lista
    const unsubscribeGroups = db.subscribe('groups', () => { loadLocalGroups(0, true); });
    const unsubscribeChats = db.subscribe('chats', () => { loadLocalGroups(0, true); });
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setUiVisible(currentScroll <= lastScrollY.current || currentScroll <= 80);
      lastScrollY.current = currentScroll;
    };
    const handleClickOutside = () => setActiveMenuId(null);
    
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    return () => { 
        unsubscribeGroups(); 
        unsubscribeChats();
        window.removeEventListener("scroll", handleScroll); 
        document.removeEventListener("click", handleClickOutside); 
    };
  }, [navigate, location.search, loadLocalGroups]);

  useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) { loadLocalGroups(offset); }
      }, { threshold: 0.5 });
      if (observerRef.current) observer.observe(observerRef.current);
      return () => observer.disconnect();
  }, [hasMore, loading, offset, loadLocalGroups]);

  const handleGroupClick = (group: Group) => {
      const isCreator = group.creatorEmail === currentUserEmail;
      const isMember = group.memberIds?.includes(currentUserId || '');
      
      if (group.isSalesPlatformEnabled && (isCreator || isMember)) {
          navigate(`/group-platform/${group.id}`);
          return;
      }

      if (isCreator || isMember) {
          if (group.isVip && !isCreator && currentUserId) {
               const hasAccess = db.vipAccess.check(currentUserId, group.id);
               if (!hasAccess) { navigate(`/vip-group-sales/${group.id}`); return; }
          }
          
          // Lógica de Canais: Só exibe hub se houver mais de 1 canal
          const hasMultipleChannels = group.channels && group.channels.length > 0;
          if (hasMultipleChannels) {
              navigate(`/group/${group.id}/channels`);
          } else {
              navigate(`/group-chat/${group.id}`);
          }
      } else if (group.isVip) { navigate(`/vip-group-sales/${group.id}`); }
      else { navigate(`/group-landing/${group.id}`); }
  };

  const handleJoinByLink = (inputCode: string) => {
      if (!inputCode.trim()) return;
      let code = inputCode;
      if (code.includes('?join=')) code = code.split('?join=')[1];
      const result = groupService.joinGroupByLinkCode(code);
      if (result.success) { 
          showAlert("Sucesso!", result.message); 
          if (result.groupId) {
              const group = groupService.getGroupById(result.groupId);
              if (group && group.channels && group.channels.length > 0) {
                  navigate(`/group/${result.groupId}/channels`);
              } else {
                  navigate(`/group-chat/${result.groupId}`);
              }
          }
          else loadLocalGroups(0, true); 
      }
      else { showAlert("Ops!", result.message); }
  };

  const handleDeleteGroup = async (groupId: string, e: React.MouseEvent) => {
      e.stopPropagation(); 
      setActiveMenuId(null);
      if (await showConfirm("Excluir Grupo?", "Tem certeza que deseja excluir este grupo permanentemente?", "Excluir", "Cancelar")) {
          groupService.deleteGroup(groupId);
          setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
      }
  };

  const handleOpenTracking = (group: Group, e: React.MouseEvent) => { 
      e.stopPropagation(); 
      setActiveMenuId(null); 
      setSelectedGroupForTracking(group); 
      setIsTrackingModalOpen(true); 
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <MainHeader 
        leftContent={
            <button onClick={() => navigate('/top-groups')} className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer">
                <i className="fa-solid fa-ranking-star"></i>
            </button>
        }
        rightContent={
            <button onClick={() => navigate('/messages')} className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer">
                <i className="fa-solid fa-message"></i>
            </button>
        }
        onLogoClick={() => window.scrollTo({top:0, behavior:'smooth'})}
      />

      <main className="flex-grow pt-[100px] pb-[100px] px-4">
        <JoinViaLinkBtn onClick={async () => {
            const code = await showPrompt("Entrar via Link", "Cole o código do grupo:", "Ex: AF72B");
            if (code) handleJoinByLink(code);
        }} />

        <div className="w-full">
            {groups.length > 0 ? (
                groups.map(group => (
                    <GroupListItem 
                        key={group.id}
                        group={group}
                        currentUserEmail={currentUserEmail}
                        unreadCount={chatService.getGroupUnreadCount(group.id)}
                        isMenuActive={activeMenuId === group.id}
                        onToggleMenu={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === group.id ? null : group.id); }}
                        onItemClick={() => handleGroupClick(group)}
                        onTracking={(e) => handleOpenTracking(group, e)}
                        onDelete={(e) => handleDeleteGroup(group.id, e)}
                    />
                ))
            ) : loading ? (
                <div className="text-center mt-10"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i></div>
            ) : (
                <div className="text-center text-gray-500 mt-10">Você não participa de nenhum grupo.</div>
            )}
            <div ref={observerRef} className="h-10"></div>
        </div>
      </main>

      <CreateGroupFAB 
        visible={uiVisible} 
        onClick={() => navigate('/create-group')} 
      />

      <Footer visible={uiVisible} />

      {isTrackingModalOpen && selectedGroupForTracking && (
          <Suspense fallback={null}>
              <TrackingModal 
                isOpen={isTrackingModalOpen}
                onClose={() => setIsTrackingModalOpen(false)}
                group={selectedGroupForTracking}
              />
          </Suspense>
      )}
    </div>
  );
};
