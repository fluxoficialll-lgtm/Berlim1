import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, User } from '../../../types';
import { FeedItem } from '../FeedItem';
import { postService } from '../../../services/postService';
import { useModal } from '../../ModalSystem';
import { SearchTab } from '../../../pages/FeedSearch';
import { UserBadge } from '../../ui/user/UserBadge';

interface FeedSearchResultsProps {
    activeTab: SearchTab;
    postResults: Post[];
    userResults: User[];
    loading: boolean;
    searchTerm: string;
    currentUser: User | null;
}

export const FeedSearchResults: React.FC<FeedSearchResultsProps> = ({ 
    activeTab,
    postResults, 
    userResults,
    loading, 
    searchTerm,
    currentUser 
}) => {
    const navigate = useNavigate();
    const { showConfirm } = useModal();

    if (loading && (postResults.length === 0 && userResults.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center py-32 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff]"></i>
                </div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[4px]">Sincronizando Rede...</p>
            </div>
        );
    }

    // Render Posts
    if (activeTab === 'posts' && postResults.length > 0) {
        return (
            <div className="max-w-[500px] mx-auto w-full px-3 pb-32 animate-fade-in">
                {postResults.map(post => (
                    <FeedItem 
                        key={post.id}
                        post={post}
                        currentUserId={currentUser?.id}
                        onLike={(id) => postService.toggleLike(id)}
                        onDelete={async (e, id) => {
                            e.stopPropagation();
                            if (await showConfirm("Excluir Post", "Deseja apagar permanentemente?", "Excluir", "Cancelar")) {
                                await postService.deletePost(id);
                            }
                        }}
                        onUserClick={(u) => navigate(`/user/${u.replace('@', '')}`)}
                        onCommentClick={(id) => navigate(`/post/${id}`)}
                        onShare={(p) => {
                            const url = `${window.location.origin}/#/post/${p.id}`;
                            if (navigator.share) navigator.share({ url });
                            else { navigator.clipboard.writeText(url); alert("Link copiado!"); }
                        }}
                        onVote={() => {}}
                        onCtaClick={(l) => l?.startsWith('http') ? window.open(l, '_blank') : navigate(l || '')}
                    />
                ))}
            </div>
        );
    }

    // Render Users
    if (activeTab === 'users' && userResults.length > 0) {
        return (
            <div className="max-w-[500px] mx-auto w-full px-6 pb-32 animate-fade-in grid gap-3 mt-4">
                {userResults.map(user => (
                    <div 
                        key={user.id}
                        onClick={() => navigate(`/user/${user.profile?.name}`)}
                        className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-[22px] hover:bg-white/[0.05] transition-all group cursor-pointer"
                    >
                        <UserBadge 
                            avatarUrl={user.profile?.photoUrl}
                            nickname={user.profile?.nickname}
                            handle={user.profile?.name}
                            isVerified={user.isVerified}
                            avatarSize="md"
                        />
                        <i className="fa-solid fa-chevron-right text-gray-800 text-[10px] group-hover:text-[#00c2ff] transition-colors"></i>
                    </div>
                ))}
            </div>
        );
    }

    // No results state
    if (searchTerm.trim().length > 0 && !loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 opacity-30 text-center animate-fade-in px-12">
                <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/5">
                    <i className={`fa-solid ${activeTab === 'posts' ? 'fa-layer-group' : 'fa-user-slash'} text-3xl text-gray-600`}></i>
                </div>
                <h3 className="text-sm font-black uppercase tracking-[4px] text-white mb-2">Sem Correspondência</h3>
                <p className="text-[11px] font-bold text-gray-500 uppercase leading-relaxed max-w-[200px] mx-auto">
                    Não encontramos {activeTab === 'posts' ? 'publicações' : 'usuários'} com este termo.
                </p>
            </div>
        );
    }

    // Initial empty state
    return (
        <div className="flex flex-col items-center justify-center py-40 text-center animate-fade-in px-12">
            <div className="relative mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-[#00c2ff0a] to-transparent rounded-[40px] flex items-center justify-center border border-[#00c2ff1a]">
                    <i className="fa-solid fa-magnifying-glass text-4xl text-[#00c2ff]/40"></i>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0c0f14] rounded-full flex items-center justify-center border border-white/5">
                    <i className="fa-solid fa-earth-americas text-[#00ff82]/40 text-sm"></i>
                </div>
            </div>
            <h3 className="text-base font-black uppercase tracking-[6px] text-white/80 mb-3 ml-1.5">Pesquisa Flux</h3>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[2px] max-w-[220px] mx-auto leading-relaxed">
                Descubra novas mentes, ideias e conexões em toda a rede global.
            </p>
        </div>
    );
};