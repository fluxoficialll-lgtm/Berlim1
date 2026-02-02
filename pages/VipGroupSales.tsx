
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVipGroupSales } from '../hooks/useVipGroupSales';
import { useAutoLanguage } from '../hooks/useAutoLanguage';
import { vipSalesTracker } from '../services/pixel/trackers/VipSalesTracker';

// UI Components
import { VipSalesHeader } from '../components/vip/VipSalesHeader';
import { VipSalesPriceBadge } from '../components/vip/VipSalesPriceBadge';
import { VipGallery } from '../components/vip/VipGallery';
import { VipCopy } from '../components/vip/VipCopy';
import { VipCheckout } from '../components/vip/VipCheckout';
import { VipSalesModals } from '../components/vip/VipSalesModals';
import { VipSalesMediaZoom } from '../components/vip/VipSalesMediaZoom';

export const VipGroupSales: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSimulated, setIsSimulated] = useState(false);
  const [forcedProvider, setForcedProvider] = useState<'syncpay' | 'stripe' | 'paypal' | null>(null);
  
  const {
    group,
    loading,
    error,
    isCreator,
    isPurchaseEnabled,
    modals,
    currentSlide,
    playingIndex,
    carouselRef,
    displayPriceInfo,
    geoData,
    setGeoData,
    handleScroll,
    handleToggleVideo,
    handlePurchaseClick,
    openSimulator,
    closeModals,
    setZoom,
    onEmailSuccess
  } = useVipGroupSales(id);

  const { lang, isTranslating, translatedData, t } = useAutoLanguage(group);

  const normalizedMedia = useMemo(() => {
    if (!group?.vipDoor) return [];
    const items = group.vipDoor.mediaItems || [];
    if (items.length === 0 && group.vipDoor.media) {
      return [{ url: group.vipDoor.media, type: group.vipDoor.mediaType || 'image' }];
    }
    return items;
  }, [group?.vipDoor]);

  useEffect(() => {
    if (group && !loading) {
      const timer = setTimeout(() => {
        vipSalesTracker.trackTimeStay60s(group);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [group, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-[#0c0f14] flex flex-col items-center justify-center p-10 text-center">
        <i className="fa-solid fa-circle-exclamation text-4xl text-red-500 mb-4"></i>
        <h2 className="text-xl font-bold">Grupo não encontrado</h2>
        <button onClick={() => navigate('/groups')} className="mt-6 px-6 py-3 bg-[#00c2ff] text-black font-bold rounded-xl">Voltar</button>
      </div>
    );
  }

  const handleApplySimulation = (provider: 'syncpay' | 'stripe' | 'paypal', country: any) => {
      setIsSimulated(true);
      setForcedProvider(provider);
      setGeoData({
          countryCode: country.code,
          countryName: country.name,
          currency: country.currency,
          ip: '127.0.0.1'
      });
      closeModals();
      setTimeout(() => {
          handlePurchaseClick();
      }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col pb-[100px]">
      <VipSalesHeader 
        isOwner={isCreator} 
        isSimulated={isSimulated}
        onSimulateClick={openSimulator}
      />
      
      <main className="flex-grow pt-[85px] px-5 text-center max-w-[600px] mx-auto w-full">
        <VipSalesPriceBadge geoData={geoData} />
        
        <div className="mt-2 mb-6">
            <h1 className="text-2xl font-black text-white px-4 tracking-tight">
                {translatedData?.name || group.name}
            </h1>
        </div>

        <VipGallery 
          mediaItems={normalizedMedia} 
          currentSlide={currentSlide}
          playingIndex={playingIndex}
          containerRef={carouselRef}
          onScroll={handleScroll}
          onMediaClick={setZoom}
          onToggleVideo={handleToggleVideo}
        />

        <VipCopy text={translatedData?.vipDoorText || group.vipDoor?.text || ''} />
        
        <VipCheckout 
          isEnabled={isPurchaseEnabled}
          isRenewal={false} 
          ctaText={translatedData?.vipButtonText || group.vipDoor?.buttonText || t('buy_now')}
          formattedPrice={displayPriceInfo?.formatted}
          onClick={handlePurchaseClick}
        />

        <div className="mt-4 flex flex-col gap-1 items-center opacity-30">
            <span className="text-[9px] font-black uppercase tracking-widest">{t('secure_payment')}</span>
            <div className="flex gap-4 text-sm mt-1">
                <i className="fa-brands fa-cc-visa"></i>
                <i className="fa-brands fa-cc-mastercard"></i>
                <i className="fa-solid fa-pix"></i>
            </div>
        </div>
      </main>

      <VipSalesModals 
        isOpen={{ ...modals, pix: modals.pix, email: modals.email, simulator: modals.simulator }}
        onClose={() => {
            closeModals();
            if (!modals.pix) setForcedProvider(null); 
        }}
        group={group}
        geoData={geoData}
        priceInfo={displayPriceInfo}
        onEmailSuccess={onEmailSuccess}
        onSimulateConfirm={handleApplySimulation}
        forcedProvider={forcedProvider}
      />

      <VipSalesMediaZoom 
        items={normalizedMedia}
        initialIndex={modals.zoomIndex}
        onClose={closeModals}
      />
    </div>
  );
};
