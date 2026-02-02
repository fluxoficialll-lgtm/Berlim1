import React from 'react';

interface RadiusSelectorProps {
    value: number;
    onChange: (val: number) => void;
}

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({ value, onChange }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        // Limita o valor entre 1 e 500 para manter a consistência do mapa
        if (val > 500) val = 500;
        onChange(val);
    };

    const handleBlur = () => {
        if (value < 1) onChange(1);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fade-in">
            <style>{`
                .radius-input-manual {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(0, 194, 255, 0.2);
                    color: #fff;
                    font-size: 20px;
                    font-weight: 900;
                    width: 80px;
                    text-align: center;
                    padding: 4px;
                    border-radius: 8px;
                    outline: none;
                    transition: all 0.3s;
                }
                .radius-input-manual:focus {
                    border-color: #00c2ff;
                    box-shadow: 0 0 15px rgba(0, 194, 255, 0.2);
                }
                /* Remove setas do input number */
                .radius-input-manual::-webkit-inner-spin-button,
                .radius-input-manual::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>

            <div className="flex justify-between items-center mb-6">
                <div className="text-left">
                    <h3 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px]">Raio de Alcance</h3>
                    <p className="text-[9px] text-gray-600 font-bold uppercase">Ajuste o zoom do feed</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <input 
                        type="number"
                        className="radius-input-manual"
                        value={value}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        min="1"
                        max="500"
                    />
                    <span className="text-xs font-black text-gray-500 uppercase">KM</span>
                </div>
            </div>
            
            <input 
                type="range" 
                min="1" 
                max="500" 
                value={value} 
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00c2ff]"
            />
            
            <div className="flex justify-between mt-3 text-[8px] font-black text-gray-700 uppercase tracking-widest">
                <span>Local (1km)</span>
                <span>Regional (500km)</span>
            </div>

            <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[11px] text-gray-400 leading-relaxed italic text-center">
                    <i className="fa-solid fa-circle-info text-[#00c2ff] mr-1 opacity-50"></i>
                    Conteúdos criados dentro de <strong className="text-white">{value}km</strong> aparecerão prioritariamente no seu feed.
                </p>
            </div>
        </div>
    );
};