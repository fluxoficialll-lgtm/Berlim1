
import React, { useState } from 'react';
import { AddressProfile } from '../../../types/location.types';

interface RegionHierarchySelectorProps {
    onSelect: (addr: AddressProfile) => void;
}

export const RegionHierarchySelector: React.FC<RegionHierarchySelectorProps> = ({ onSelect }) => {
    const [country, setCountry] = useState('Brasil');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');

    const handleConfirm = () => {
        if (!state || !city) return;
        onSelect({
            country,
            state,
            city,
            displayName: `${city}, ${state} - ${country}`
        });
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">País</label>
                <select 
                    value={country} 
                    onChange={e => setCountry(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white outline-none focus:border-[#00c2ff]"
                >
                    <option value="Brasil">Brasil</option>
                    <option value="Portugal">Portugal</option>
                    <option value="EUA">Estados Unidos</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Estado (UF)</label>
                    <input 
                        type="text" 
                        placeholder="Ex: SP"
                        value={state}
                        onChange={e => setState(e.target.value.toUpperCase())}
                        maxLength={2}
                        className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white outline-none focus:border-[#00c2ff] uppercase text-center font-bold"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Município</label>
                    <input 
                        type="text" 
                        placeholder="Ex: São Paulo"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 p-3.5 rounded-xl text-white outline-none focus:border-[#00c2ff]"
                    />
                </div>
            </div>

            <button 
                onClick={handleConfirm}
                disabled={!state || !city}
                className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl uppercase text-[11px] tracking-widest hover:bg-[#00c2ff] hover:text-black transition-all disabled:opacity-30"
            >
                Aplicar Filtro Manual
            </button>
        </div>
    );
};
