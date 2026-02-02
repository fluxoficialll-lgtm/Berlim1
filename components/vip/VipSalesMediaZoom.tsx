
import React, { useState, useEffect, useRef } from 'react';
import { VipMediaItem } from '../../types';

interface VipSalesMediaZoomProps {
    items: VipMediaItem[];
    initialIndex: number | null;
    onClose: () => void;
}

export const VipSalesMediaZoom: React.FC<VipSalesMediaZoomProps> = ({ items, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [showHUD, setShowHUD] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialIndex !== null) {
            setCurrentIndex(initialIndex);
            // Sincroniza o scroll inicial para a mídia clicada
            setTimeout(() => {
                if (containerRef.current) {
                    const slideWidth = containerRef.current.offsetWidth;
                    containerRef.current.scrollTo({
                        left: slideWidth * initialIndex,
                        behavior: 'auto'
                    });
                }
            }, 50);
        }
    }, [initialIndex]);

    if (initialIndex === null || items.length === 0) return null;

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollLeft = containerRef.current.scrollLeft;
            const width = containerRef.current.offsetWidth;
            const index = Math.round(scrollLeft / width);
            if (index !== currentIndex && index >= 0 && index < items.length) {
                setCurrentIndex(index);
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center animate-fade-in transition-all duration-500 overflow-hidden"
            onClick={() => setShowHUD(!showHUD)}
        >
            <style>{`
                .hud-btn-vip {
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    color: white;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: auto;
                }
                .hud-hidden-vip {
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(-15px);
                }
                .close-pill-vip {
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .close-pill-vip:active { transform: scale(0.9); background: rgba(255,255,255,0.2); }
                
                .count-pill-vip {
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
                
                .zoom-container-snap {
                    display: flex;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    width: 100vw;
                    height: 100vh;
                    scrollbar-width: none;
                }
                .zoom-container-snap::-webkit-scrollbar { display: none; }
                
                .zoom-slide {
                    flex-shrink: 0;
                    width: 100vw;
                    height: 100vh;
                    scroll-snap-align: center;
                    scroll-snap-stop: always;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
            `}</style>

            {/* HUD: Superior (Contador e Fechar - Padrão Hub) */}
            <div className={`absolute top-0 left-0 w-full p-6 flex items-start justify-between z-50 pointer-events-none transition-all duration-500 ${!showHUD ? 'hud-hidden-vip' : ''}`}>
                <div className="w-10"></div> {/* Espaçador */}

                {/* Pill de Contagem centralizada */}
                <div className="hud-btn-vip count-pill-vip shadow-2xl">
                    <span className="opacity-40">{(currentIndex ?? 0) + 1}</span>
                    <div className="w-px h-3 bg-white/10"></div>
                    <span>{items.length}</span>
                </div>

                {/* Botão Fechar Sofisticado */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }} 
                    className="hud-btn-vip close-pill-vip"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* Área de Swipe e Snap (Navegação lateral) */}
            <div 
                ref={containerRef}
                onScroll={handleScroll}
                className="zoom-container-snap"
            >
                {items.map((item, idx) => (
                    <div key={idx} className="zoom-slide" onClick={(e) => e.stopPropagation()}>
                        {item.type === 'video' ? (
                            <video 
                                src={item.url} 
                                controls 
                                autoPlay 
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg" 
                            />
                        ) : (
                            <img 
                                src={item.url} 
                                alt="Zoom" 
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Dica de interação inferior */}
            <div className={`absolute bottom-10 text-white/30 text-[9px] font-black uppercase tracking-[3px] transition-opacity duration-500 ${!showHUD ? 'opacity-0' : 'opacity-100'}`}>
                Deslize para navegar
            </div>
        </div>
    );
};
