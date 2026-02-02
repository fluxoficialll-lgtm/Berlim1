
import React from 'react';

export const VisitorBlockedState: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-10 text-center text-gray-500 animate-fade-in mt-10">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <i className="fa-solid fa-user-slash text-4xl opacity-30"></i>
        </div>
        <h2 className="text-white text-lg font-bold mb-2">Perfil Indisponível</h2>
        <p className="text-sm max-w-[250px] leading-relaxed">Você não pode visualizar as informações deste usuário no momento.</p>
    </div>
);

export const VisitorPrivateState: React.FC = () => (
    <div className="flex flex-col items-center p-20 text-gray-500 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <i className="fa-solid fa-lock text-2xl opacity-40"></i>
        </div>
        <h2 className="text-white font-bold text-lg mb-1">Esta conta é privada</h2>
        <p className="text-sm text-center">Siga para ver as publicações e fotos.</p>
    </div>
);
