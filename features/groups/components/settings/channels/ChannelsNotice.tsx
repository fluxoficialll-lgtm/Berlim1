
import React from 'react';

export const ChannelsNotice: React.FC = () => {
    return (
        <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl mb-8 animate-fade-in">
            <div className="flex gap-4">
                <i className="fa-solid fa-circle-info text-blue-400 mt-1"></i>
                <p className="text-xs text-gray-300 leading-relaxed">
                    Canais de Avisos permitem que apenas administradores enviem mensagens, mantendo a ordem da comunidade.
                </p>
            </div>
        </div>
    );
};
