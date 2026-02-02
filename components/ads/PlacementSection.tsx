
import React from 'react';
import { AdCampaign } from '../../types';

interface PlacementSectionProps {
    campaign: Partial<AdCampaign>;
    onToggle: (placement: 'feed' | 'reels' | 'marketplace') => void;
    isLocked: (placement: string) => boolean;
}

export const PlacementSection: React.FC<PlacementSectionProps> = ({ campaign, onToggle, isLocked }) => {
    return (
        <div className="form-card">
            <style>{`
                .placement-chip.locked { 
                    opacity: 0.4; 
                    cursor: not-allowed !important; 
                    background: rgba(255,255,255,0.02) !important;
                    border-color: rgba(255,255,255,0.05) !important;
                    color: #555 !important;
                }
                .lock-indicator {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    font-size: 10px;
                    color: #ff4d4d;
                }
            `}</style>
            <div className="card-header"><i className="fa-solid fa-map"></i> Posicionamento</div>
            <div className="card-body">
                <div className="placements-row">
                    {['feed', 'reels', 'marketplace'].map(p => {
                        const locked = isLocked(p);
                        const selected = campaign.placements?.includes(p as any);
                        return (
                            <div
                                key={p}
                                className={`placement-chip ${selected ? 'selected' : ''} ${locked ? 'locked' : ''}`}
                                onClick={() => !locked && onToggle(p as any)}
                            >
                                <i className={`fa-solid ${p === 'feed' ? 'fa-newspaper' : (p === 'reels' ? 'fa-video' : 'fa-store')}`}></i>
                                <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                                {locked && (
                                    <div className="lock-indicator">
                                        <i className="fa-solid fa-lock"></i>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {campaign.placements?.length === 1 && (
                    <p className="text-[9px] text-gray-600 mt-4 text-center font-bold uppercase tracking-widest">
                        <i className="fa-solid fa-circle-info mr-1"></i> Formatos restritos para manter a compatibilidade da mídia.
                    </p>
                )}
            </div>
        </div>
    );
};
