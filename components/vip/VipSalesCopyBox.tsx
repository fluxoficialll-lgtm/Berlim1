import React from 'react';

interface VipSalesCopyBoxProps {
    text: string;
}

export const VipSalesCopyBox: React.FC<VipSalesCopyBoxProps> = ({ text }) => {
    return (
        <section className="content-section p-4 max-w-[450px] mx-auto">
            <div className="copy-box text-left space-y-4 bg-[#00c2ff0d] border border-[#00c2ff] rounded-[12px] p-5 mt-5 max-h-[400px] overflow-y-auto overflow-x-hidden word-wrap-break-word">
                <p className="text-base text-gray-200 whitespace-pre-wrap leading-relaxed break-words">
                    {text || "Este grupo contém conteúdo exclusivo. Garanta seu acesso agora!"}
                </p>
            </div>
        </section>
    );
};