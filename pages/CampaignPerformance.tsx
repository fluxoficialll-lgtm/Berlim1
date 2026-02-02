
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adService } from '../services/adService';
import { postService } from '../services/postService';
import { CampaignInfoCard } from '../components/ads/performance/CampaignInfoCard';
import { DeliveryMetrics } from '../components/ads/performance/DeliveryMetrics';
import { ClickMetrics } from '../components/ads/performance/ClickMetrics';
import { ConversionMetrics } from '../components/ads/performance/ConversionMetrics';
import { FinancialMetrics } from '../components/ads/performance/FinancialMetrics';
import { AudienceMetrics } from '../components/ads/performance/AudienceMetrics';
import { CreativeMetrics } from '../components/ads/performance/CreativeMetrics';
import { FunnelMetrics } from '../components/ads/performance/FunnelMetrics';
import { SystemMetrics } from '../components/ads/performance/SystemMetrics';
import { AdPreview } from '../components/ads/AdPreview';
// Fix: Import CTA_OPTIONS_CONFIG from constants instead of AdPlacementSelector
import { CTA_OPTIONS_CONFIG } from '../features/ads/constants/AdConstants';
import { AdCampaign } from '../types';
import { useModal } from '../components/ModalSystem';

export const CampaignPerformance: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { showAlert, showOptions } = useModal();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [campaign, setCampaign] = useState<Partial<AdCampaign> | null>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Edit State
    const [previewTab, setPreviewTab] = useState<'feed' | 'reels' | 'marketplace'>('feed');
    const [editCopy, setEditCopy] = useState('');
    const [editCta, setEditCta] = useState('');
    const [editMediaUrl, setEditMediaUrl] = useState<string | undefined>(undefined);
    const [editMediaType, setEditMediaType] = useState<'image' | 'video'>('image');

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const hasChanges = useMemo(() => {
        if (!campaign) return false;
        return editCopy !== campaign.creative?.text || 
               editCta !== (campaign.placementCtas?.[previewTab] || campaign.ctaButton) ||
               editMediaUrl !== (campaign.placementCreatives?.[previewTab]?.mediaUrl || campaign.creative?.mediaUrl);
    }, [campaign, editCopy, editCta, editMediaUrl, previewTab]);

    useEffect(() => {
        const loadAllData = async () => {
            if (!id) {
                navigate('/my-store');
                return;
            }

            setLoading(true);
            setError(null);
            
            try {
                const selectedCamp = adService.getCampaignById(id);
                
                if (selectedCamp) {
                    setCampaign(selectedCamp);
                    setEditCopy(selectedCamp.creative?.text || '');
                    setEditCta(selectedCamp.placementCtas?.[previewTab] || selectedCamp.ctaButton || 'saiba mais');
                    setEditMediaUrl(selectedCamp.placementCreatives?.[previewTab]?.mediaUrl || selectedCamp.creative?.mediaUrl);
                    setEditMediaType(selectedCamp.placementCreatives?.[previewTab]?.mediaType || selectedCamp.creative?.mediaType || 'image');

                    const perfData = await adService.getCampaignPerformance(id);
                    if (perfData) {
                        setMetrics(perfData);
                    } else {
                        setError("Não foi possível processar as métricas desta campanha.");
                    }
                } else {
                    setError("Campanha não encontrada no banco de dados.");
                }
            } catch (err) {
                console.error("Dashboard error:", err);
                setError("Ocorreu um erro ao sincronizar os dados.");
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [id, navigate]);

    // Update form when preview tab changes
    useEffect(() => {
        if (campaign) {
            setEditCta(campaign.placementCtas?.[previewTab] || campaign.ctaButton || 'saiba mais');
            setEditMediaUrl(campaign.placementCreatives?.[previewTab]?.mediaUrl || campaign.creative?.mediaUrl);
            setEditMediaType(campaign.placementCreatives?.[previewTab]?.mediaType || campaign.creative?.mediaType || 'image');
        }
    }, [previewTab, campaign]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setEditMediaUrl(ev.target?.result as string);
                setEditMediaType(file.type.startsWith('video/') ? 'video' : 'image');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateCampaign = async () => {
        if (!id || !campaign || updating) return;
        setUpdating(true);

        try {
            const updates: Partial<AdCampaign> = {
                creative: {
                    ...campaign.creative,
                    text: editCopy
                },
                placementCtas: {
                    ...campaign.placementCtas,
                    [previewTab]: editCta
                },
                placementCreatives: {
                    ...campaign.placementCreatives,
                    [previewTab]: { mediaUrl: editMediaUrl, mediaType: editMediaType }
                }
            };

            await adService.updateCampaign(id, updates);
            setCampaign({ ...campaign, ...updates });
            await showAlert("Sucesso", "Criativo atualizado com sucesso na rede Flux Ads.");
        } catch (e) {
            await showAlert("Erro", "Falha ao atualizar o anúncio.");
        } finally {
            setUpdating(false);
        }
    };

    const handleChangeCta = async () => {
        const options = CTA_OPTIONS_CONFIG.map(opt => ({
            label: opt.label,
            value: opt.label,
            icon: `fa-solid ${opt.icon}`
        }));
        const choice = await showOptions("Escolher Ação", options);
        if (choice) setEditCta(choice);
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] pb-12">
            <style>{`
                .edit-section {
                    background: #15191f; border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 24px; padding: 24px; margin-bottom: 30px;
                }
                .update-btn {
                    width: 100%; padding: 16px; background: #00c2ff; color: #000;
                    border-radius: 14px; font-weight: 900; font-size: 13px;
                    text-transform: uppercase; letter-spacing: 1px; transition: 0.3s;
                    box-shadow: 0 4px 20px rgba(0,194,255,0.3); margin-top: 20px;
                }
                .update-btn:disabled { background: #333; color: #555; box-shadow: none; cursor: not-allowed; }
                .edit-input {
                    width: 100%; background: #0a0c10; border: 1px solid rgba(255,255,255,0.1);
                    padding: 14px; border-radius: 12px; color: #fff; font-size: 14px; outline: none; transition: 0.3s;
                }
                .edit-input:focus { border-color: #00c2ff; }
                .highlight-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    position: relative;
                    overflow: hidden;
                }
                .highlight-card.invested { border-left: 4px solid #00ff82; }
                .highlight-card.used { border-left: 4px solid #ff4d4d; }
            `}</style>

            <header className="flex items-center gap-4 p-4 bg-[#0c0f14] sticky top-0 z-50 border-b border-white/10 h-[65px]">
                <button onClick={() => navigate(-1)} className="text-[#00c2ff] text-xl p-2 hover:bg-white/5 rounded-full transition-all">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="flex flex-col">
                    <h1 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Dashboard de Performance</h1>
                    <span className="text-base font-bold text-white truncate max-w-[200px]">{campaign?.name || 'Carregando...'}</span>
                </div>
            </header>

            <main className="p-5 max-w-[600px] mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff] mb-2"></i>
                        <p className="text-[10px] uppercase font-bold tracking-widest">Sincronizando Flux de Dados...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4 opacity-50"></i>
                        <h2 className="text-lg font-bold mb-2">Ops! Algo deu errado</h2>
                        <p className="text-sm text-gray-500 mb-6 px-10">{error}</p>
                        <button onClick={() => navigate('/my-store')} className="text-[#00c2ff] font-bold uppercase text-xs tracking-widest underline">Voltar para meus negócios</button>
                    </div>
                ) : campaign ? (
                    <div className="animate-fade-in">
                        <CampaignInfoCard campaign={campaign} />

                        {/* CARDS DE DESTAQUE FINANCEIRO */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="highlight-card invested shadow-lg animate-slide-up">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Grana Investida</span>
                                <div className="text-xl font-black text-white">
                                    {formatCurrency(metrics.financial.totalBudget || 0)}
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <i className="fa-solid fa-wallet text-4xl"></i>
                                </div>
                            </div>
                            <div className="highlight-card used shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Grana Usada</span>
                                <div className="text-xl font-black text-white">
                                    {formatCurrency(metrics.financial.spent || 0)}
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <i className="fa-solid fa-chart-pie text-4xl"></i>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO DE PRÉVIA E EDIÇÃO */}
                        <section className="mb-12">
                            <h2 className="text-[10px] font-black text-[#FFD700] uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                <div className="w-1 h-3 bg-[#FFD700] rounded-full"></div>
                                Gestão de Criativos
                            </h2>
                            
                            <AdPreview 
                                campaign={{
                                    ...campaign,
                                    creative: { text: editCopy, mediaUrl: editMediaUrl, mediaType: editMediaType },
                                    placementCtas: { ...campaign.placementCtas, [previewTab]: editCta }
                                }} 
                                previewTab={previewTab} 
                                setPreviewTab={setPreviewTab} 
                                destinationMode={campaign.destinationType as any || 'url'}
                            />

                            <div className="edit-section mt-6 animate-fade-in">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Ajustar Comunicação</h3>
                                
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block">Legenda (Copy)</label>
                                        <textarea 
                                            className="edit-input min-h-[100px] resize-none" 
                                            value={editCopy} 
                                            onChange={e => setEditCopy(e.target.value)}
                                            placeholder="Sua legenda impactante..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block">Mídia do Anúncio</label>
                                            <button 
                                                onClick={() => document.getElementById('edit-file-input')?.click()}
                                                className="w-full py-3.5 bg-black/20 border border-white/10 rounded-xl text-xs font-bold text-white hover:border-[#00c2ff] transition-all"
                                            >
                                                <i className="fa-solid fa-cloud-arrow-up mr-2 text-[#00c2ff]"></i> Alterar
                                            </button>
                                            <input type="file" id="edit-file-input" hidden accept="image/*,video/*" onChange={handleFileChange} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block">Botão de Ação</label>
                                            <button 
                                                onClick={handleChangeCta}
                                                className="w-full py-3.5 bg-black/20 border border-white/10 rounded-xl text-xs font-bold text-white hover:border-[#00c2ff] transition-all flex items-center justify-center gap-2"
                                            >
                                                <i className="fa-solid fa-mouse-pointer text-[#00c2ff]"></i> {editCta.toUpperCase()}
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        className="update-btn" 
                                        disabled={!hasChanges || updating}
                                        onClick={handleUpdateCampaign}
                                    >
                                        {updating ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : 'Salvar Alterações no Criativo'}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* MÉTRICAS */}
                        <section className="mb-8">
                            <h2 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                <div className="w-1 h-3 bg-[#00c2ff] rounded-full"></div>
                                Entrega e Alcance
                            </h2>
                            <DeliveryMetrics data={metrics.delivery} />
                        </section>

                        <section className="mb-8">
                            <h2 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                <div className="w-1 h-3 bg-[#00c2ff] rounded-full"></div>
                                Cliques e Relevância
                            </h2>
                            <ClickMetrics data={metrics.click} />
                        </section>

                        <section className="mb-8">
                            <h2 className="text-[10px] font-black text-[#00ff82] uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                <div className="w-1 h-3 bg-[#00ff82] rounded-full"></div>
                                Conversão
                            </h2>
                            <ConversionMetrics data={metrics.conversion} />
                        </section>

                        <section className="mb-8">
                            <h2 className="text-[10px] font-black text-[#FFD700] uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                <div className="w-1 h-3 bg-[#FFD700] rounded-full"></div>
                                Métricas Financeiras
                            </h2>
                            <FinancialMetrics data={metrics.financial} />
                        </section>

                        <div className="bg-white/5 p-5 rounded-2xl border border-dashed border-white/10 text-center opacity-40">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[2px] leading-relaxed">
                                <i className="fa-solid fa-shield-halved mr-1"></i> Dados auditados via Flux API.
                            </p>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    );
};
