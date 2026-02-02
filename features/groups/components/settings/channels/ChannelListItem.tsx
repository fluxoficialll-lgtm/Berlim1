
import React from 'react';
import { Channel } from '../../../../types';

interface ChannelListItemProps {
    channel: Channel;
    onDelete: (id: string) => void;
    onOptions: (channel: Channel) => void;
    isDefault?: boolean;
}

export const ChannelListItem: React.FC<ChannelListItemProps> = ({ 
    channel, 
    onDelete, 
    onOptions,
    isDefault = false 
}) => {
    const baseClasses = "flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group animate-fade-in";
    const normalClasses = "bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-white/10";
    const defaultClasses = "bg-black/20 border border-dashed border-white/10 opacity-60";

    return (
        <div className={`${baseClasses} ${isDefault ? defaultClasses : normalClasses}`}>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDefault ? 'bg-white/5 text-gray-500' : 'bg-[#00c2ff1a] text-[#00c2ff]'}`}>
                    <i className="fa-solid fa-hashtag text-xs"></i>
                </div>
                <div className="flex flex-col">
                    <span className={`font-bold text-sm ${isDefault ? 'text-gray-400' : 'text-gray-200'}`}>
                        {channel.name} {isDefault && "(Padrão)"}
                    </span>
                    {channel.onlyAdminsPost && (
                        <span className="text-[8px] font-black text-[#ffaa00] uppercase tracking-widest">Apenas Admins</span>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-1">
                <button 
                    onClick={() => onOptions(channel)}
                    className="text-gray-500 hover:text-[#00c2ff] p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                {!isDefault && (
                    <button 
                        onClick={() => onDelete(channel.id)} 
                        className="text-red-400/30 hover:text-red-500 p-2 transition-colors active:scale-90"
                    >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                )}
            </div>
        </div>
    );
};
