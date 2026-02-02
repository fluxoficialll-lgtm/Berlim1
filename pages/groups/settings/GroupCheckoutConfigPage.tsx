import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCheckoutConfig } from '../../../features/groups/hooks/settings/useCheckoutConfig';

// Componentes Modulares
import { CheckoutConfigHeader } from '../../../features/groups/components/settings/checkout/CheckoutConfigHeader';
import { CheckoutStepSelector } from '../../../features/groups/components/settings/checkout/CheckoutStepSelector';
import { CheckoutMethodItem } from '../../../features/groups/components/settings/checkout/CheckoutMethodItem';
import { CheckoutLivePreview } from '../../../features/groups/components/settings/checkout/CheckoutLivePreview';

export const GroupCheckoutConfigPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        group,
        loading,
        provider,
        country,
        availableMethods,
        enabledMethods,
        previewEnabledMethods,
        handleSelectProvider,
        handleSelectCountry,
        toggleMethod,
        handleSave,
        // Comment: Renamed activateAll to activateAllInRegion to match the hook implementation
        activateAllInRegion
    } = useCheckoutConfig(id);

    if (loading || !group) return null;

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col">
            <CheckoutConfigHeader onBack={() => navigate(-1)} />

            <main className="flex-1 overflow-y-auto p-5 pb-32 max-w-[600px] mx-auto w-full no-scrollbar">
                <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl mb-8 animate-fade-in">
                    <p className="text-xs text-blue-300 leading-relaxed italic text-center">
                        "Personalize o checkout conforme a região do seu tráfego. Métodos locais como ACH nos EUA ou UPI na Índia convertem até 40% mais."
                    </p>
                </div>

                <CheckoutStepSelector 
                    provider={provider}
                    country={country}
                    onSelectProvider={handleSelectProvider}
                    onSelectCountry={handleSelectCountry}
                />

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-4">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Métodos da Região</h4>
                        <button 
                            // Comment: Calling activateAllInRegion instead of undefined activateAll
                            onClick={activateAllInRegion}
                            className="text-[9px] font-black text-[#00c2ff] uppercase tracking-widest hover:underline"
                        >
                            Ativar Todos
                        </button>
                    </div>
                    <div className="space-y-2.5">
                        {availableMethods.map(m => (
                            <CheckoutMethodItem 
                                key={`${m.id}-${country}`}
                                {...m}
                                isActive={enabledMethods.includes(m.id)}
                                onToggle={toggleMethod}
                            />
                        ))}
                    </div>
                </div>

                <CheckoutLivePreview enabledMethods={previewEnabledMethods} />

                <button className="btn-save-fixed" onClick={handleSave}>
                    Salvar Configurações
                </button>
            </main>
        </div>
    );
};