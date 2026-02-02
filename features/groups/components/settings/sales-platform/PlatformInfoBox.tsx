
import React from 'react';

export const PlatformInfoBox: React.FC = () => {
    return (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
            <div className="flex gap-3">
                <i className="fa-solid fa-triangle-exclamation text-yellow-500 mt-1"></i>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                    Ao ativar o <strong>Modo Hub</strong>, este grupo abandona o formato de chat linear e passa a exibir uma interface organizada em categorias, pastas de conteúdo e canais de interação específicos.
                </p>
            </div>
        </div>
    );
};
