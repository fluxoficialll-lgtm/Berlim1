
import React from 'react';
import { useAdCampaignFlow } from '../features/ads/hooks/useAdCampaignFlow';
import { CTA_OPTIONS_CONFIG } from '../features/ads/constants/AdConstants';

// Layout e Cabeçalho
import { AdFlowHeader } from '../components/ads/AdFlowHeader';
import { AdFlowFooter } from '../components/ads/AdFlowFooter';

// Componentes de Etapa
import { CampaignStep } from '../features/ads/components/steps/CampaignStep';
import { AudienceStep } from '../features/ads/components/steps/AudienceStep';
import { CreativeStep } from '../features/ads/components/steps/CreativeStep';

export const AdPlacementSelector: React.FC = () => {
  const {
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
  } = useAdCampaignFlow();

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
      <style>{`
        main { 
          padding: 90px 20px 120px 20px; 
          flex-grow: 1; 
          overflow-y: auto; 
          -webkit-overflow-scrolling: touch; 
          background: radial-gradient(circle at 50% 0%, #1a1e26 0%, #0a0c10 100%);
        }
        .flow-content { max-width: 650px; margin: 0 auto; }
        
        .boost-banner { 
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.15), transparent); 
          border-left: 4px solid #FFD700; 
          padding: 16px 20px; 
          border-radius: 16px; 
          margin-bottom: 24px; 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        /* Form Cards & Common Layout */
        .form-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          animation: slideUp 0.4s ease-out;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 800;
          color: #00c2ff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 16px;
        }

        .input-group label {
          display: block;
          font-size: 11px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          padding-left: 4px;
        }

        .meta-field {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 14px 18px;
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
        }
        .meta-field:focus {
          border-color: #00c2ff;
          background: rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 0 4px rgba(0, 194, 255, 0.1);
        }

        /* Type & Gender Selectors */
        .type-selector, .gender-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .type-btn, .gender-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 14px;
          border-radius: 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.5);
        }
        .type-btn.active, .gender-btn.active {
          background: rgba(0, 194, 255, 0.1);
          border-color: #00c2ff;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 194, 255, 0.15);
        }

        /* Placements */
        .placements-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .placement-chip {
          padding: 16px 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }
        .placement-chip i { font-size: 20px; color: rgba(255,255,255,0.2); }
        .placement-chip span { font-size: 11px; font-weight: 800; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        
        .placement-chip.selected {
          background: rgba(0, 194, 255, 0.05);
          border-color: #00c2ff;
        }
        .placement-chip.selected i { color: #00c2ff; }
        .placement-chip.selected span { color: #fff; }

        /* Interest Tags */
        .interest-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #00c2ff;
        }
        .interest-tag i {
          font-size: 10px;
          cursor: pointer;
          opacity: 0.5;
        }
        .interest-tag i:hover { opacity: 1; }

        .highlight-box {
          background: rgba(0, 194, 255, 0.04);
          padding: 20px;
          border-radius: 18px;
          border: 1px solid rgba(0, 194, 255, 0.1);
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <AdFlowHeader currentStep={currentStep} onBack={prevStep} />

      <main className="no-scrollbar">
          <div className="flow-content animate-fade-in">
              {selectedContent && (
                  <div className="boost-banner">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/20">
                        <i className="fa-solid fa-lock text-[#FFD700] text-xl"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">Modo de Impulsionamento</span>
                        <span className="text-xs font-bold text-white/80">Formato Vinculado ao Post Original</span>
                      </div>
                  </div>
              )}

              {currentStep === 'campaign' && (
                  <CampaignStep 
                    campaign={campaign} 
                    onInputChange={handleInputChange} 
                  />
              )}

              {currentStep === 'adset' && (
                  <AudienceStep 
                    campaign={campaign}
                    interestInput={interestInput}
                    setInterestInput={setInterestInput}
                    onInputChange={handleInputChange}
                    onTargetingChange={(f, v) => handleInputChange('targeting', { ...campaign.targeting!, [f]: v })}
                    addInterest={handleInterestAdd} 
                    removeInterest={handleInterestRemove}
                    onTogglePlacement={handlePlacementToggle}
                    isPlacementLocked={isPlacementLocked}
                    myGroups={myGroups}
                  />
              )}

              {currentStep === 'ad' && (
                  <CreativeStep 
                    campaign={campaign}
                    previewTab={previewTab}
                    setPreviewTab={setPreviewTab}
                    destinationMode={destinationMode}
                    setDestinationMode={setDestinationMode}
                    onInputChange={handleInputChange}
                    onNestedChange={(p, f, v) => handleInputChange(p, { ...campaign[p] as any, [f]: v })}
                    onPlacementCreativeChange={(p, u, t) => handleInputChange('placementCreatives', { ...campaign.placementCreatives, [p]: { mediaUrl: u, mediaType: t } })}
                    myGroups={myGroups}
                    selectedContent={selectedContent}
                    fileInputRef={fileInputRef}
                    onFileChange={handleFileChange}
                    onCtaUpdate={(p, l) => handleInputChange('placementCtas', { ...campaign.placementCtas, [p]: l })}
                    isUrlAllowed={true}
                    isGroupAllowed={true}
                    ctaOptions={CTA_OPTIONS_CONFIG}
                  />
              )}
          </div>
      </main>

      <AdFlowFooter 
        currentStep={currentStep} 
        isLoading={isLoading} 
        onPrev={prevStep} 
        onNext={nextStep} 
        onSubmit={submitCampaign} 
      />
    </div>
  );
};
