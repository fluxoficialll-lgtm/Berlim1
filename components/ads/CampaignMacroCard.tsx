
import React from 'react';

interface CampaignMacroCardProps {
    name: string;
    onNameChange: (val: string) => void;
}

export const CampaignMacroCard: React.FC<CampaignMacroCardProps> = ({ name, onNameChange }) => {
    return (
        <div className="form-card">
            <div className="card-header"><i className="fa-solid fa-bullhorn"></i> Detalhes Macro</div>
            <div className="card-body">
                <div className="input-group">
                    <label>Nome da Campanha</label>
                    <input 
                        type="text" 
                        className="meta-field" 
                        placeholder="Ex: Campanha de Vendas Outono/Inverno" 
                        value={name}
                        onChange={e => onNameChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};
