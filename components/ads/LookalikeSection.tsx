
import React from 'react';
import { AdCampaign, Group } from '../../types';

interface LookalikeSectionProps {
    campaign: Partial<AdCampaign>;
    myGroups: Group[];
    onTargetingChange: (field: string, value: any) => void;
}

export const LookalikeSection: React.FC<LookalikeSectionProps> = ({
    campaign, myGroups, onTargetingChange
}) => {
    const vipGroups = myGroups.filter(g => g.isVip);

    return (
        <div className="form-card">
            <style>{`
                .lookalike-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 14px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .lookalike-item.selected {
                    background: rgba(255, 215, 0, 0.05);
                    border-color: #FFD700;
                }
                .lookalike-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: #1a1e26;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #FFD700;
                    font-size: 16px;
                }
            `}</style>
            <div className="card-header">
                <i className="fa-solid fa-users-rays"></i> Públicos Semelhantes (Lookalike)
            </div>
            <div className="card-body">
                <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest leading-relaxed">
                    A IA encontrará pessoas com o mesmo comportamento de compra dos membros do seu grupo selecionado.
                </p>

                {vipGroups.length > 0 ? (
                    <div className="space-y-2">
                        <div 
                            className={`lookalike-item ${!campaign.targeting?.lookalikeGroupId ? 'selected' : ''}`}
                            onClick={() => onTargetingChange('lookalikeGroupId', undefined)}
                        >
                            <div className="lookalike-icon" style={{ color: '#aaa' }}>
                                <i className="fa-solid fa-globe"></i>
                            </div>
                            <div className="flex-1">
                                <span className="text-xs font-bold text-white">Nenhum (Público Amplo)</span>
                            </div>
                            {!campaign.targeting?.lookalikeGroupId && <i className="fa-solid fa-circle-check text-[#FFD700]"></i>}
                        </div>

                        {vipGroups.map(group => (
                            <div 
                                key={group.id}
                                className={`lookalike-item ${campaign.targeting?.lookalikeGroupId === group.id ? 'selected' : ''}`}
                                onClick={() => onTargetingChange('lookalikeGroupId', group.id)}
                            >
                                <div className="lookalike-icon">
                                    <i className="fa-solid fa-crown"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-bold text-white block truncate">{group.name}</span>
                                    <span className="text-[9px] text-gray-500 uppercase font-black">{group.memberIds?.length || 0} Modelos de Perfil</span>
                                </div>
                                {campaign.targeting?.lookalikeGroupId === group.id && <i className="fa-solid fa-circle-check text-[#FFD700]"></i>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/5 border border-dashed border-white/10 p-5 rounded-2xl text-center">
                        <i className="fa-solid fa-lock text-gray-700 text-2xl mb-2"></i>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Você ainda não possui grupos VIP para usar como base.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
