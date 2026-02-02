import React from 'react';
import { NotificationSettings } from '../../../../types';

interface EmailPreferencesSectionProps {
    settings: NotificationSettings;
    onToggle: (key: keyof NotificationSettings) => void;
}

export const EmailPreferencesSection: React.FC<EmailPreferencesSectionProps> = ({ settings, onToggle }) => {
    return (
        <div className="mb-10">
            <h2 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-3 ml-2">Preferências de E-mail</h2>
            <div className="section-card">
                <div className="p-4 px-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-4">
                            <i className="fa-solid fa-envelope-open-text text-gray-500 text-sm w-5 text-center"></i>
                            <span className="text-sm font-bold text-gray-200">Novidades e Dicas</span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.emailUpdates} onChange={() => onToggle('emailUpdates')} />
                            <span className="slider-switch"></span>
                        </label>
                    </div>
                    <p className="text-[11px] text-gray-600 ml-9">Notícias importantes sobre o Flux e dicas exclusivas de uso.</p>
                </div>
                <div className="p-4 px-6">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-4">
                            <i className="fa-solid fa-list-check text-gray-500 text-sm w-5 text-center"></i>
                            <span className="text-sm font-bold text-gray-200">Resumo de Atividades</span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.emailDigest} onChange={() => onToggle('emailDigest')} />
                            <span className="slider-switch"></span>
                        </label>
                    </div>
                    <p className="text-[11px] text-gray-600 ml-9">Um resumo semanal com o que você perdeu enquanto estava offline.</p>
                </div>
            </div>
        </div>
    );
};