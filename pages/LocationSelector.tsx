
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreciseLocation } from '../hooks/usePreciseLocation';
import { RadiusSelector } from '../features/location/components/RadiusSelector';
import { LocationFilter } from '../types/location.types';

type PlacementType = 'feed' | 'reels' | 'marketplace';
type DiscoveryMode = 'territory' | 'custom_radius';

export const LocationSelector: React.FC = () => {
  const navigate = useNavigate();
  const { currentFilter, loading, captureGps, updateFilter, clearFilter } = usePreciseLocation();
  const [activePlacement, setActivePlacement] = useState<PlacementType>('feed');
  const [mode, setMode] = useState<DiscoveryMode>('territory');

  const handleCaptureGps = async () => {
      try {
          await captureGps();
          setMode('territory');
      } catch (e) {
          alert("Não foi possível acessar seu GPS. Verifique as permissões do seu navegador.");
      }
  };

  const handleLevelChange = (type: LocationFilter['type']) => {
      updateFilter({ ...currentFilter, type });
  };

  const handleRadiusChange = (radius: number) => {
      updateFilter({ ...currentFilter, type: 'radius', radius });
  };

  const handleApplyFilter = () => {
    if (currentFilter.coords && currentFilter.targetAddress) {
        let displayLabel = 'Global';
        const addr = currentFilter.targetAddress;

        if (currentFilter.type === 'city') displayLabel = addr.city || 'Minha Cidade';
        else if (currentFilter.type === 'state') displayLabel = addr.state || 'Meu Estado';
        else if (currentFilter.type === 'country') displayLabel = addr.country || 'Meu País';
        else if (currentFilter.type === 'radius') displayLabel = `${currentFilter.radius}km de você`;
        
        localStorage.setItem('feed_location_filter', displayLabel);
    }
    
    switch (activePlacement) {
        case 'reels': navigate('/reels'); break;
        case 'marketplace': navigate('/marketplace'); break;
        default: navigate('/feed');
    }
  };

  const placements = [
      { id: 'feed', label: 'Feed', icon: 'fa-newspaper', desc: 'Posts e enquetes' },
      { id: 'reels', label: 'Reels', icon: 'fa-clapperboard', desc: 'Vídeos curtos' },
      { id: 'marketplace', label: 'Mercado', icon: 'fa-cart-shopping', desc: 'Ofertas e vendas' }
  ];

  const hasAddress = !!currentFilter.targetAddress;
  const addr = currentFilter.targetAddress;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <style>{`
        .placement-card-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 18px;
            padding: 14px 18px;
            display: flex;
            align-items: center;
            gap: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .placement-card-item.active {
            background: rgba(0, 194, 255, 0.08);
            border-color: #00c2ff;
        }
        .p-icon-box {
            width: 44px; height: 44px; border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            display: flex; align-items: center; justify-content: center;
            color: #555; font-size: 18px;
        }
        .active .p-icon-box { background: #00c2ff; color: #000; }

        .territory-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .territory-btn {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 18px 20px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .territory-btn.active {
            background: rgba(0, 194, 255, 0.1);
            border-color: #00c2ff;
            box-shadow: 0 0 20px rgba(0, 194, 255, 0.1);
        }
        .t-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #555; letter-spacing: 2px; margin-bottom: 2px; }
        .t-name { font-size: 16px; font-weight: 800; color: #fff; }
        .territory-btn.active .t-label { color: #00c2ff; }

        .radius-toggle-btn {
            width: 100%; padding: 14px; background: rgba(255,255,255,0.02);
            border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px;
            color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase;
            letter-spacing: 1px; margin-top: 10px; cursor: pointer; transition: 0.3s;
        }
        .radius-toggle-btn:hover { border-color: #00c2ff; color: #fff; }
        .radius-toggle-btn.active { background: #00c2ff1a; border: 1px solid #00c2ff; color: #00c2ff; }
      `}</style>

      <header className="flex items-center p-[16px_32px] bg-[#0c0f14] fixed w-full z-10 border-b border-white/10 top-0 h-[65px]">
        <button onClick={() => navigate('/feed')} className="text-white text-[22px] pr-[15px]">
            <i className="fa-solid fa-xmark"></i>
        </button>
        <h1 className="text-[18px] font-bold text-[#00c2ff] uppercase tracking-tighter">Explorar Mapa Flux</h1>
      </header>

      <main className="pt-[90px] pb-10 w-full max-w-[500px] mx-auto px-5 flex flex-col gap-6">
        
        {/* Card de GPS / Localização Atual */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center relative overflow-hidden group">
            {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff] mb-3"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">Localizando...</span>
                </div>
            )}
            
            {!hasAddress ? (
                <div className="py-4">
                    <div className="w-20 h-20 bg-[#00c2ff1a] rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-[#00c2ff33]">
                        <i className="fa-solid fa-satellite text-3xl text-[#00c2ff]"></i>
                    </div>
                    <h2 className="text-lg font-bold mb-2">GPS Desconectado</h2>
                    <p className="text-xs text-gray-500 px-10 leading-relaxed mb-8">
                        Ative o sinal para ver conteúdos reais baseados no seu território atual.
                    </p>
                    <button 
                        onClick={handleCaptureGps}
                        className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all"
                    >
                        Ativar Localização
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in flex flex-col gap-6">
                    <div className="text-left mb-2">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[3px] ml-1">Alcance por Território</h3>
                    </div>

                    {mode === 'territory' ? (
                        <div className="territory-grid">
                            <div 
                                className={`territory-btn ${currentFilter.type === 'city' ? 'active' : ''}`}
                                onClick={() => handleLevelChange('city')}
                            >
                                <div className="text-left">
                                    <div className="t-label">Local</div>
                                    <div className="t-name">{addr?.city || 'Sua Cidade'}</div>
                                </div>
                                <i className="fa-solid fa-city text-gray-600"></i>
                            </div>

                            <div 
                                className={`territory-btn ${currentFilter.type === 'state' ? 'active' : ''}`}
                                onClick={() => handleLevelChange('state')}
                            >
                                <div className="text-left">
                                    <div className="t-label">Regional</div>
                                    <div className="t-name">{addr?.state || 'Seu Estado'}</div>
                                </div>
                                <i className="fa-solid fa-map text-gray-600"></i>
                            </div>

                            <div 
                                className={`territory-btn ${currentFilter.type === 'country' ? 'active' : ''}`}
                                onClick={() => handleLevelChange('country')}
                            >
                                <div className="text-left">
                                    <div className="t-label">Nacional</div>
                                    <div className="t-name">{addr?.country || 'Seu País'}</div>
                                </div>
                                <i className="fa-solid fa-flag text-gray-600"></i>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <RadiusSelector 
                                value={currentFilter.radius || 50} 
                                onChange={handleRadiusChange} 
                            />
                        </div>
                    )}

                    <button 
                        className={`radius-toggle-btn ${mode === 'custom_radius' ? 'active' : ''}`}
                        onClick={() => setMode(mode === 'territory' ? 'custom_radius' : 'territory')}
                    >
                        <i className={`fa-solid ${mode === 'territory' ? 'fa-radar' : 'fa-arrow-left'} mr-2`}></i>
                        {mode === 'territory' ? 'Ajustar Raio (KM)' : 'Voltar para Territórios'}
                    </button>
                </div>
            )}
        </div>

        {hasAddress && (
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 animate-fade-in">
                <h3 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-4 ml-1">O que deseja filtrar?</h3>
                <div className="flex flex-col gap-2">
                    {placements.map(p => (
                        <div 
                            key={p.id} 
                            className={`placement-card-item ${activePlacement === p.id ? 'active' : ''}`}
                            onClick={() => setActivePlacement(p.id as PlacementType)}
                        >
                            <div className="p-icon-box">
                                <i className={`fa-solid ${p.icon}`}></i>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">{p.label}</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-medium">{p.desc}</p>
                            </div>
                            {activePlacement === p.id && <i className="fa-solid fa-circle-check text-[#00c2ff]"></i>}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {hasAddress && (
            <button 
                onClick={handleApplyFilter}
                className="w-full py-5 bg-[#00c2ff] text-black font-black rounded-2xl shadow-xl uppercase text-sm tracking-widest active:scale-95 transition-all"
            >
                Confirmar Filtro
            </button>
        )}

        <div className="mt-4 pt-6 border-t border-white/5 space-y-4">
            <button 
                onClick={() => { 
                    clearFilter(); 
                    localStorage.removeItem('feed_location_filter');
                    navigate('/feed'); 
                }}
                className="w-full bg-white/5 text-white border border-white/10 p-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all hover:bg-red-500/10 hover:border-red-500/30"
            >
                <i className="fa-solid fa-earth-americas text-[#00c2ff]"></i> 
                Limpar Filtro (Ver Global)
            </button>
            
            <p className="text-center text-[10px] text-gray-700 font-black uppercase tracking-[3px]">
                Flux Territory Intelligence v3.0
            </p>
        </div>
      </main>
    </div>
  );
};
