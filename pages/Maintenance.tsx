
import React from 'react';

export const Maintenance: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0c0f14] text-white font-['Inter'] p-8 text-center overflow-hidden">
      <style>{`
        .gear-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 40px;
        }
        .gear {
          font-size: 60px;
          color: #00c2ff;
          animation: spin 4s linear infinite;
          opacity: 0.8;
        }
        .gear-small {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 30px;
          color: #00ff82;
          animation: spin-reverse 3s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        
        .pulse-bg {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 194, 255, 0.1) 0%, transparent 70%);
          animation: pulse 2s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 0.6; } 100% { transform: scale(0.8); opacity: 0.3; } }
      `}</style>

      <div className="pulse-bg"></div>

      <div className="gear-container relative z-10">
        <i className="fa-solid fa-gear gear"></i>
        <i className="fa-solid fa-cog gear-small"></i>
      </div>

      <h1 className="text-3xl font-black mb-4 relative z-10 uppercase tracking-tighter">Ajustando as Engrenagens</h1>
      
      <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed relative z-10 mb-10">
        Estamos realizando uma atualização programada no Flux para garantir mais velocidade e segurança para você. Voltaremos em alguns instantes.
      </p>

      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 relative z-10 animate-pulse">
        <div className="w-2 h-2 rounded-full bg-[#00c2ff]"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#00c2ff]">Manutenção Ativa</span>
      </div>

      <div className="absolute bottom-10 opacity-20 text-[9px] font-black uppercase tracking-[5px] w-full text-center">
        Flux Infrastructure v4.3
      </div>
    </div>
  );
};
