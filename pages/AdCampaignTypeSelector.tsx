import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdSelectionHeader } from '../components/ads/selection/AdSelectionHeader';
import { AdSelectionCard } from '../components/ads/selection/AdSelectionCard';
import { AdSelectionInfoBox } from '../components/ads/selection/AdSelectionInfoBox';

export const AdCampaignTypeSelector: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-x-hidden">
            {/* Header seguindo o padrão do app */}
            <AdSelectionHeader 
                onBack={() => navigate('/marketplace')} 
                title="Impulsionar" 
            />

            <main className="flex-1 flex flex-col justify-center max-w-[500px] mx-auto w-full px-6 py-10">
                {/* Título de Introdução */}
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase">
                        Como você quer anunciar?
                    </h2>
                    <p className="text-gray-500 text-sm font-medium px-6">
                        Escolha o ponto de partida para sua nova campanha de escala.
                    </p>
                </div>

                {/* Opções de Seleção */}
                <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <AdSelectionCard 
                        variant="new"
                        icon="fa-wand-magic-sparkles"
                        title="Criar do Zero"
                        description="Monte um novo anúncio usando fotos, vídeos e textos personalizados agora mesmo."
                        onClick={() => navigate('/ad-placement-selector')}
                    />

                    <AdSelectionCard 
                        variant="boost"
                        icon="fa-rocket"
                        title="Impulsionar Existente"
                        description="Aproveite o engajamento de um post ou vídeo que você já publicou no seu perfil."
                        onClick={() => navigate('/ad-content-selector')}
                    />
                </div>

                {/* Box de Informação de Valor */}
                <AdSelectionInfoBox />
                
                {/* Footer de Versão sutil */}
                <div className="mt-12 text-center opacity-10">
                    <div className="text-[8px] uppercase font-black tracking-[6px] mb-2">Flux Ads Network v2.4</div>
                    <div className="w-8 h-0.5 bg-white mx-auto rounded-full"></div>
                </div>
            </main>
        </div>
    );
};