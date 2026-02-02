
import React, { useState, useEffect } from 'react';
import { Infoproduct } from '../../../../types';

interface InfoproductPreviewModalProps {
    items: Infoproduct[];
    initialIndex: number | null;
    onClose: () => void;
}

export const InfoproductPreviewModal: React.FC<InfoproductPreviewModalProps> = ({ items, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [showHUD, setShowHUD] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    useEffect(() => {
        if (initialIndex !== null) {
            setCurrentIndex(initialIndex);
            setShowHUD(true);
        }
    }, [initialIndex]);

    if (currentIndex === null || initialIndex === null || items.length === 0) return null;

    const currentItem = items[currentIndex];

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const toggleHUD = () => {
        setShowHUD(!showHUD);
    };

    // Lógica de Swipe
    const minSwipeDistance = 50;
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) handleNext();
        if (distance < -minSwipeDistance) handlePrev();
    };

    const renderMedia = () => {
        if (currentItem.type === 'image') {
            return (
                <img 
                    src={currentItem.url} 
                    className="max-w-full max-h-full object-contain animate-fade-in pointer-events-none select-none" 
                    alt={currentItem.title} 
                />
            );
        }

        if (currentItem.type === 'video') {
            return (
                <video 
                    key={currentItem.url}
                    src={currentItem.url} 
                    controls={showHUD} 
                    autoPlay 
                    className="max-w-full max-h-full animate-fade-in" 
                    onClick={(e) => e.stopPropagation()}
                />
            );
        }

        return (
            <div 
                className="flex flex-col items-center justify-center p-10 text-center animate-fade-in bg-[#161a21] border border-white/10 rounded-[40px] max-w-[340px] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-20 h-20 rounded-3xl bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff] text-3xl mb-6 border border-[#00c2ff]/20">
                    <i className={`fa-solid ${currentItem.fileType === 'pdf' ? 'fa-file-pdf' : currentItem.fileType === 'zip' ? 'fa-file-zipper' : 'fa-file-lines'}`}></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 truncate max-w-full px-4">{currentItem.title}</h3>
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-[9px] font-black bg-white/5 px-2 py-1 rounded text-gray-400 uppercase tracking-widest border border-white/5">{currentItem.fileType?.toUpperCase()}</span>
                    <span className="text-[9px] font-black text-[#00c2ff] uppercase tracking-widest">{currentItem.size || 'N/A'}</span>
                </div>
                
                <button 
                    onClick={() => window.open(currentItem.url, '_blank')}
                    className="w-full py-4 bg-white text-black font-black rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    ABRIR ARQUIVO
                </button>
            </div>
        );
    };

    return (
        <div 
            className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in transition-all duration-500 ${!showHUD ? 'cursor-none' : ''}`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={toggleHUD}
        >
            <style>{`
                .hud-btn {
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    color: white;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hud-hidden {
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(-15px);
                }
                .hud-hidden-bottom {
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(15px);
                }
                .count-pill {
                    padding: 8px 16px;
                    border-radius: 14px;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    color: rgba(255,255,255,0.9);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .close-pill {
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                .close-pill:active { transform: scale(0.9); background: rgba(255,255,255,0.2); }
                
                .nav-arrow-slim {
                    font-size: 32px;
                    color: rgba(255, 255, 255, 0.2);
                    padding: 30px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .nav-arrow-slim:hover { color: white; }
                .nav-arrow-slim.disabled { opacity: 0; pointer-events: none; }
            `}</style>

            {/* Elementos Superiores Flutuantes */}
            <div className={`absolute top-0 left-0 w-full p-6 flex items-start justify-between z-50 pointer-events-none transition-all duration-500 ${!showHUD ? 'hud-hidden' : ''}`}>
                
                {/* Info do Arquivo (Esquerda) */}
                <div className="flex flex-col gap-1 pointer-events-auto">
                    <div className="hud-btn bg-black/40 px-4 py-2 rounded-xl border border-white/5 inline-flex items-center gap-2 max-w-[200px]">
                        <i className="fa-solid fa-file-lines text-[10px] text-gray-500"></i>
                        <span className="text-[11px] font-bold truncate">{currentItem.title}</span>
                    </div>
                </div>

                {/* Card de Contagem Centralizado */}
                <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
                    <div className="hud-btn count-pill">
                        <span className="opacity-40">{currentIndex + 1}</span>
                        <div className="w-px h-3 bg-white/10"></div>
                        <span>{items.length}</span>
                    </div>
                </div>

                {/* Botão Fechar (Direita) */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }} 
                    className="hud-btn close-pill pointer-events-auto shadow-2xl"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* Área Central de Navegação */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
                
                <button 
                    onClick={handlePrev}
                    className={`absolute left-0 z-20 hidden md:block nav-arrow-slim ${currentIndex === 0 ? 'disabled' : ''} ${!showHUD ? 'opacity-0' : ''}`}
                >
                    <i className="fa-solid fa-angle-left"></i>
                </button>

                {renderMedia()}

                <button 
                    onClick={handleNext}
                    className={`absolute right-0 z-20 hidden md:block nav-arrow-slim ${currentIndex === items.length - 1 ? 'disabled' : ''} ${!showHUD ? 'opacity-0' : ''}`}
                >
                    <i className="fa-solid fa-angle-right"></i>
                </button>
            </div>

            {/* Rodapé HUD (Ações) */}
            {currentItem.type !== 'file' && (
                <footer className={`absolute bottom-0 left-0 w-full p-8 flex items-center justify-center z-50 transition-all duration-500 ${!showHUD ? 'hud-hidden-bottom' : ''}`}>
                    <div className="hud-btn flex items-center gap-2 p-1 rounded-2xl">
                        <button 
                            className="px-6 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); window.open(currentItem.url, '_blank'); }}
                        >
                            <i className="fa-solid fa-cloud-arrow-down text-sm"></i>
                            <span className="text-[10px] font-black uppercase tracking-wider">Download</span>
                        </button>
                        
                        <div className="w-px h-6 bg-white/10"></div>
                        
                        <button 
                            className="px-6 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(currentItem.url);
                                alert("Link copiado.");
                            }}
                        >
                            <i className="fa-solid fa-link text-sm"></i>
                            <span className="text-[10px] font-black uppercase tracking-wider">Copiar Link</span>
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
};
