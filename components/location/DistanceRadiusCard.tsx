
import React, { useState, useEffect } from 'react';

interface DistanceRadiusCardProps {
    onSelect: (radius: number) => void;
}

export const DistanceRadiusCard: React.FC<DistanceRadiusCardProps> = ({ onSelect }) => {
    const [radius, setRadius] = useState<number>(() => {
        const saved = localStorage.getItem('feed_distance_radius');
        return saved ? parseInt(saved) : 100;
    });

    const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 1;
        if (val > 10000) val = 10000;
        if (val < 1) val = 1;
        setRadius(val);
    };

    const handleApply = () => {
        localStorage.setItem('feed_distance_radius', radius.toString());
        // Simulação do filtro por raio
        localStorage.setItem('feed_location_filter', `Radius:${radius}km`);
        onSelect(radius);
    };

    return (
        <div className="location-card bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl animate-fade-in relative overflow-hidden">
            <style>{`
                .radius-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    outline: none;
                    margin: 20px 0;
                }
                .radius-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: #00c2ff;
                    border: 4px solid #1a1e26;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 15px rgba(0, 194, 255, 0.5);
                    transition: 0.2s;
                }
                .radius-input-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: -10px;
                }
                .radius-manual-input {
                    background: transparent;
                    border: none;
                    font-size: 32px;
                    font-weight: 900;
                    color: #fff;
                    text-align: right;
                    width: 120px;
                    outline: none;
                    text-shadow: 0 0 20px rgba(0, 194, 255, 0.4);
                }
                .radius-manual-input::-webkit-inner-spin-button,
                .radius-manual-input::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .radius-explanation {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 16px;
                    padding: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .radius-step {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #555;
                    font-weight: 800;
                    text-transform: uppercase;
                    margin-top: -10px;
                    padding: 0 5px;
                }
            `}</style>

            <div>
                <h2 className="text-base text-white font-bold flex items-center gap-2">
                    <i className="fa-solid fa-radar text-[#00c2ff]"></i> 
                    Raio de Alcance
                </h2>
                <div className="mt-3 text-[13px] text-gray-400 leading-relaxed space-y-2 font-medium">
                    <p>O aplicativo já identifica automaticamente o seu IP para saber sua localização aproximada.</p>
                    <p>Agora, você também pode controlar até onde as notícias vão chegar até você.</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="radius-input-container">
                    <input 
                        type="number" 
                        value={radius} 
                        onChange={handleRadiusChange}
                        className="radius-manual-input"
                        min="1"
                        max="10000"
                    />
                    <span className="text-sm font-bold text-gray-500 uppercase mt-2">km</span>
                </div>
                
                <input 
                    type="range" 
                    min="1" 
                    max="10000" 
                    step="1" 
                    value={radius} 
                    onChange={handleRadiusChange}
                    className="radius-slider"
                />
                
                <div className="radius-step">
                    <span>1km</span>
                    <span>5.000km</span>
                    <span>10.000km</span>
                </div>
            </div>

            <div className="radius-explanation">
                <p className="text-[11px] text-[#00c2ff] font-bold uppercase tracking-widest mb-3 text-center">
                    Como funciona o filtro:
                </p>
                <div className="space-y-2 text-[12px] text-gray-300 font-medium">
                    <div className={`flex justify-between items-center p-2 rounded-lg transition-colors ${radius <= 5 ? 'bg-[#00c2ff]/10 text-white' : 'opacity-40'}`}>
                        <span>1 km</span>
                        <span className="text-[10px] uppercase font-black">Muito Próximo</span>
                    </div>
                    <div className={`flex justify-between items-center p-2 rounded-lg transition-colors ${radius > 5 && radius <= 50 ? 'bg-[#00c2ff]/10 text-white' : 'opacity-40'}`}>
                        <span>10 km</span>
                        <span className="text-[10px] uppercase font-black">Sua Região</span>
                    </div>
                    <div className={`flex justify-between items-center p-2 rounded-lg transition-colors ${radius > 50 && radius <= 500 ? 'bg-[#00c2ff]/10 text-white' : 'opacity-40'}`}>
                        <span>100 km</span>
                        <span className="text-[10px] uppercase font-black">Regional Amplo</span>
                    </div>
                    <div className={`flex justify-between items-center p-2 rounded-lg transition-colors ${radius > 500 ? 'bg-[#00c2ff]/10 text-white' : 'opacity-40'}`}>
                        <span>1.000 km+</span>
                        <span className="text-[10px] uppercase font-black">Áreas Distantes</span>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 text-center mt-4 italic">
                    Quanto menor o raio, mais local e específico é o conteúdo.
                </p>
            </div>

            <button 
                onClick={handleApply}
                className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-2xl shadow-xl shadow-[#00c2ff]/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider text-sm"
            >
                Aplicar Raio de Alcance
            </button>
        </div>
    );
};
