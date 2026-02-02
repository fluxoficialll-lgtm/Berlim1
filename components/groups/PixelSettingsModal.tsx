import React, { useState, useEffect } from 'react';

interface PixelSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (platform: string, data: { pixelId: string, pixelToken: string }) => void;
    initialData: {
        metaId?: string;
        metaToken?: string;
        tiktokId?: string;
        tiktokToken?: string;
        googleId?: string;
        xId?: string;
    };
    initialPlatform?: string;
}

type ModalStep = 'selection' | 'form';

export const PixelSettingsModal: React.FC<PixelSettingsModalProps> = ({ 
    isOpen, onClose, onSave, initialData, initialPlatform 
}) => {
    const [step, setStep] = useState<ModalStep>('selection');
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [pixelId, setPixelId] = useState('');
    const [pixelToken, setPixelToken] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialPlatform) {
                handleSelectPlatform(initialPlatform);
            } else {
                setStep('selection');
                setSelectedPlatform(null);
            }
        }
    }, [isOpen, initialPlatform]);

    const handleSelectPlatform = (pid: string) => {
        setSelectedPlatform(pid);
        setStep('form');
        
        // Carrega dados existentes da plataforma específica
        if (pid === 'meta') {
            setPixelId(initialData.metaId || '');
            setPixelToken(initialData.metaToken || '');
        } else if (pid === 'tiktok') {
            setPixelId(initialData.tiktokId || '');
            setPixelToken(initialData.tiktokToken || '');
        } else if (pid === 'google') {
            setPixelId(initialData.googleId || '');
            setPixelToken('');
        } else if (pid === 'x') {
            setPixelId(initialData.xId || '');
            setPixelToken('');
        }
    };

    const handleSave = () => {
        if (selectedPlatform) {
            onSave(selectedPlatform, { pixelId, pixelToken });
            onClose(); // Sempre fecha ao salvar no modo edição/adição
        }
    };

    if (!isOpen) return null;

    const platformInfo: Record<string, any> = {
        'meta': { name: 'Meta (Facebook)', icon: 'fa-brands fa-facebook', color: '#1877F2', hasToken: true },
        'tiktok': { name: 'TikTok Ads', icon: 'fa-brands fa-tiktok', color: '#00f2ea', hasToken: true },
        'google': { name: 'Google Ads', icon: 'fa-brands fa-google', color: '#4285F4', hasToken: false },
        'x': { name: 'X / Twitter', icon: 'fa-brands fa-x-twitter', color: '#fff', hasToken: false },
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <style>{`
                .pixel-modal-card {
                    width: 100%;
                    max-width: 380px;
                    background: #1a1e26;
                    border: 1px solid rgba(0, 194, 255, 0.2);
                    border-radius: 32px;
                    padding: 32px 24px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                    animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .p-opt-btn {
                    width: 100%;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    transition: 0.2s;
                    margin-bottom: 10px;
                    text-align: left;
                }
                .p-opt-btn:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(0, 194, 255, 0.3);
                }
                .p-opt-btn i {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                    font-size: 18px;
                }
                .input-field {
                    width: 100%;
                    background: #0c0f14;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 14px 16px;
                    border-radius: 12px;
                    color: #fff;
                    outline: none;
                    font-size: 15px;
                }
                .input-field:focus {
                    border-color: #00c2ff;
                }
            `}</style>

            <div className="pixel-modal-card" onClick={e => e.stopPropagation()}>
                {step === 'selection' ? (
                    <>
                        <h2 className="text-xl font-black text-white mb-6 text-center uppercase tracking-tight">Hub de Marketing</h2>
                        <div className="space-y-1">
                            {Object.entries(platformInfo).map(([id, info]) => (
                                <button key={id} className="p-opt-btn" onClick={() => handleSelectPlatform(id)}>
                                    <i className={info.icon} style={{ color: info.color }}></i>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white">{info.name}</div>
                                        <div className="text-[10px] text-gray-600 uppercase font-black">Pixel & CAPI</div>
                                    </div>
                                    <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
                                </button>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-white" onClick={onClose}>Cancelar</button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => setStep('selection')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><i className="fa-solid fa-arrow-left"></i></button>
                            <div>
                                <h2 className="text-lg font-bold text-white">{platformInfo[selectedPlatform!].name}</h2>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Configuração de Pixel</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="input-group mb-0">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Pixel ID / Measurement ID</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Ex: 123456789..." 
                                    value={pixelId}
                                    onChange={e => setPixelId(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            {platformInfo[selectedPlatform!].hasToken && (
                                <div className="input-group mb-0">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Token de Acesso (API / CAPI)</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="Cole o token aqui..." 
                                        value={pixelToken}
                                        onChange={e => setPixelToken(e.target.value)}
                                    />
                                    <p className="text-[9px] text-gray-600 mt-2">Necessário para rastreamento server-side à prova de bloqueadores.</p>
                                </div>
                            )}

                            <button 
                                className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-2xl uppercase text-xs shadow-lg shadow-[#00c2ff]/20 active:scale-95 transition-all"
                                onClick={handleSave}
                            >
                                Salvar Configuração
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
