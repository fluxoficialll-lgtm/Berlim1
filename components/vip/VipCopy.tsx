
import React from 'react';

interface VipCopyProps {
    text: string;
}

export const VipCopy: React.FC<VipCopyProps> = ({ text }) => {
    return (
        <section className="content-section p-4 max-w-[480px] mx-auto mt-4">
            <div className="relative">
                {/* Subtle depth effect */}
                <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-[32px] pointer-events-none"></div>
                
                <div className="relative bg-[#161a21]/40 backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Impartial decorative accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/10 rounded-full mt-3"></div>
                    
                    <p className="text-[17px] text-gray-100 whitespace-pre-wrap leading-[1.7] break-words font-bold tracking-tight text-left">
                        {text || "Este grupo contém conteúdo exclusivo. Garanta seu acesso agora!"}
                    </p>
                    
                    {/* Bottom flare */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#00c2ff]/5 blur-[40px] rounded-full"></div>
                </div>
            </div>
        </section>
    );
};
