
import React from 'react';
import { AdCampaign } from '../../types';

interface BudgetSectionProps {
    campaign: Partial<AdCampaign>;
    onInputChange: (field: keyof AdCampaign, value: any) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({ campaign, onInputChange }) => {
    return (
        <div className="form-card">
            <div className="card-header"><i className="fa-solid fa-wallet"></i> Orçamento e Modelo de Cobrança</div>
            <div className="card-body">
                <div className="type-selector">
                    <div className={`type-btn ${campaign.pricingModel === 'budget' ? 'active' : ''}`} onClick={() => onInputChange('pricingModel', 'budget')}>
                        <i className="fa-solid fa-calendar-day"></i>
                        <span>Orçamento Diário</span>
                    </div>
                    <div className={`type-btn ${campaign.pricingModel === 'commission' ? 'active' : ''}`} onClick={() => onInputChange('pricingModel', 'commission')}>
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>Orçamento Total</span>
                    </div>
                </div>
                
                <div className="input-group highlight-box animate-fade-in">
                    <label>
                        {campaign.pricingModel === 'budget' ? 'Investimento Diário (R$)' : 'Investimento Total (R$)'}
                    </label>
                    <input 
                        type="number" 
                        className="meta-field" 
                        placeholder="0,00" 
                        value={campaign.budget}
                        onChange={e => onInputChange('budget', e.target.value)}
                    />
                    <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-widest">
                        {campaign.pricingModel === 'budget' 
                        ? '• Cobrança recorrente a cada 24h' 
                        : '• O valor será distribuído durante toda a campanha'}
                    </p>
                </div>
            </div>
        </div>
    );
};
