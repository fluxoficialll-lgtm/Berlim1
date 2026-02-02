
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../../../../types';

interface PlatformHeroProps {
    group: Group;
}

export const PlatformHero: React.FC<PlatformHeroProps> = ({ group }) => {
    const navigate = useNavigate();

    return (
        <div className="platform-hero">
            <img src={group.coverImage || 'https://via.placeholder.com/1000'} className="hero-bg" alt="Cover" />
            <div className="hero-gradient"></div>
            
            <button onClick={() => navigate('/groups')} className="absolute top-5 left-5 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10 z-50">
                <i className="fa-solid fa-arrow-left"></i>
            </button>

            <div className="hero-content">
                <span className="bg-[#00c2ff] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 inline-block">Plataforma de Vendas</span>
                <h1 className="text-3xl font-black text-white leading-tight">{group.name}</h1>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{group.description}</p>
            </div>
        </div>
    );
};
