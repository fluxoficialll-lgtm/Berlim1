import React from 'react';

export const AdSelectionInfoBox: React.FC = () => {
    return (
        <div className="mt-12 p-6 bg-gradient-to-br from-[#00c2ff0a] to-transparent border border-[#00c2ff1a] rounded-[32px] text-center animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent opacity-30"></div>
            
            <div className="w-11 h-11 bg-[#00c2ff1a] rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#00c2ff22]">
                <i className="fa-solid fa-chart-line text-[#00c2ff] text-lg"></i>
            </div>
            
            <p className="text-[13px] text-gray-400 leading-relaxed font-medium px-4">
                Anunciar no <span className="text-white font-black">Flux Ads</span> aumenta sua visibilidade em até <span className="text-[#00c2ff] font-black">10x</span>, direcionando clientes qualificados para seus produtos.
            </p>
        </div>
    );
};