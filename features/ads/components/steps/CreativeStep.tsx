
import React from 'react';
import { AdCampaign, Group, Post } from '../../../../types';
import { AdPreview } from '../../../../components/ads/AdPreview';
import { DestinationCreativeSection } from '../../../../components/ads/DestinationCreativeSection';

interface CreativeStepProps {
    campaign: Partial<AdCampaign>;
    previewTab: 'feed' | 'reels' | 'marketplace';
    setPreviewTab: (tab: 'feed' | 'reels' | 'marketplace') => void;
    destinationMode: 'url' | 'group';
    setDestinationMode: (mode: 'url' | 'group') => void;
    onInputChange: (field: keyof AdCampaign, value: any) => void;
    onNestedChange: (parent: 'creative', field: string, value: any) => void;
    onPlacementCreativeChange: (placement: 'feed' | 'reels' | 'marketplace', mediaUrl: string, mediaType: 'image' | 'video') => void;
    myGroups: Group[];
    selectedContent: Post | null;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCtaUpdate: (placement: 'feed' | 'reels' | 'marketplace', label: string) => void;
    isUrlAllowed: boolean;
    isGroupAllowed: boolean;
    ctaOptions: any[];
}

export const CreativeStep: React.FC<CreativeStepProps> = ({
    campaign, previewTab, setPreviewTab, destinationMode, setDestinationMode,
    onInputChange, onNestedChange, onPlacementCreativeChange, myGroups, selectedContent, fileInputRef,
    onFileChange, onCtaUpdate, isUrlAllowed, isGroupAllowed, ctaOptions
}) => {
    return (
        <div className="animate-fade-in space-y-5">
            <AdPreview 
                campaign={campaign} 
                previewTab={previewTab} 
                setPreviewTab={setPreviewTab} 
                destinationMode={destinationMode}
            />
            <DestinationCreativeSection 
                campaign={campaign}
                destinationMode={destinationMode}
                setDestinationMode={setDestinationMode}
                onInputChange={onInputChange}
                onNestedChange={onNestedChange}
                onPlacementCreativeChange={onPlacementCreativeChange}
                myGroups={myGroups}
                selectedContent={selectedContent}
                fileInputRef={fileInputRef}
                onFileChange={onFileChange}
                ctaOptions={ctaOptions}
                onCtaUpdate={onCtaUpdate}
                isUrlAllowed={isUrlAllowed}
                isGroupAllowed={isGroupAllowed}
            />
        </div>
    );
};
