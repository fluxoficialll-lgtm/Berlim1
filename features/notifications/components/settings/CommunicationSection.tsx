import React from 'react';
import { NotificationSettings } from '../../../../types';

interface CommunicationSectionProps {
    settings: NotificationSettings;
    onToggle: (key: keyof NotificationSettings) => void;
    disabled?: boolean;
}

export const CommunicationSection: React.FC<CommunicationSectionProps> = ({ settings, onToggle, disabled }) => {
    return (
        <div className={`mb-6 transition-opacity duration-300 ${disabled ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-3 ml-2">Comunicação</h2>
            <div className="section-card">
                <div className="flex items-center justify-between p-4 px-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <i className="fa-solid fa-message text-gray-500 text-sm w-5 text-center"></i>
                        <span className="text-sm font-bold text-gray-200">Mensagens Diretas</span>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={settings.messages} onChange={() => onToggle('messages')} />
                        <span className="slider-switch"></span>
                    </label>
                </div>
                <div className="flex items-center justify-between p-4 px-6">
                    <div className="flex items-center gap-4">
                        <i className="fa-solid fa-users-rectangle text-gray-500 text-sm w-5 text-center"></i>
                        <span className="text-sm font-bold text-gray-200">Grupos e Convites</span>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={settings.groups} onChange={() => onToggle('groups')} />
                        <span className="slider-switch"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};