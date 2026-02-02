
import React from 'react';
import { AdCampaign, Group } from '../../../../types';
import { BudgetSection } from '../../../../components/ads/BudgetSection';
import { TargetingSection } from '../../../../components/ads/TargetingSection';
import { LookalikeSection } from '../../../../components/ads/LookalikeSection';
import { StrategySection } from '../../../../components/ads/StrategySection';
import { PlacementSection } from '../../../../components/ads/PlacementSection';

interface AudienceStepProps {
    campaign: Partial<AdCampaign>;
    interestInput: string;
    setInterestInput: (val: string) => void;
    onInputChange: (field: keyof AdCampaign, value: any) => void;
    onTargetingChange: (field: string, value: any) => void;
    addInterest: () => void;
    removeInterest: (interest: string) => void;
    onTogglePlacement: (placement: 'feed' | 'reels' | 'marketplace') => void;
    isPlacementLocked: (placement: string) => boolean;
    myGroups: Group[];
}

export const AudienceStep: React.FC<AudienceStepProps> = ({
    campaign, interestInput, setInterestInput, onInputChange, onTargetingChange,
    addInterest, removeInterest, onTogglePlacement, isPlacementLocked, myGroups
}) => {
    return (
        <div className="animate-fade-in space-y-5">
            <BudgetSection 
                campaign={campaign} 
                onInputChange={onInputChange} 
            />

            <TargetingSection 
                campaign={campaign}
                interestInput={interestInput}
                setInterestInput={setInterestInput}
                onTargetingChange={onTargetingChange}
                addInterest={addInterest}
                removeInterest={removeInterest}
            />

            <LookalikeSection 
                campaign={campaign}
                myGroups={myGroups}
                onTargetingChange={onTargetingChange}
            />

            <StrategySection 
                campaign={campaign} 
                onInputChange={onInputChange} 
            />

            <PlacementSection 
                campaign={campaign} 
                onToggle={onTogglePlacement} 
                isLocked={isPlacementLocked} 
            />
        </div>
    );
};
