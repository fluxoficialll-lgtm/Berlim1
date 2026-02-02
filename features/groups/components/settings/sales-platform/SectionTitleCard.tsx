
import React from 'react';

interface SectionTitleCardProps {
    title: string;
    onTitleChange: (val: string) => void;
}

export const SectionTitleCard: React.FC<SectionTitleCardProps> = ({ title, onTitleChange }) => {
    return (
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 mb-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff]">
                    <i className="fa-solid fa-heading"></i>
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">Título da Seção</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Exibido acima das pastas</p>
                </div>
            </div>
            <input 
                type="text" 
                className="input-field border-white/10" 
                placeholder="Ex: Pastas de Conteúdo" 
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
            />
        </div>
    );
};
