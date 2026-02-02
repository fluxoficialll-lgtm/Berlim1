
import React, { useMemo } from 'react';
import { AdCampaign, Post, MarketplaceItem } from '../../types';
import { FeedItem } from '../feed/FeedItem';
import { ProductCard } from '../marketplace/ProductCard';

interface AdPreviewProps {
    campaign: Partial<AdCampaign>;
    previewTab: 'feed' | 'reels' | 'marketplace';
    setPreviewTab: (tab: 'feed' | 'reels' | 'marketplace') => void;
    destinationMode: 'url' | 'group';
}

const CTA_ICONS: Record<string, string> = {
    'conferir': 'fa-eye',
    'participar': 'fa-user-group',
    'comprar': 'fa-cart-shopping',
    'assinar': 'fa-credit-card',
    'entrar': 'fa-arrow-right-to-bracket',
    'descubra': 'fa-compass',
    'baixar': 'fa-download',
    'saiba mais': 'fa-circle-info'
};

export const AdPreview: React.FC<AdPreviewProps> = ({ campaign, previewTab, setPreviewTab, destinationMode }) => {
    
    // Lógica para saber se o formato atual está bloqueado
    const isLocked = useMemo(() => {
        if (!campaign.placements) return false;
        return !campaign.placements.includes(previewTab as any);
    }, [campaign.placements, previewTab]);

    const activeCta = useMemo(() => {
        return campaign.placementCtas?.[previewTab] || campaign.ctaButton || 'saiba mais';
    }, [campaign.placementCtas, campaign.ctaButton, previewTab]);

    const activeMedia = useMemo(() => {
        const specific = campaign.placementCreatives?.[previewTab];
        if (specific?.mediaUrl) return specific;
        return campaign.creative || { mediaUrl: undefined, mediaType: 'image' };
    }, [campaign.placementCreatives, campaign.creative, previewTab]);

    const getCtaIcon = (label: string) => CTA_ICONS[label.toLowerCase()] || 'fa-arrow-right';

    const mockPost = useMemo<Post>(() => ({
        id: 'preview_id',
        type: activeMedia?.mediaType === 'video' ? 'video' : (activeMedia?.mediaUrl ? 'photo' : 'text'),
        authorId: campaign.ownerId || 'preview_author',
        username: '@SuaMarca',
        text: campaign.creative?.text || 'Sua legenda aparecerá aqui...',
        image: activeMedia?.mediaType !== 'video' ? activeMedia?.mediaUrl : undefined,
        video: activeMedia?.mediaType === 'video' ? activeMedia?.mediaUrl : undefined,
        time: 'Patrocinado',
        timestamp: Date.now(),
        isPublic: true,
        views: 1250,
        likes: 450,
        comments: 12,
        liked: false,
        isAd: true,
        ctaText: activeCta,
        ctaLink: '#preview',
        location: 'Patrocinado'
    }), [campaign, activeCta, activeMedia]);

    const mockProduct = useMemo<MarketplaceItem>(() => ({
        id: 'preview_market_id',
        title: campaign.name || 'Título do seu Anúncio',
        price: 0,
        category: 'Patrocinado',
        location: 'Patrocinado',
        description: campaign.creative?.text || '',
        image: activeMedia?.mediaUrl,
        sellerId: campaign.ownerId || 'preview_seller',
        sellerName: '@SuaMarca',
        timestamp: Date.now(),
        isAd: true,
        ctaText: activeCta,
        ctaLink: '#preview'
    }), [campaign, activeCta, activeMedia]);

    return (
        <div className="preview-section animate-fade-in relative">
            <style>{`
                .preview-tabs { display: flex; gap: 4px; background: #090b0e; padding: 4px; border-radius: 14px; margin-bottom: 20px; }
                .preview-tabs button { flex: 1; padding: 10px; border: none; background: transparent; color: #555; font-size: 10px; font-weight: 800; border-radius: 10px; cursor: pointer; text-transform: uppercase; }
                .preview-tabs button.active { background: #1a1e26; color: #00c2ff; }
                .preview-tabs button.locked { opacity: 0.3; }
                .preview-canvas { width: 100%; background: #0c0f14; border-radius: 32px; border: 6px solid #1a1e26; min-height: 500px; position: relative; overflow: hidden; }
                .locked-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.85); z-index: 30; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
            `}</style>

            <div className="preview-tabs">
                {['feed', 'reels', 'marketplace'].map(t => (
                    <button key={t} className={`${previewTab === t ? 'active' : ''} ${!campaign.placements?.includes(t as any) ? 'locked' : ''}`} onClick={() => setPreviewTab(t as any)}>
                        {t} {!campaign.placements?.includes(t as any) && <i className="fa-solid fa-lock ml-1 text-[8px]"></i>}
                    </button>
                ))}
            </div>

            <div className="preview-canvas">
                {isLocked && (
                    <div className="locked-overlay animate-fade-in">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                            <i className="fa-solid fa-lock text-red-500 text-2xl"></i>
                        </div>
                        <h4 className="text-white font-black uppercase text-xs tracking-widest">Formato Bloqueado</h4>
                        <p className="text-gray-500 text-[10px] mt-2 px-10 text-center leading-relaxed">
                            Este posicionamento não é compatível com o tipo de conteúdo original selecionado.
                        </p>
                    </div>
                )}
                
                <div className="p-2">
                    {previewTab === 'feed' && <FeedItem post={mockPost} onLike={()=>{}} onDelete={()=>{}} onUserClick={()=>{}} onCommentClick={()=>{}} onShare={()=>{}} onVote={()=>{}} onCtaClick={()=>{}} />}
                    {previewTab === 'marketplace' && <div className="p-4"><ProductCard product={mockProduct} onClick={()=>{}} /></div>}
                    {previewTab === 'reels' && (
                        <div className="h-[480px] bg-black rounded-2xl relative overflow-hidden flex items-center justify-center">
                            {activeMedia?.mediaUrl ? (
                                <video src={activeMedia.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                            ) : <i className="fa-solid fa-video text-gray-800 text-5xl"></i>}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="text-white font-bold text-sm">@SuaMarca</div>
                                <div className="text-gray-300 text-xs line-clamp-1">{campaign.creative?.text}</div>
                                <div className="mt-3 p-3 bg-[#00c2ff] text-black text-[10px] font-black rounded-lg text-center uppercase">{activeCta}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
