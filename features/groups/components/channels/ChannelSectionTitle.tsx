
import React from 'react';

interface ChannelSectionTitleProps {
    title: string;
}

export const ChannelSectionTitle: React.FC<ChannelSectionTitleProps> = ({ title }) => {
    return (
        <div className="flex flex-col gap-1 mb-6 px-2 mt-8 first:mt-2 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="h-4 w-1 bg-[#00c2ff] rounded-full shadow-[0_0_10px_#00c2ff]"></div>
                <h3 className="text-sm font-black text-white uppercase tracking-[3px]">{title}</h3>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent mt-2"></div>
        </div>
    );
};
