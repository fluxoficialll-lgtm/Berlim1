
// Fix: Added React import to resolve namespace errors for ChangeEvent
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { groupService } from '../../../services/groupService';
import { adService } from '../../../services/adService';
import { AdCampaign, Group, Post } from '../../../types';
import { useModal } from '../../../components/ModalSystem';
import { AdFlowStep } from '../constants/AdConstants';

export const useAdCampaignFlow = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useModal();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [currentStep, setCurrentStep] = useState<AdFlowStep>('campaign');
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [selectedContent, setSelectedContent] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // UI State
    const [previewTab, setPreviewTab] = useState<'feed' | 'reels' | 'marketplace'>('feed');
    const [destinationMode, setDestinationMode] = useState<'url' | 'group'>('url');
    const [interestInput, setInterestInput] = useState('');

    const [campaign, setCampaign] = useState<Partial<AdCampaign>>({
        name: '',
        scheduleType: 'continuous',
        budget: 10,
        trafficObjective: 'visits',
        pricingModel: 'budget',
        creative: { text: '', mediaType: 'image' },
        placementCreatives: { feed: {}, reels: {}, marketplace: {} },
        campaignObjective: 'traffic',
        destinationType: 'url',
        optimizationGoal: 'views',
        placements: ['feed', 'reels', 'marketplace'],
        ctaButton: 'saiba mais', 
        placementCtas: { feed: 'saiba mais', reels: 'saiba mais', marketplace: 'comprar' },
        targeting: { ageMin: 18, ageMax: 65, gender: 'all', interests: [], locations: [], location: '', radius: 50 },
        targetUrl: '',
        targetGroupId: ''
    });

    useEffect(() => {
        const state = location.state as { boostedContent?: Post } | null;
        if (state?.boostedContent) {
            const post = state.boostedContent;
            setSelectedContent(post);
            const type = post.type === 'video' ? 'video' : 'image';
            const url = post.video || post.image;
            
            const forcedPlacement = post.type === 'video' ? ['reels'] : ['feed'];
            setPreviewTab(post.type === 'video' ? 'reels' : 'feed');

            setCampaign(prev => ({
                ...prev,
                name: `Turbinar: ${post.text.substring(0, 20)}...`,
                placements: forcedPlacement as any,
                creative: { text: post.text, mediaUrl: url, mediaType: type as any },
                placementCreatives: {
                    feed: post.type !== 'video' ? { mediaUrl: url, mediaType: 'image' } : {},
                    reels: post.type === 'video' ? { mediaUrl: url, mediaType: 'video' } : {},
                    marketplace: {}
                }
            }));
        }

        const email = authService.getCurrentUserEmail();
        if (email) {
            setMyGroups(groupService.getGroupsSync().filter(g => g.creatorEmail === email));
        }
    }, [location.state]);

    const isPlacementLocked = useCallback((p: string): boolean => {
        if (!selectedContent) return false;
        if (p === 'marketplace') return true; 
        if (selectedContent.type === 'video') return p === 'feed';
        return p === 'reels';
    }, [selectedContent]);

    const handleInputChange = (field: keyof AdCampaign, value: any) => {
        setCampaign(prev => ({ ...prev, [field]: value }));
    };

    const handlePlacementToggle = (p: 'feed' | 'reels' | 'marketplace') => {
        if (isPlacementLocked(p)) return;
        const current = campaign.placements || [];
        if (current.includes(p)) {
            if (current.length > 1) handleInputChange('placements', current.filter(x => x !== p));
        } else {
            handleInputChange('placements', [...current, p]);
        }
    };

    const handleInterestAdd = () => {
        if (!interestInput.trim()) return;
        const current = campaign.targeting?.interests || [];
        if (!current.includes(interestInput.trim())) {
            const updated = [...current, interestInput.trim()];
            handleInputChange('targeting', { ...campaign.targeting, interests: updated });
        }
        setInterestInput('');
    };

    const handleInterestRemove = (interest: string) => {
        const current = campaign.targeting?.interests || [];
        const updated = current.filter(i => i !== interest);
        handleInputChange('targeting', { ...campaign.targeting, interests: updated });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result as string;
                const type = file.type.startsWith('video/') ? 'video' : 'image';
                setCampaign(prev => ({
                    ...prev,
                    creative: { ...prev.creative!, mediaUrl: result, mediaType: type as any }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => {
        if (currentStep === 'campaign' && !campaign.name) { showAlert("Aviso", "Dê um nome para a campanha."); return; }
        if (currentStep === 'adset' && (!campaign.targeting?.locations || campaign.targeting.locations.length === 0)) {
            showAlert("Aviso", "Selecione uma área de alcance."); return;
        }
        if (currentStep === 'campaign') setCurrentStep('adset');
        else if (currentStep === 'adset') setCurrentStep('ad');
    };

    const prevStep = () => {
        if (currentStep === 'campaign') navigate('/ad-type-selector');
        else if (currentStep === 'adset') setCurrentStep('campaign');
        else setCurrentStep('adset');
    };

    const submitCampaign = async () => {
        setIsLoading(true);
        const user = authService.getCurrentUser();
        if (user) {
            const finalCampaign = { ...campaign, ownerId: user.id, ownerEmail: user.email };
            await adService.createCampaign(finalCampaign as AdCampaign);
            navigate('/my-store');
        } else {
            setIsLoading(false);
            showAlert("Erro", "Você precisa estar logado.");
        }
    };

    return {
        campaign,
        currentStep,
        myGroups,
        selectedContent,
        isLoading,
        previewTab,
        setPreviewTab,
        destinationMode,
        setDestinationMode,
        interestInput,
        setInterestInput,
        fileInputRef,
        isPlacementLocked,
        handleInputChange,
        handlePlacementToggle,
        handleInterestAdd,
        handleInterestRemove,
        handleFileChange,
        nextStep,
        prevStep,
        submitCampaign
    };
};
