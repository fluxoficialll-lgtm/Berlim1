
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingItem } from './SettingItem';
import { authService } from '../../services/authService';
import { LANGUAGES } from '../../pages/LanguageSettings';

export const GeneralGroup: React.FC = () => {
    const navigate = useNavigate();
    
    const user = authService.getCurrentUser();
    const currentLangId = user?.language || localStorage.getItem('app_language') || 'pt';
    const currentLangLabel = LANGUAGES.find(l => l.id === currentLangId)?.label || 'Português';

    return (
        <div className="settings-group">
            <h2>Geral</h2>
            <SettingItem 
                icon="fa-bell" 
                label="Configurações de Notificação" 
                onClick={() => navigate('/notification-settings')} 
            />
            <SettingItem 
                icon="fa-language" 
                label="Idioma" 
                onClick={() => navigate('/settings/language')} 
                rightElement={
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">{currentLangLabel}</span>
                        <i className="fas fa-chevron-right text-gray-600 text-xs"></i>
                    </div>
                }
            />
            <SettingItem 
                icon="fa-file-alt" 
                label="Termos e Privacidade" 
                onClick={() => navigate('/terms')} 
            />
            <SettingItem 
                icon="fa-headset" 
                label="Ajuda e Suporte" 
                onClick={() => navigate('/help')} 
            />
        </div>
    );
};
