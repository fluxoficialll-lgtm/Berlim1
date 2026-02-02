
import React from 'react';

export const EmptyChannelsState: React.FC = () => {
    return (
        <div className="text-center py-10 opacity-20 border-2 border-dashed border-white/5 rounded-3xl mt-4">
            <i className="fa-solid fa-hashtag text-4xl mb-2"></i>
            <p className="text-xs font-bold uppercase tracking-widest">Nenhum canal extra ativo</p>
        </div>
    );
};
