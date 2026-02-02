import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { relationshipService } from '../services/relationshipService';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { notificationService } from '../services/notificationService';
import { marketplaceService } from '../services/marketplaceService';
import { Post, MarketplaceItem } from '../types';
import { db } from '@/database';
import { useModal } from '../components/ModalSystem';
import { FeedItem } from '../components/feed/FeedItem';
import { AvatarPreviewModal } from '../components/ui/AvatarPreviewModal';
import { Footer } from '../components/layout/Footer';

// Novos componentes modulares para visitante
import { VisitorHeader } from '../features/user-profile/components/VisitorHeader';
import { VisitorInfoCard } from '../features/user-profile/components/VisitorInfoCard';
import { VisitorBlockedState, VisitorPrivateState } from '../features/user-profile/components/VisitorStates';

// Componentes reaproveitados do perfil
import { ProfileTabNav } from '../features/profile/components/ProfileTabNav';
import { ProfileReelsGrid } from '../features/profile/components/tabs/ProfileReelsGrid';
import { ProfileProductsGrid } from '../features/profile/components/tabs/ProfileProductsGrid';

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const { showAlert } = useModal();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<'posts' | 'fotos' | 'reels' | 'products'>('posts');
  const [userData, setUserData] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userProducts, setUserProducts] = useState<MarketplaceItem[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const [targetUserEmail, setTargetUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [relationStatus, setRelationStatus] = useState<'none'|'following'|'requested'>('none');
  const [isBlocked, setIsBlocked] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
      if (location.state && (location.state as any).activeTab) {
          setActiveTab((location.state as any).activeTab);
      }
  }, [location.state]);

  const loadProfile = async () => {
      const currentUsername = username ? (username.startsWith('@') ? username : `@${username}`) : "@usuario";
      const cleanHandle = currentUsername.replace('@', '').toLowerCase().trim();
      const fallbackEmail = (location.state as any)?.emailFallback;
      const currentUser = authService.getCurrentUser();
      const targetUser = await authService.fetchUserByHandle(cleanHandle, fallbackEmail);
      
      let isSelf = false;
      if (currentUser && currentUser.profile?.name === cleanHandle) isSelf = true;

      if (targetUser) {
          setTargetUserEmail(targetUser.email);
          
          if (currentUser?.email) {
              const blockedStatus = chatService.hasBlockingRelationship(currentUser.email, targetUser.email) || 
                                    chatService.hasBlockingRelationship(currentUser.email, cleanHandle);
              setIsBlocked(blockedStatus);
          }

          const followers = relationshipService.getFollowers(targetUser.profile?.name || '');
          const following = relationshipService.getFollowing(targetUser.id);
          const posts = postService.getUserPosts(targetUser.id);
          setUserPosts(posts.sort((a, b) => b.timestamp - a.timestamp));

          const products = marketplaceService.getItems().filter(i => i.sellerId === targetUser.email || i.sellerId === targetUser.id);
          setUserProducts(products.sort((a, b) => b.timestamp - a.timestamp));

          const profileData = {
              username: `@${targetUser.profile?.name}`,
              nickname: targetUser.profile?.nickname || targetUser.profile?.name,
              avatar: targetUser.profile?.photoUrl,
              bio: targetUser.profile?.bio || "Sem biografia.",
              stats: { posts: posts.length, followers: followers.length, following: following.length }
          };

          setUserData(profileData);
          setIsPrivate(targetUser.profile?.isPrivate || false);
          setIsMe(isSelf);
          setRelationStatus(relationshipService.isFollowing(profileData.username));
      }
      setIsLoading(false);
  };

  useEffect(() => {
      loadProfile();
      const unsubUsers = db.subscribe('users', loadProfile);
      const unsubRel = db.subscribe('relationships', loadProfile);
      const unsubPosts = db.subscribe('posts', loadProfile);
      const unsubChats = db.subscribe('chats', loadProfile);
      return () => { unsubUsers(); unsubRel(); unsubPosts(); unsubChats(); };
  }, [username]);

  const handleLike = (id: string) => {
    setUserPosts(prev => prev.map(post => post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post));
    postService.toggleLike(id);
  };

  // Add handleVote method to handle poll interactions
  const handleVote = (postId: string, index: number) => {
      setUserPosts(prev => prev.map(p => {
          if (p.id === postId && p.pollOptions && p.votedOptionIndex == null) {
              const newOptions = [...p.pollOptions];
              newOptions[index].votes += 1;
              return { ...p, pollOptions: newOptions, votedOptionIndex: index };
          }
          return p;
      }));
  };

  const handleFollowClick = async () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);
    try {
        if (relationStatus === 'following' || relationStatus === 'requested') {
            if (window.confirm(`Deixar de seguir ${userData.username}?`)) {
                await relationshipService.unfollowUser(userData.username);
                setRelationStatus('none');
            }
        } else {
            const result = await relationshipService.followUser(userData.username);
            setRelationStatus(result);
        }
    } catch (error: any) { showAlert("Erro", error.message || "Erro de conexão."); }
    finally { setIsFollowLoading(false); }
  };

  const handleMessageClick = () => {
    const currentUserEmail = authService.getCurrentUserEmail();
    if (currentUserEmail && targetUserEmail) {
      const chatId = chatService.getPrivateChatId(currentUserEmail, targetUserEmail);
      navigate(`/chat/${chatId}`);
    }
  };

  const handleToggleBlock = () => {
    const newState = chatService.toggleBlockByContactName(userData.username);
    setIsBlocked(newState);
  };

  const isContentVisible = isMe || !isPrivate || relationStatus === 'following';
  const canMessage = !isMe && (!isPrivate || relationStatus === 'following');

  if (isLoading || !userData) {
      return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
          <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
      </div>;
  }

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
        <style>{`
            main { flex-grow: 1; overflow-y: auto; padding-top: 80px; padding-bottom: 100px; scroll-behavior: smooth; }
            .profile-card-box { background: rgba(30, 35, 45, 0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 30px 20px; width: 90%; max-width: 400px; display: flex; flex-direction: column; align-items: center; margin: 0 auto 20px auto; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
            .profile-avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid #00c2ff; margin-bottom: 15px; background: #1e2531; cursor: pointer; }
            .profile-placeholder { width: 100px; height: 100px; border-radius: 50%; background: #1e2531; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #00c2ff; border: 4px solid #00c2ff; margin-bottom: 15px; }
            .profile-nickname { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 2px; }
            .profile-handle { font-size: 14px; color: #00c2ff; margin-bottom: 15px; }
            .profile-stats-container { display: flex; justify-content: space-around; width: 100%; margin: 20px 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 15px 0; }
            .stat-box { display: flex; flex-direction: column; align-items: center; cursor: pointer; flex: 1; }
            .stat-value { font-size: 18px; font-weight: 800; color: #fff; }
            .stat-label { font-size: 11px; color: #aaa; text-transform: uppercase; margin-top: 4px; }
            .profile-bio { font-size: 14px; color: #e0e0e0; text-align: center; line-height: 1.5; margin-bottom: 15px; max-width: 90%; }
            .profile-actions { display: flex; gap: 10px; width: 100%; justify-content: center; margin-top: 10px; }
            .profile-actions button { flex: 1; max-width: 140px; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; }
            #followButton { background: #00c2ff; color: #0c0f14; }
            #followButton.is-following { background: transparent; border: 1px solid #aaa; color: #fff; }
            #followButton.request-sent { background: transparent; border: 1px dashed #aaa; color: #aaa; }
            #messageButton { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
            .post-list { padding: 0 10px; display: flex; flex-direction: column; }
            .no-content { text-align: center; color: #666; padding: 40px 0; font-size: 14px; width: 100%; }
        `}</style>

        <VisitorHeader 
            onBack={() => navigate(-1)}
            onLogoClick={() => scrollRef.current?.scrollTo({top: 0, behavior: 'smooth'})}
            isMe={isMe}
            isBlocked={isBlocked}
            onToggleBlock={handleToggleBlock}
            onReport={() => alert('Denunciar usuário')}
            username={userData.username}
        />

        <main ref={scrollRef} className="no-scrollbar">
            <div style={{width:'100%', maxWidth:'500px', margin:'0 auto'}}>
                {isBlocked ? (
                    <VisitorBlockedState />
                ) : (
                    <>
                        <VisitorInfoCard 
                            avatar={userData.avatar}
                            nickname={userData.nickname}
                            username={userData.username}
                            bio={userData.bio}
                            stats={userData.stats}
                            isMe={isMe}
                            isBlocked={isBlocked}
                            relationStatus={relationStatus}
                            isFollowLoading={isFollowLoading}
                            canMessage={canMessage}
                            onFollowClick={handleFollowClick}
                            onMessageClick={handleMessageClick}
                            onAvatarClick={() => setIsPreviewOpen(true)}
                        />

                        {isContentVisible ? (
                            <div className="animate-fade-in">
                                <ProfileTabNav 
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab as any}
                                    hasProducts={userProducts.length > 0}
                                />

                                <div className="tab-content px-2 pb-10">
                                    {activeTab === 'posts' && (
                                        <div className="post-list px-3">
                                            {userPosts.filter(p => p.type !== 'video' && p.type !== 'photo').length > 0 ? 
                                                userPosts.filter(p => p.type !== 'video' && p.type !== 'photo').map(post => (
                                                    <FeedItem key={post.id} post={post} onLike={handleLike} onDelete={()=>{}} onUserClick={loadProfile as any} onCommentClick={(id)=>navigate(`/post/${id}`)} onShare={() => {}} onVote={handleVote} onCtaClick={(l) => l?.startsWith('http') ? window.open(l,'_blank') : navigate(l||'')} />
                                                )) : <div className="no-content">Nenhum post.</div>}
                                        </div>
                                    )}

                                    {activeTab === 'products' && (
                                        <ProfileProductsGrid 
                                            products={userProducts}
                                            onProductClick={(id) => navigate(`/marketplace/product/${id}`)}
                                        />
                                    )}

                                    {activeTab === 'fotos' && (
                                        <div className="post-list px-3">
                                            {userPosts.filter(p => p.type === 'photo').length > 0 ? 
                                                userPosts.filter(p => p.type === 'photo').map(post => (
                                                    <FeedItem key={post.id} post={post} onLike={handleLike} onDelete={()=>{}} onUserClick={loadProfile as any} onCommentClick={(id)=>navigate(`/post/${id}`)} onShare={() => {}} onVote={handleVote} onCtaClick={(l) => l?.startsWith('http') ? window.open(l,'_blank') : navigate(l||'')} />
                                                )) : <div className="no-content">Nenhuma foto.</div>}
                                        </div>
                                    )}

                                    {activeTab === 'reels' && (
                                        <ProfileReelsGrid 
                                            reels={userPosts.filter(p => p.type === 'video')}
                                            onReelClick={(post) => navigate(`/reels/${post.id}`, { state: { authorId: targetUserEmail } })}
                                            onDelete={() => {}}
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <VisitorPrivateState />
                        )}
                    </>
                )}
            </div>
        </main>

        <Footer />

        <AvatarPreviewModal 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)} 
            imageSrc={userData?.avatar || ''} 
            username={userData?.nickname || ''} 
        />
    </div>
  );
};