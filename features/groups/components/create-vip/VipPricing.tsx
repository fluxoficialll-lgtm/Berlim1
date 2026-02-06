
import React from 'react';
import { CurrencyType } from '../../../../components/groups/CurrencySelectorModal';

interface VipPricingProps {
  selectedProviderId: string | null;
  onProviderClick: () => void;
  getProviderLabel: () => string;
  accessType: 'lifetime' | 'temporary' | 'one_time';
  onAccessClick: () => void;
  getAccessTypeLabel: () => string;
  currency: CurrencyType;
  onCurrencyClick: () => void;
  getCurrencySymbol: () => string;
  price: string;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VipPricing: React.FC<VipPricingProps> = ({ 
  selectedProviderId, onProviderClick, getProviderLabel, 
  accessType, onAccessClick, getAccessTypeLabel, 
  currency, onCurrencyClick, getCurrencySymbol, 
  price, onPriceChange 
}) => {
  return (
    <div className="price-group">
      <label>Venda e Acesso</label>

      <div className="selector-trigger" onClick={onProviderClick}>
        <div className="flex flex-col text-left">
          <span className="label">Escolher provedor:</span>
          <span className="value">
            <i className="fa-solid fa-wallet"></i>
            {getProviderLabel()}
          </span>
        </div>
        <i className="fa-solid fa-chevron-right text-[#FFD700]"></i>
      </div>
      
      <div className="selector-trigger" onClick={onAccessClick}>
        <div className="flex flex-col text-left">
          <span className="label">Tipo de acesso:</span>
          <span className="value">
            <i className={`fa-solid ${accessType === 'lifetime' ? 'fa-infinity' : accessType === 'temporary' ? 'fa-calendar-days' : 'fa-ticket'}`}></i>
            {getAccessTypeLabel()}
          </span>
        </div>
        <i className="fa-solid fa-chevron-right text-[#FFD700]"></i>
      </div>

      <div className="selector-trigger" onClick={onCurrencyClick}>
        <div className="flex flex-col text-left">
          <span className="label">Moeda para cobrança:</span>
          <span className="value">
            <span className="curr-sym">{getCurrencySymbol()}</span>
            {currency}
          </span>
        </div>
        <i className="fa-solid fa-chevron-right text-[#FFD700]"></i>
      </div>

      <div className="price-input-container">
        <span>{getCurrencySymbol()}</span>
        <input type="text" value={price} onChange={onPriceChange} placeholder="0,00" required />
      </div>
    </div>
  );
};
