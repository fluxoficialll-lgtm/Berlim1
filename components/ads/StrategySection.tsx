
import React, { useState } from 'react';
import { AdCampaign } from '../../types';
import { SelectionField } from './SelectionField';
import { AdDurationModal } from './AdDurationModal';

interface StrategySectionProps {
    campaign: Partial<AdCampaign>;
    onInputChange: (field: keyof AdCampaign, value: any) => void;
}

export const StrategySection: React.FC<StrategySectionProps> = ({ campaign, onInputChange }) => {
    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);

    const getDurationLabel = () => {
        if (campaign.scheduleType === 'continuous') return 'Contínua';
        if (campaign.scheduleType === 'date') return 'Data Definida';
        if (campaign.scheduleType === 'period') return 'Por Período';
        return 'Escolher';
    };

    return (
        <div className="form-card">
            <div className="card-header">
                <i className="fa-solid fa-clock"></i> Duração
            </div>
            <div className="card-body">
                <div className="w-full">
                    <SelectionField 
                        label="Período de Veiculação"
                        value={getDurationLabel()}
                        icon="fa-solid fa-calendar-days"
                        onClick={() => setIsDurationModalOpen(true)}
                    />
                </div>
            </div>

            <AdDurationModal 
                isOpen={isDurationModalOpen}
                onClose={() => setIsDurationModalOpen(false)}
                pricingModel={campaign.pricingModel || 'budget'}
                currentType={campaign.scheduleType || 'continuous'}
                onSave={(config) => {
                    onInputChange('scheduleType', config.type);
                    if (config.startDate) onInputChange('startDate', config.startDate);
                    if (config.endDate) onInputChange('endDate', config.endDate);
                    if (config.periodConfig) onInputChange('scheduleConfig', config.periodConfig);
                }}
                initialConfig={{
                    startDate: campaign.startDate,
                    endDate: campaign.endDate,
                    periodConfig: campaign.scheduleConfig
                }}
            />
        </div>
    );
};
