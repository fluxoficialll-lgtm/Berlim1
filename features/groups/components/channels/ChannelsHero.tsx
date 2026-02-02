
import React from 'react';

interface ChannelsHeroProps {
    groupName: string;
    coverImage?: string;
}

export const ChannelsHero: React.FC<ChannelsHeroProps> = ({ groupName, coverImage }) => {
    return (
        <div className="group-hero-mini animate-fade-in">
            <style>{`
                .group-hero-mini {
                    background: linear-gradient(135deg, rgba(0, 194, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
                    border-radius: 24px;
                    padding: 20px;
                    margin-bottom: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
            `}</style>
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#00c2ff33]">
                {coverImage ? (
                    <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center text-[#00c2ff]">
                        <i className="fa-solid fa-users"></i>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black text-white truncate leading-tight">{groupName}</h1>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Canais da Comunidade</p>
            </div>
        </div>
    );
};
