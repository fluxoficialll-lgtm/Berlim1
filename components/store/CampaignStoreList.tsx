
import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdCampaign } from '../../types';
import { adService } from '../../services/adService';
import { useVipPricing } from '../../hooks/useVipPricing';
import { useModal } from '../ModalSystem';
import { budgetManager } from '../../services/ads/engine/BudgetManager';

// Lazy load do modal de pagamento para manter performance
const PaymentFlowModal = lazy(() => import('../payments/PaymentFlowModal').then(m => ({ default: m.PaymentFlowModal })));

interface CampaignStoreListProps {
    campaigns: AdCampaign[];
    onDelete: (id: string, e: React.MouseEvent) => void;
    onEnd: (id: string, e: React.MouseEvent) => void;
    onResume: (id: string, e: React.MouseEvent) => void;
}

const formatMetric = (num: number): string => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
};

export const CampaignStoreList: React.FC<CampaignStoreListProps> = ({ campaigns, onDelete, onEnd, onResume }) => {
    const navigate = useNavigate();
    const { showPrompt } = useModal();
    const [paymentCampaign, setPaymentCampaign] = useState<AdCampaign | null>(null);
    const [topUpAmount, setTopUpAmount] = useState<number>(0);

    // Utilizamos o hook de precificação inteligente para converter o orçamento para a moeda local do anunciante
    const { geoData, displayPriceInfo } = useVipPricing(
        paymentCampaign ? {
            id: paymentCampaign.id,
            name: paymentCampaign.name,
            price: (topUpAmount || paymentCampaign.budget).toString(),
            currency: 'BRL'
        } as any : null
    );

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleCardClick = (camp: AdCampaign) => {
        if (camp.status === 'pending') {
            setTopUpAmount(0);
            setPaymentCampaign(camp);
        }
    };

    const handleTopUpClick = async (e: React.MouseEvent, camp: AdCampaign) => {
        e.stopPropagation();
        const value = await showPrompt(
            "Adicionar Saldo", 
            "Informe o valor que deseja adicionar à sua campanha (Min R$ 10,00):",
            "Ex: 50,00"
        );
        
        if (value) {
            const numeric = parseFloat(value.replace(/\./g, '').replace(',', '.'));
            if (isNaN(numeric) || numeric < 10) {
                alert("Valor inválido. O mínimo é R$ 10,00.");
                return;
            }
            setTopUpAmount(numeric);
            setPaymentCampaign(camp);
        }
    };

    const handlePaymentSuccess = async () => {
        if (paymentCampaign) {
            if (topUpAmount > 0) {
                await adService.addBudget(paymentCampaign.id, topUpAmount);
            } else {
                await adService.updateCampaignStatus(paymentCampaign.id, 'active');
            }
            setPaymentCampaign(null);
            setTopUpAmount(0);
        }
    };

    return (
        <div className="campaigns-list animate-fade-in">
            <style>{`
                .btn-performance-grid {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: rgba(0, 194, 255, 0.1);
                    color: #00c2ff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: 0.3s;
                    border: 1px solid rgba(0, 194, 255, 0.2);
                    margin-top: 4px;
                }
                .btn-performance-grid:hover {
                    background: #00c2ff;
                    color: #000;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,194,255,0.3);
                }
                .camp-card-wrapper {
                    position: relative;
                    margin-bottom: 15px;
                    transition: 0.3s;
                }
                .camp-card-wrapper.pending {
                    cursor: pointer;
                }
                .camp-card-wrapper.pending:active {
                    transform: scale(0.98);
                }
                .camp-status.pending-payment {
                    background: #FFD700;
                    color: #000;
                    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
                }
                .camp-status.ended {
                    background: rgba(255, 255, 255, 0.1);
                    color: #888;
                }
                .pending-overlay { position: absolute; inset: 0; background: rgba(255, 215, 0, 0.03); border-radius: 20px; pointer-events: none; border: 1px solid rgba(255, 215, 0, 0.1); }
                .pay-now-btn { width: 100%; padding: 14px; background: linear-gradient(90deg, #FFD700, #FDB931); color: #000; border: none; border-radius: 12px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px; }
                
                .top-up-btn {
                    width: 100%; padding: 12px; background: rgba(0, 194, 255, 0.08); 
                    border: 1px solid rgba(0, 194, 255, 0.2); border-radius: 12px; 
                    color: #00c2ff; font-weight: 900; font-size: 12px; 
                    text-transform: uppercase; letter-spacing: 1.5px;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    margin-bottom: 12px; transition: 0.3s; cursor: pointer;
                }
                .top-up-btn:hover { background: #00c2ff; color: #000; box-shadow: 0 0 20px rgba(0, 194, 255, 0.3); }

                .camp-actions-footer {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                .action-btn-list {
                    flex: 1;
                    padding: 12px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .btn-stop { 
                    background: transparent; 
                    border: 1px solid rgba(255, 77, 77, 0.3); 
                    color: #ff4d4d; 
                    width: 100%;
                }
                .btn-stop:hover { background: rgba(255, 77, 77, 0.08); }

                .btn-resume { 
                    background: rgba(0, 194, 255, 0.1); 
                    border: 1px solid #00c2ff; 
                    color: #00c2ff; 
                }
                .btn-resume:hover { background: #00c2ff; color: #000; }

                .btn-delete { 
                    background: transparent; 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    color: #666; 
                }
                .btn-delete:hover { border-color: #ff4d4d; color: #ff4d4d; background: rgba(255, 77, 77, 0.05); }
            `}</style>
            
            {campaigns.length > 0 ? campaigns.map(camp => {
                // Nova lógica: Só mostra Adicionar Saldo se a campanha estiver ativa e sem saldo
                const isActive = camp.status === 'active';
                const isDepleted = !budgetManager.hasAvailableBudget(camp);
                const showTopUp = isActive && camp.pricingModel !== 'commission' && isDepleted;

                return (
                    <div 
                        key={camp.id} 
                        className={`campaign-card camp-card-wrapper ${camp.status === 'pending' ? 'pending' : ''}`}
                        onClick={() => handleCardClick(camp)}
                    >
                        {camp.status === 'pending' && <div className="pending-overlay"></div>}
                        
                        <div className="camp-header">
                            <div className="camp-name">{camp.name}</div>
                            <div className={`camp-status ${camp.status === 'active' ? '' : (camp.status === 'ended' ? 'ended' : 'pending-payment')}`}>
                                {camp.status === 'active' ? 'Veiculando' : (camp.status === 'ended' ? 'Encerrada' : 'Aguardando Pagamento')}
                            </div>
                        </div>
                        
                        <div className="camp-desc">
                            {camp.creative.text.length > 80 ? camp.creative.text.substring(0, 80) + '...' : camp.creative.text}
                        </div>

                        <div className="camp-metrics">
                            <div className="metric">
                                <span className="metric-label">Investimento</span>
                                <span className="metric-val" style={{ color: camp.pricingModel === 'commission' ? '#FFD700' : '#00ff82' }}>
                                    {camp.pricingModel === 'commission' ? 'CPA' : formatCurrency(camp.budget)}
                                </span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Alcance</span>
                                <span className="metric-val">{formatMetric(camp.stats?.views || 0)}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Cliques</span>
                                <span className="metric-val">{formatMetric(camp.stats?.clicks || 0)}</span>
                            </div>
                            <div className="metric action">
                                <span className="metric-label">Métricas</span>
                                <div 
                                    className="btn-performance-grid" 
                                    title="Ver Desempenho Completo"
                                    onClick={(e) => { 
                                        e.preventDefault();
                                        e.stopPropagation(); 
                                        if (camp.status === 'active' || camp.status === 'ended') {
                                            navigate(`/campaign-performance/${camp.id}`);
                                        } else {
                                            alert("As métricas estarão disponíveis após a ativação do pagamento.");
                                        }
                                    }}
                                >
                                    <i className={`fa-solid ${camp.status !== 'pending' ? 'fa-chart-simple' : 'fa-lock opacity-30'}`}></i>
                                </div>
                            </div>
                        </div>

                        {showTopUp && (
                            <button 
                                className="top-up-btn"
                                onClick={(e) => handleTopUpClick(e, camp)}
                            >
                                <i className="fa-solid fa-circle-plus"></i> Adicionar Saldo (Orçamento Esgotado)
                            </button>
                        )}

                        {camp.status === 'pending' && (
                            <button 
                                className="pay-now-btn"
                                onClick={(e) => { e.stopPropagation(); setPaymentCampaign(camp); }}
                            >
                                <i className="fa-solid fa-credit-card"></i> Fazer Pagamento
                            </button>
                        )}

                        <div className="camp-actions-footer">
                            {camp.status === 'active' ? (
                                <button className="action-btn-list btn-stop" onClick={(e) => onEnd(camp.id!, e)}>
                                    <i className="fa-solid fa-stop-circle"></i> Encerrar Campanha
                                </button>
                            ) : camp.status === 'ended' ? (
                                <>
                                    <button className="action-btn-list btn-resume" onClick={(e) => onResume(camp.id!, e)}>
                                        <i className="fa-solid fa-play-circle"></i> Retomar
                                    </button>
                                    <button className="action-btn-list btn-delete" onClick={(e) => onDelete(camp.id!, e)}>
                                        <i className="fa-solid fa-trash-can"></i> Excluir
                                    </button>
                                </>
                            ) : (
                                <button className="action-btn-list btn-delete w-full" onClick={(e) => onDelete(camp.id!, e)}>
                                    <i className="fa-solid fa-trash-can"></i> Remover Rascunho
                                </button>
                            )}
                        </div>
                    </div>
                );
            }) : (
                <div className="empty-state">
                    <i className="fa-solid fa-bullhorn"></i>
                    <p>Nenhuma campanha configurada.</p>
                </div>
            )}

            <button className="add-btn gold" onClick={() => navigate('/ad-type-selector')}>
                <i className="fa-solid fa-rocket"></i> Iniciar Nova Promoção
            </button>

            <Suspense fallback={null}>
                {paymentCampaign && (
                    <PaymentFlowModal 
                        isOpen={!!paymentCampaign}
                        onClose={() => { setPaymentCampaign(null); setTopUpAmount(0); }}
                        group={{
                            id: paymentCampaign.id,
                            name: topUpAmount > 0 ? `Recarga: ${paymentCampaign.name}` : `Anúncio: ${paymentCampaign.name}`,
                            price: (topUpAmount || paymentCampaign.budget).toString(),
                            currency: 'BRL',
                            creatorEmail: paymentCampaign.ownerEmail,
                            isVip: false
                        } as any}
                        provider={geoData?.countryCode === 'BR' ? 'syncpay' : 'stripe'}
                        convertedPriceInfo={displayPriceInfo}
                        geo={geoData}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
            </Suspense>
        </div>
    );
};
