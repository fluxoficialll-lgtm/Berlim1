import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import { Post } from '../types';
import { USE_MOCKS } from '../mocks';

// Componentes Modulares
import { AdSelectionHeader } from '../components/ads/selection/AdSelectionHeader';
import { AdContentTabs } from '../components/ads/selection/AdContentTabs';
import { PostSelectionCard } from '../components/ads/selection/PostSelectionCard';
import { ReelSelectionCard } from '../components/ads/selection/ReelSelectionCard';

export const AdContentSelector: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
    const [content, setContent] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            const user = authService.getCurrentUser();
            if (user) {
                // Em modo Mock, postService.getUserPosts já retorna posts do u-creator-002 se o usuário for mock
                const allPosts = await postService.getUserPosts(user.id);
                setContent(allPosts);
            }
            setLoading(false);
        };
        loadContent();
    }, []);

    const filteredContent = content.filter(p => 
        activeTab === 'reels' ? p.type === 'video' : (p.type === 'photo' || p.type === 'text')
    );

    const handleSelect = (post: Post) => {
        navigate('/ad-placement-selector', { state: { boostedContent: post } });
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col">
            <AdSelectionHeader 
                onBack={() => navigate('/ad-type-selector')} 
                title="Escolher Conteúdo" 
            />

            <AdContentTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />

            <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-40">
                        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff] mb-2"></i>
                        <p className="text-[10px] font-black uppercase tracking-widest">Sincronizando Galeria...</p>
                    </div>
                ) : filteredContent.length > 0 ? (
                    <div className="animate-fade-in">
                        {activeTab === 'posts' ? (
                            <div className="flex flex-col p-4 max-w-[500px] mx-auto w-full px-3">
                                {filteredContent.map(p => (
                                    <PostSelectionCard 
                                        key={p.id} 
                                        post={p} 
                                        onSelect={handleSelect} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-[2px] p-[2px]">
                                {filteredContent.map(p => (
                                    <ReelSelectionCard 
                                        key={p.id} 
                                        reel={p} 
                                        onSelect={handleSelect} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 opacity-20 text-center px-12">
                        <i className={`fa-solid ${activeTab === 'reels' ? 'fa-video-slash' : 'fa-file-circle-exclamation'} text-5xl mb-6`}></i>
                        <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">
                            Você ainda não publicou nenhum {activeTab === 'reels' ? 'reel' : 'post'} para impulsionar.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};