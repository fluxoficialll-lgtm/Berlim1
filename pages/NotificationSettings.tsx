
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { NotificationSettings as INotificationSettings } from '../types';
import { useModal } from '../components/ModalSystem';

// Subcomponentes Modulares
import { GlobalPauseCard } from '../features/notifications/components/settings/GlobalPauseCard';
import { SocialSection } from '../features/notifications/components/settings/SocialSection';
import { CommunicationSection } from '../features/notifications/components/settings/CommunicationSection';
import { BusinessSection } from '../features/notifications/components/settings/BusinessSection';
import { EmailPreferencesSection } from '../features/notifications/components/settings/EmailPreferencesSection';

export const NotificationSettings: React.FC = () => {
    const navigate = useNavigate();
    const { showAlert } = useModal();
    
    const defaultSettings: INotificationSettings = {
        pauseAll: false,
        likes: true,
        comments: true,
        followers: true,
        mentions: true,
        messages: true,
        groups: true,
        marketplace: true,
        emailUpdates: true,
        emailDigest: true
    };

    const [settings, setSettings] = useState<INotificationSettings>(defaultSettings);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user && user.notificationSettings) {
            setSettings({ ...defaultSettings, ...user.notificationSettings });
        }
    }, []);

    const toggleSetting = async (key: keyof INotificationSettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        
        // Optimistic UI update
        setSettings(newSettings);
        setIsSyncing(true);

        try {
            await authService.updateNotificationSettings(newSettings);
            // Sincronização silenciosa, só avisamos se houver erro crítico
            setIsSyncing(false);
        } catch (error) {
            setIsSyncing(false);
            // Revert on error
            setSettings(settings);
            showAlert("Erro de Sincronização", "Não foi possível salvar suas preferências na nuvem. Verifique sua conexão.");
        }
    };

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/settings');
        }
    };

    return (
        <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-50 border-b border-white/10 h-[65px]">
                <button onClick={handleBack} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold">Notificações</h1>
                    {isSyncing && (
                        <span className="text-[9px] text-[#00c2ff] font-black uppercase tracking-widest animate-pulse">
                            Sincronizando...
                        </span>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pt-[85px] pb-10 px-5 max-w-[600px] mx-auto w-full no-scrollbar">
                
                <GlobalPauseCard 
                    enabled={settings.pauseAll} 
                    onToggle={() => toggleSetting('pauseAll')} 
                />

                <div className="space-y-2 mt-6">
                    <SocialSection 
                        settings={settings} 
                        onToggle={toggleSetting} 
                        disabled={settings.pauseAll} 
                    />

                    <CommunicationSection 
                        settings={settings} 
                        onToggle={toggleSetting} 
                        disabled={settings.pauseAll} 
                    />

                    <BusinessSection 
                        settings={settings} 
                        onToggle={toggleSetting} 
                        disabled={settings.pauseAll} 
                    />

                    <EmailPreferencesSection 
                        settings={settings} 
                        onToggle={toggleSetting} 
                    />
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-dashed border-white/10 opacity-40 mb-10">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-relaxed text-center">
                        <i className="fa-solid fa-shield-halved mr-1"></i> Notificações críticas de segurança e transações financeiras não podem ser desativadas.
                    </p>
                </div>
            </main>
        </div>
    );
};
