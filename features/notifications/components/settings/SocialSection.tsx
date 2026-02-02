import React from 'react';
import { NotificationSettings } from '../../../../types';

interface SocialSectionProps {
    settings: NotificationSettings;
    onToggle: (key: keyof NotificationSettings) => void;
    disabled?: boolean;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ settings, onToggle, disabled }) => {
    const items = [
        { key: 'likes', label: 'Curtidas', icon: 'fa-heart' },
        { key: 'comments', label: 'Comentários', icon: 'fa-comment' },
        { key: 'followers', label: 'Novos Seguidores', icon: 'fa-user-plus' },
        { key: 'mentions', label: 'Menções (@)', icon: 'fa-at' },
    ];

    return (
        <div className={`mb-6 transition-opacity duration-300 ${disabled ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-3 ml-2">Social e Feed</h2>
            <div className="section-card">
                {items.map((item, idx) => (
                    <div key={item.key} className={`flex items-center justify-between p-4 px-6 ${idx !== items.length - 1 ? 'border-b border-white/5' : ''}`}>
                        <div className="flex items-center gap-4">
                            <i className={`fa-solid ${item.icon} text-gray-500 text-sm w-5 text-center`}></i>
                            <span className="text-sm font-bold text-gray-200">{item.label}</span>
                        </div>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={settings[item.key as keyof NotificationSettings] as boolean} 
                                onChange={() => onToggle(item.key as keyof NotificationSettings)} 
                            />
                            <span className="slider-switch"></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};