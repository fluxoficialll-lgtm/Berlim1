import React from 'react';
import { NotificationSettings } from '../../../../types';

interface BusinessSectionProps {
    settings: NotificationSettings;
    onToggle: (key: keyof NotificationSettings) => void;
    disabled?: boolean;
}

export const BusinessSection: React.FC<BusinessSectionProps> = ({ settings, onToggle, disabled }) => {
    return (
        <div className={`mb-6 transition-opacity duration-300 ${disabled ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-3 ml-2">Negócios</h2>
            <div className="section-card">
                <div className="p-4 px-6">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-4">
                            <i className="fa-solid fa-store text-gray-500 text-sm w-5 text-center"></i>
                            <span className="text-sm font-bold text-gray-200">Marketplace e Vendas</span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.marketplace} onChange={() => onToggle('marketplace')} />
                            <span className="slider-switch"></span>
                        </label>
                    </div>
                    <p className="text-[11px] text-gray-600 ml-9">Alertas de vendas, novas perguntas em produtos e ofertas recebidas.</p>
                </div>
            </div>
        </div>
    );
};