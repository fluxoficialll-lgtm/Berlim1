
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupSettings } from '../../../features/groups/hooks/useGroupSettings';
import { VipMonetizationSection } from '../../../features/groups/components/settings/VipMonetizationSection';
import { PixelSettingsModal } from '../../../components/groups/PixelSettingsModal';
import { ProviderSelectorModal } from '../../../components/groups/ProviderSelectorModal';
import { postService } from '../../../services/postService';
import { UploadProgressCard } from '../../../features/groups/components/platform/UploadProgressCard';

export const GroupVipPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { group, loading, handleSave, handleManualRelease, form } = useGroupSettings();
    
    const [isVipDoorModalOpen, setIsVipDoorModalOpen] = useState(false);
    const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);
    const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>(undefined);

    // Upload States
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadCurrent, setUploadCurrent] = useState(0);
    const [uploadTotal, setUploadTotal] = useState(0);

    if (loading || !group) return null;

    const handleOpenPixel = (platform?: string) => {
        setSelectedPlatform(platform);
        setIsPixelModalOpen(true);
    };

    const handleGalleryMediaAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files) as File[];
        const availableSlots = 10 - form.vipMediaItems.length;
        const toUpload = fileArray.slice(0, availableSlots);

        if (toUpload.length === 0) {
            alert("Limite de 10 mídias atingido.");
            return;
        }

        setIsUploading(true);
        setUploadTotal(toUpload.length);
        setUploadCurrent(0);
        setUploadProgress(0);

        const newItems = [];

        for (let i = 0; i < toUpload.length; i++) {
            const file = toUpload[i];
            setUploadCurrent(i + 1);
            setUploadProgress(Math.round((i / toUpload.length) * 100));

            try {
                const url = await postService.uploadMedia(file, 'vips_doors');
                const type = file.type.startsWith('video') ? 'video' as const : 'image' as const;
                
                newItems.push({ url, type });
                setUploadProgress(Math.round(((i + 1) / toUpload.length) * 100));
            } catch (err) {
                console.error("Erro no upload de mídia VIP:", err);
            }
        }

        if (newItems.length > 0) {
            form.setVipMediaItems([...form.vipMediaItems, ...newItems]);
        }

        setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <style>{`
                .vip-editor-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.98); z-index: 100; display: flex; flex-direction: column; }
                .input-field { background: #15191f; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 12px; color: #fff; width: 100%; outline: none; }
                
                .media-item-container { position: relative; width: 96px; height: 120px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; }
                .media-controls-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px; opacity: 0; transition: 0.2s; }
                .media-item-container:hover .media-controls-overlay { opacity: 1; }
                
                .reorder-btn { width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; display: flex; items-center; justify-content: center; cursor: pointer; font-size: 10px; transition: 0.2s; }
                .reorder-btn:hover { background: #00c2ff; color: #000; border-color: #00c2ff; }
                .reorder-btn:disabled { opacity: 0.2; cursor: not-allowed; }
                
                .delete-media-btn { width: 28px; height: 28px; border-radius: 8px; background: rgba(255, 77, 77, 0.2); border: 1px solid rgba(255, 77, 77, 0.4); color: #ff4d4d; display: flex; items-center; justify-content: center; cursor: pointer; font-size: 10px; }
                .delete-media-btn:hover { background: #ff4d4d; color: #fff; }
            `}</style>
            
            <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
                <button onClick={() => navigate(`/group-settings/${id}`)} className="mr-4 text-white text-xl">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold text-[#FFD700]">Funil de Vendas VIP</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-5 max-w-[600px] mx-auto w-full pb-32 no-scrollbar">
                <div className="animate-fade-in">
                    <VipMonetizationSection 
                        vipPrice={form.vipPrice}
                        setVipPrice={form.setVipPrice}
                        vipCurrency={form.vipCurrency}
                        setVipCurrency={form.setVipCurrency}
                        selectedProviderId={form.selectedProviderId}
                        onOpenProviderSelector={() => setIsProviderModalOpen(true)}
                        pixelConfig={form.pixelConfig}
                        onOpenDoorEditor={() => setIsVipDoorModalOpen(true)}
                        onOpenPixelEditor={handleOpenPixel}
                        onManualRelease={handleManualRelease}
                    />
                </div>
                <button 
                    className="btn-save-fixed" 
                    style={{background: '#FFD700', color: '#000'}} 
                    onClick={handleSave}
                    disabled={isUploading}
                >
                    {isUploading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Salvar Estrutura de Vendas'}
                </button>

                <UploadProgressCard 
                    progress={uploadProgress}
                    current={uploadCurrent}
                    total={uploadTotal}
                    isVisible={isUploading}
                />
            </main>

            {isVipDoorModalOpen && (
                <div className="vip-editor-modal animate-fade-in">
                    <header className="flex items-center p-4 border-b border-white/10">
                        <button onClick={() => setIsVipDoorModalOpen(false)} className="mr-4 text-white text-xl"><i className="fa-solid fa-xmark"></i></button>
                        <h1 className="font-bold">Design da Porta VIP</h1>
                    </header>
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Copy de Venda</label>
                            <textarea className="input-field min-h-[150px]" value={form.vipDoorText} onChange={e => form.setVipDoorText(e.target.value)} placeholder="Benefícios do acesso..."></textarea>
                            <input type="text" className="input-field" value={form.vipButtonText} onChange={e => form.setVipButtonText(e.target.value)} placeholder="Texto do botão..." />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Galeria de Mídia ({form.vipMediaItems.length}/10)</label>
                                {form.vipMediaItems.length > 1 && <span className="text-[9px] text-[#00c2ff] font-black uppercase">Passe o mouse para reordenar</span>}
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                {form.vipMediaItems.map((item, idx) => (
                                    <div key={idx} className="media-item-container">
                                        {item.type === 'image' ? (
                                            <img src={item.url} className="w-full h-full object-cover" alt="VIP" />
                                        ) : (
                                            <div className="w-full h-full bg-black flex items-center justify-center">
                                                <i className="fa-solid fa-video text-xs text-[#FFD700]"></i>
                                            </div>
                                        )}
                                        
                                        <div className="media-controls-overlay">
                                            <div className="flex gap-1 w-full justify-center">
                                                <button 
                                                    type="button"
                                                    onClick={() => form.moveVipMediaItem(idx, 'left')}
                                                    disabled={idx === 0}
                                                    className="reorder-btn"
                                                    title="Mover para trás"
                                                >
                                                    <i className="fa-solid fa-chevron-left"></i>
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => form.moveVipMediaItem(idx, 'right')}
                                                    disabled={idx === form.vipMediaItems.length - 1}
                                                    className="reorder-btn"
                                                    title="Mover para frente"
                                                >
                                                    <i className="fa-solid fa-chevron-right"></i>
                                                </button>
                                            </div>
                                            
                                            <button 
                                                type="button"
                                                onClick={() => form.setVipMediaItems(form.vipMediaItems.filter((_, i) => i !== idx))} 
                                                className="delete-media-btn"
                                                title="Remover"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                        
                                        <div className="absolute top-1 left-1 bg-black/60 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md border border-white/10">
                                            #{idx + 1}
                                        </div>
                                    </div>
                                ))}
                                
                                {form.vipMediaItems.length < 10 && (
                                    <button 
                                        onClick={() => document.getElementById('mediaSubVip')?.click()} 
                                        className="w-[96px] h-[120px] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 hover:text-[#00c2ff] hover:border-[#00c2ff]/30 transition-all"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? <i className="fa-solid fa-circle-notch fa-spin text-xl"></i> : (
                                            <>
                                                <i className="fa-solid fa-plus text-xl mb-1"></i>
                                                <span className="text-[8px] font-black uppercase">Adicionar</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            <input type="file" id="mediaSubVip" hidden accept="image/*,video/*" multiple onChange={handleGalleryMediaAdd} />
                        </div>
                    </div>
                    <div className="p-6 bg-[#0c0f14] border-t border-white/5">
                        <button className="w-full py-4 bg-[#FFD700] text-black font-black rounded-2xl uppercase shadow-lg shadow-[#FFD700]/10" onClick={() => setIsVipDoorModalOpen(false)}>Concluir Design</button>
                    </div>
                </div>
            )}

            <PixelSettingsModal 
                isOpen={isPixelModalOpen}
                onClose={() => setIsPixelModalOpen(false)}
                initialData={form.pixelConfig}
                initialPlatform={selectedPlatform}
                onSave={form.updatePlatformPixel}
            />

            <ProviderSelectorModal 
                isOpen={isProviderModalOpen}
                onClose={() => setIsProviderModalOpen(false)}
                selectedProviderId={form.selectedProviderId}
                onSelect={(pid) => form.setSelectedProviderId(pid)}
            />
        </div>
    );
};
