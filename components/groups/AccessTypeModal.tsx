
import React, { useState, useEffect } from 'react';

type AccessType = 'lifetime' | 'temporary' | 'one_time';

interface AccessTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentType: AccessType;
    onSelect: (type: AccessType, config?: any) => void;
}

export const AccessTypeModal: React.FC<AccessTypeModalProps> = ({ isOpen, onClose, currentType, onSelect }) => {
    const [step, setStep] = useState<'selection' | 'config_periodic' | 'config_one_time'>('selection');
    const [selectedType, setSelectedType] = useState<AccessType>(currentType);

    // Periodic Config
    const [billingInterval, setBillingInterval] = useState('30');
    const [maxBillings, setMaxBillings] = useState(2); // Fixo em 2 conforme solicitado

    // One Time Config
    const [durationDays, setDurationDays] = useState('1');
    const [durationHours, setDurationHours] = useState('0');

    useEffect(() => {
        if (isOpen) {
            setStep('selection');
            setSelectedType(currentType);
        }
    }, [isOpen, currentType]);

    if (!isOpen) return null;

    const handleTypeClick = (type: AccessType) => {
        setSelectedType(type);
        if (type === 'temporary') setStep('config_periodic');
        else if (type === 'one_time') setStep('config_one_time');
        else {
            onSelect('lifetime');
            onClose();
        }
    };

    const handleSavePeriodic = () => {
        onSelect('temporary', {
            interval: billingInterval,
            maxCycles: 2
        });
        onClose();
    };

    const handleSaveOneTime = () => {
        onSelect('one_time', {
            days: durationDays,
            hours: durationHours
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <style>{`
                .access-modal-card {
                    width: 100%;
                    max-width: 380px;
                    background: #1a1e26;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 28px;
                    padding: 24px;
                    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
                    animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .access-option {
                    width: 100%;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px solid transparent;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    transition: 0.2s;
                    margin-bottom: 12px;
                    text-align: left;
                }
                .access-option:hover { background: rgba(255, 255, 255, 0.06); }
                .access-option.active { border-color: #00c2ff; background: rgba(0, 194, 255, 0.05); }
                
                .config-view { animation: fadeIn 0.3s ease; }
                .config-label { font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; display: block; }
                
                .interval-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
                .interval-btn { padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; text-align: center; }
                .interval-btn.active { border-color: #00c2ff; background: rgba(0,194,255,0.1); color: #00c2ff; }

                .duration-inputs { display: flex; gap: 15px; margin-bottom: 20px; }
                .duration-field { flex: 1; }
                .duration-field input { width: 100%; background: #0c0f14; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 12px; text-align: center; font-weight: 800; font-size: 18px; outline: none; }
                .duration-field input:focus { border-color: #00c2ff; }
                .duration-field span { display: block; text-align: center; font-size: 10px; color: #666; font-weight: 700; margin-top: 6px; text-transform: uppercase; }

                .action-btn-main { width: 100%; padding: 16px; background: #00c2ff; color: #000; border-radius: 16px; font-weight: 800; border: none; cursor: pointer; margin-top: 10px; transition: 0.2s; }
                .action-btn-main:active { transform: scale(0.98); }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            
            <div className="access-modal-card" onClick={e => e.stopPropagation()}>
                {step === 'selection' && (
                    <>
                        <h2 className="text-xl font-bold text-center mb-6 text-white">Tipo de Acesso</h2>
                        <div className="space-y-1">
                            <button className={`access-option ${selectedType === 'lifetime' ? 'active' : ''}`} onClick={() => handleTypeClick('lifetime')}>
                                <div className="w-10 h-10 rounded-xl bg-[#FFD700]1a flex items-center justify-center text-[#FFD700] text-xl"><i className="fa-solid fa-infinity"></i></div>
                                <div><h4 className="font-bold text-white">Vitalício</h4><p className="text-[11px] text-gray-500">Acesso permanente sem renovação.</p></div>
                            </button>
                            <button className={`access-option ${selectedType === 'temporary' ? 'active' : ''}`} onClick={() => handleTypeClick('temporary')}>
                                <div className="w-10 h-10 rounded-xl bg-[#00c2ff]1a flex items-center justify-center text-[#00c2ff] text-xl"><i className="fa-solid fa-calendar-days"></i></div>
                                <div><h4 className="font-bold text-white">Periódico</h4><p className="text-[11px] text-gray-500">Assinatura com cobranças recorrentes.</p></div>
                            </button>
                            <button className={`access-option ${selectedType === 'one_time' ? 'active' : ''}`} onClick={() => handleTypeClick('one_time')}>
                                <div className="w-10 h-10 rounded-xl bg-[#00ff82]1a flex items-center justify-center text-[#00ff82] text-xl"><i className="fa-solid fa-ticket"></i></div>
                                <div><h4 className="font-bold text-white">Consumo Único</h4><p className="text-[11px] text-gray-500">Acesso por tempo limitado.</p></div>
                            </button>
                        </div>
                        <button className="w-full mt-4 py-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors" onClick={onClose}>Cancelar</button>
                    </>
                )}

                {step === 'config_periodic' && (
                    <div className="config-view">
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={() => setStep('selection')} className="text-gray-400"><i className="fa-solid fa-arrow-left"></i></button>
                            <h2 className="text-lg font-bold text-white">Configurar Periódico</h2>
                        </div>
                        
                        <span className="config-label">Intervalo de Cobrança</span>
                        <div className="interval-grid">
                            <button className={`interval-btn ${billingInterval === '7' ? 'active' : ''}`} onClick={() => setBillingInterval('7')}>7 DIAS</button>
                            <button className={`interval-btn ${billingInterval === '15' ? 'active' : ''}`} onClick={() => setBillingInterval('15')}>15 DIAS</button>
                            <button className={`interval-btn ${billingInterval === '30' ? 'active' : ''}`} onClick={() => setBillingInterval('30')}>30 DIAS</button>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-blue-300 uppercase">Máximo de Cobranças</span>
                                <span className="bg-blue-500 text-black px-2 py-0.5 rounded font-black text-xs">02</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">Limite máximo de renovações automáticas permitido pelo sistema.</p>
                        </div>

                        <button className="action-btn-main" onClick={handleSavePeriodic}>CONFIRMAR</button>
                    </div>
                )}

                {step === 'config_one_time' && (
                    <div className="config-view">
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={() => setStep('selection')} className="text-gray-400"><i className="fa-solid fa-arrow-left"></i></button>
                            <h2 className="text-lg font-bold text-white">Configurar Duração</h2>
                        </div>

                        <span className="config-label">Tempo de Acesso</span>
                        <div className="duration-inputs">
                            <div className="duration-field">
                                <input type="number" min="0" value={durationDays} onChange={e => setDurationDays(e.target.value)} />
                                <span>Dias</span>
                            </div>
                            <div className="duration-field">
                                <input type="number" min="0" max="23" value={durationHours} onChange={e => setDurationHours(e.target.value)} />
                                <span>Horas</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-gray-500 text-center mb-6 px-4">O membro será removido automaticamente do grupo após este período.</p>

                        <button className="action-btn-main" onClick={handleSaveOneTime}>DEFINIR TEMPO</button>
                    </div>
                )}
            </div>
        </div>
    );
};
