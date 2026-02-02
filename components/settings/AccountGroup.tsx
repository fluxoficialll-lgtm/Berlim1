
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingItem } from './SettingItem';

export const AccountGroup: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="settings-group">
            <h2>Conta</h2>
            <SettingItem 
                icon="fa-user-edit" 
                label="Editar Perfil" 
                onClick={() => navigate('/edit-profile')} 
            />
            <SettingItem 
                icon="fa-wallet" 
                label="Resgatar Saldo (Financeiro)" 
                onClick={() => navigate('/financial')} 
            />
        </div>
    );
};
