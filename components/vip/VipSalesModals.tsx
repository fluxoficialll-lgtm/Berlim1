
import React, { Suspense, lazy } from 'react';
import { Group } from '../../types';
import { GeoData } from '../../services/geoService';
import { ConversionResult } from '../../services/currencyService';

const PaymentFlowModal = lazy(() => import('../payments/PaymentFlowModal').then(m => ({ default: m.PaymentFlowModal })));
const EmailCaptureModal = lazy(() => import('../payments/EmailCaptureModal').then(m => ({ default: m.EmailCaptureModal })));
const GlobalSimulatorModal = lazy(() => import('../groups/GlobalSimulatorModal').then(m => ({ default: m.GlobalSimulatorModal })));

interface VipSalesModalsProps {
  isOpen: {
    pix: boolean;
    email: boolean;
    simulator: boolean;
  };
  onClose: () => void;
  group: Group;
  geoData: GeoData | null;
  priceInfo: ConversionResult | null;
  onEmailSuccess: (email: string) => void;
  onSimulateConfirm?: (provider: 'syncpay' | 'stripe' | 'paypal', country: any) => void;
  forcedProvider?: 'syncpay' | 'stripe' | 'paypal' | null;
}

export const VipSalesModals: React.FC<VipSalesModalsProps> = ({
  isOpen, onClose, group, geoData, priceInfo, onEmailSuccess, onSimulateConfirm, forcedProvider
}) => {
  return (
    <Suspense fallback={null}>
      {isOpen.pix && (
        <PaymentFlowModal 
          isOpen={isOpen.pix} 
          onClose={onClose} 
          group={group}
          provider={forcedProvider || (geoData?.countryCode === 'BR' ? 'syncpay' : 'stripe')}
          convertedPriceInfo={priceInfo}
          geo={geoData}
        />
      )}

      {isOpen.email && (
        <EmailCaptureModal 
          isOpen={isOpen.email} 
          onClose={onClose} 
          onSuccess={onEmailSuccess}
          pixelId={group.pixelId}
          groupId={group.id}
        />
      )}

      {isOpen.simulator && (
        <GlobalSimulatorModal 
          isOpen={isOpen.simulator} 
          onClose={onClose} 
          onConfirm={(provider, country) => {
            if (onSimulateConfirm) onSimulateConfirm(provider, country);
          }}
        />
      )}
    </Suspense>
  );
};
