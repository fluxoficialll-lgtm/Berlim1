
import React from 'react';
import { AdCampaign, Group } from '../../types';
import { SelectionField } from './SelectionField';
import { useModal } from '../ModalSystem';

interface DestinationCreativeSectionProps {
    campaign: Partial<AdCampaign>;
    destinationMode: 'url' | 'group';
    setDestinationMode: (mode: 'url' | 'group') => void;
    onInputChange: (field: keyof AdCampaign, value: any) => void;
    onNestedChange: (parent: 'creative', field: string, value: any) => void;
    onPlacementCreativeChange: (placement: 'feed' | 'reels' | 'marketplace', mediaUrl: string, mediaType: 'image' | 'video') => void;
    myGroups: Group[];
    selectedContent: any;
    ctaOptions: { label: string; icon: string; allowUrl: boolean; allowGroup: boolean }[];
    onCtaUpdate: (placement: 'feed' | 'reels' | 'marketplace', label: string) => void;
    isUrlAllowed: boolean;
    isGroupAllowed: boolean;
}

export const DestinationCreativeSection: React.FC<DestinationCreativeSectionProps> = ({
    campaign, destinationMode, setDestinationMode, onInputChange, onNestedChange,
    onPlacementCreativeChange, myGroups, selectedContent, ctaOptions, onCtaUpdate, isUrlAllowed, isGroupAllowed
}) => {
    const { showOptions } = useModal();

    const handleDestTypeClick = async () => {
        if (campaign.pricingModel === 'commission') return;
        const options = [];
        if (isUrlAllowed) options.push({ label: "Link Externo", value: "url", icon: "fa-solid fa-link" });
        if (isGroupAllowed) options.push({ label: "Comunidade Flux", value: "group", icon: "fa-solid fa-users" });
        const choice = await showOptions("Tipo de Destino", options);
        if (choice) setDestinationMode(choice);
    };

    const handleGroupSelectClick = async () => {
        if (selectedContent) return;
        const choices = myGroups.map(g => ({
            label: g.name,
            value: g.id,
            icon: g.isVip ? "fa-solid fa-crown" : "fa-solid fa-users"
        }));
        if (choices.length === 0) { alert("Você não possui comunidades criadas."); return; }
        const choice = await showOptions("Escolher Comunidade", choices);
        if (choice) onInputChange('targetGroupId', choice);
    };

    const handleFileChange = (placement: 'feed' | 'reels' | 'marketplace', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result as string;
                const type = file.type.startsWith('video/') ? 'video' : 'image';
                onPlacementCreativeChange(placement, result, type);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCtaClick = async (placement: 'feed' | 'reels' | 'marketplace') => {
        const options = ctaOptions.map(opt => ({
            label: opt.label.toUpperCase(),
            value: opt.label,
            icon: `fa-solid ${opt.icon}`
        }));
        const choice = await showOptions(`Ação do ${placement.toUpperCase()}`, options);
        if (choice) onCtaUpdate(placement, choice);
    };

    const isFeedActive = campaign.placements?.includes('feed');
    const isReelsActive = campaign.placements?.includes('reels');
    const isMarketActive = campaign.placements?.includes('marketplace');

    const renderPlacementCard = (placement: 'feed' | 'reels' | 'marketplace', color: string, icon: string, title: string) => {
        const creative = campaign.placementCreatives?.[placement];
        const currentCta = campaign.placementCtas?.[placement] || campaign.ctaButton || 'saiba mais';
        const inputId = `file-input-${placement}`;

        return (
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}1a`, color }}>
                            <i className={`fa-solid ${icon}`}></i>
                        </div>
                        <h4 className="font-bold text-xs text-white uppercase tracking-widest">{title}</h4>
                    </div>
                    {creative?.mediaUrl && <i className="fa-solid fa-circle-check text-[#00ff82] text-[10px]"></i>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => document.getElementById(inputId)?.click()}
                        className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:text-white hover:border-[#00c2ff] transition-all flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-image text-[#00c2ff]"></i>
                        {creative?.mediaUrl ? 'ALTERAR' : 'MÍDIA'}
                    </button>
                    <input type="file" id={inputId} hidden accept="image/*,video/*" onChange={(e) => handleFileChange(placement, e)} />

                    <button 
                        onClick={() => handleCtaClick(placement)}
                        className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:text-white hover:border-[#00c2ff] transition-all flex items-center justify-center gap-2 truncate"
                    >
                        <i className="fa-solid fa-mouse-pointer text-[#00c2ff]"></i>
                        {currentCta.toUpperCase()}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="form-card">
            <div className="card-header"><i className="fa-solid fa-bullseye"></i> Destino e Criativos</div>
            <div className="card-body space-y-6">
                
                <div className="flex flex-col gap-4">
                     <SelectionField 
                        label="Para onde o tráfego será enviado?"
                        value={destinationMode === 'url' ? 'Link Externo' : 'Comunidade Flux'}
                        icon="fa-solid fa-location-arrow"
                        onClick={handleDestTypeClick}
                        disabled={campaign.pricingModel === 'commission'}
                    />

                    {destinationMode === 'url' && (
                        <div className="input-group highlight-box">
                            <label>URL de Destino</label>
                            <input 
                                type="url" 
                                value={campaign.targetUrl} 
                                onChange={e => onInputChange('targetUrl', e.target.value)} 
                                placeholder="https://exemplo.com" 
                                className="w-full bg-[#0c0f14] border border-[#00c2ff]/30 p-4 rounded-2xl outline-none focus:border-[#00c2ff] text-sm text-[#00c2ff]"
                            />
                        </div>
                    )}

                    {destinationMode === 'group' && (
                        <SelectionField 
                            label="Comunidade de Destino"
                            value={myGroups.find(g => g.id === campaign.targetGroupId)?.name || "Selecione a Comunidade"}
                            icon="fa-solid fa-circle-nodes"
                            onClick={handleGroupSelectClick}
                            disabled={!!selectedContent}
                        />
                    )}
                </div>

                <div className="w-full h-px bg-white/5 my-2"></div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] ml-1">Configurar Criativos Individuais</h3>
                    <div className="grid gap-3">
                        {isFeedActive && renderPlacementCard('feed', '#00c2ff', 'fa-newspaper', 'Feed')}
                        {isReelsActive && renderPlacementCard('reels', '#ee2a7b', 'fa-clapperboard', 'Reels')}
                        {isMarketActive && renderPlacementCard('marketplace', '#00ff82', 'fa-store', 'Mercado')}
                    </div>
                </div>

                <div className="input-group mt-6">
                    <label>Legenda Principal (Copy)</label>
                    <textarea
                        value={campaign.creative?.text}
                        onChange={e => onNestedChange('creative', 'text', e.target.value)}
                        placeholder="Escreva algo impactante para atrair seu público..."
                        rows={4}
                        className="w-full bg-[#0c0f14] border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00c2ff] text-sm resize-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};
