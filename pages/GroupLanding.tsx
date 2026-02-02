
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { authService } from '../services/authService';
import { Group } from '../types';
import { db } from '@/database';
import { GroupCapacityBadge } from '../components/groups/ui/GroupCapacityBadge';
import { CapacityValidator } from '../features/groups/logic/CapacityValidator';

export const GroupLanding: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isMember, setIsMember] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  
  const [creatorName, setCreatorName] = useState('');
  const [creatorAvatar, setCreatorAvatar] = useState<string | undefined>(undefined);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (id) {
      const foundGroup = groupService.getGroupById(id);
      const currentUserId = authService.getCurrentUserId();

      if (foundGroup) {
        if (currentUserId && foundGroup.memberIds?.includes(currentUserId)) {
            const hasExtra = foundGroup.channels && foundGroup.channels.length > 0;
            if (hasExtra) navigate(`/group/${id}/channels`, { replace: true });
            else navigate(`/group-chat/${id}`, { replace: true });
            return;
        }

        setGroup(foundGroup);
        
        if (currentUserId) {
            if (foundGroup.memberIds?.includes(currentUserId)) setIsMember(true);
            if (foundGroup.pendingMemberIds?.includes(currentUserId)) setRequestSent(true);
            if (foundGroup.bannedUserIds?.includes(currentUserId)) setIsBanned(true);
        }
        
        if (foundGroup.creatorEmail) {
            const creator = db.users.get(foundGroup.creatorEmail) || Object.values(db.users.getAll()).find(u => u.email === foundGroup.creatorEmail);
            if (creator) {
                setCreatorName(creator.profile?.nickname || creator.profile?.name || 'Criador');
                setCreatorAvatar(creator.profile?.photoUrl);
            } else setCreatorName('Administrador');
        } else setCreatorName('Administrador');

        if (foundGroup.memberIds && foundGroup.memberIds.length > 0) {
            const allUsers = Object.values(db.users.getAll());
            const memberSet = new Set(foundGroup.memberIds);
            const count = allUsers.filter(u => memberSet.has(u.id) && u.lastSeen && (Date.now() - u.lastSeen < 900000)).length;
            setOnlineCount(count || 1); 
        }
      }
      setLoading(false);
    }
  }, [id, navigate]);

  const handleJoinAction = () => {
      if (!group || !id) return;
      if (isBanned) return;
      if (CapacityValidator.isFull(group)) {
          alert("Lamentamos, mas este grupo atingiu o limite máximo de participantes.");
          return;
      }
      
      const result = groupService.joinGroup(id);
      if (result === 'joined') {
          const hasExtra = group.channels && group.channels.length > 0;
          if (hasExtra) navigate(`/group/${id}/channels`);
          else navigate(`/group-chat/${id}`);
      } else if (result === 'pending') setRequestSent(true);
  };

  if (loading) return <div className="h-screen bg-[#0c0f14] flex items-center justify-center text-white"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i></div>;
  if (!group) return <div className="h-screen bg-[#0c0f14] flex flex-col items-center justify-center text-white p-6"><h1 className="text-xl font-bold">Grupo não encontrado</h1></div>;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col overflow-x-hidden">
        <style>{`
            .landing-hero { width: 100%; height: 300px; position: relative; overflow: hidden; }
            .hero-bg { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.4) blur(10px); transform: scale(1.1); }
            .hero-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; }
            .group-avatar-large { width: 120px; height: 120px; border-radius: 32px; border: 4px solid #00c2ff; background: #1a1e26; object-fit: cover; margin-bottom: 20px; }
            .landing-body { flex-grow: 1; padding: 30px 24px; background: #0c0f14; border-radius: 30px 30px 0 0; margin-top: -30px; position: relative; z-index: 10; }
            .stat-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(255,255,255,0.05); border-radius: 20px; font-size: 12px; }
            .join-btn-large { width: 100%; padding: 18px; border: none; border-radius: 16px; background: #00c2ff; color: #000; font-size: 16px; font-weight: 800; cursor: pointer; text-transform: uppercase; }
            .join-btn-large:disabled { background: #333; color: #777; cursor: not-allowed; opacity: 0.7; }
        `}</style>
        <button className="absolute top-5 left-5 z-50 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/10" onClick={() => navigate('/groups')}><i className="fa-solid fa-arrow-left"></i></button>
        <div className="landing-hero">
            <img src={group.coverImage || 'https://via.placeholder.com/800'} className="hero-bg" alt="bg" />
            <div className="hero-content">
                <img src={group.coverImage || 'https://via.placeholder.com/150'} className="group-avatar-large" alt="Avatar" />
                <h1 className="text-2xl font-black text-white text-center px-6">{group.name}</h1>
                <div className="flex flex-col items-center gap-3 mt-4">
                    <GroupCapacityBadge group={group} />
                    <div className="flex gap-3">
                        <div className="stat-badge"><i className="fa-solid fa-user-group"></i> {group.memberIds?.length || 0} membros</div>
                        <div className="stat-badge"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_green]"></div> {onlineCount} online</div>
                    </div>
                </div>
            </div>
        </div>
        <main className="landing-body">
            <div className="text-center text-gray-400 mb-8 leading-relaxed">{group.description || "Bem-vindo a esta comunidade!"}</div>
            {isBanned ? (
                <button className="join-btn-large !bg-red-500 !text-white" disabled>Você foi banido</button>
            ) : requestSent ? (
                <button className="join-btn-large !bg-gray-800" disabled>Solicitação Enviada</button>
            ) : (
                <button 
                    className="join-btn-large" 
                    onClick={handleJoinAction} 
                    disabled={CapacityValidator.isFull(group)}
                >
                    {CapacityValidator.isFull(group) ? 'Grupo Lotado' : (isMember ? 'Acessar Conversa' : 'Entrar no Grupo')}
                </button>
            )}
        </main>
    </div>
  );
};
