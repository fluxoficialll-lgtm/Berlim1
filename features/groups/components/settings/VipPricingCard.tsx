import React from 'react';

interface VipPricingCardProps {
  price: string;
  currency: string;
  onPriceChange: (val: string) => void;
  onCurrencyChange: (val: any) => void;
}

export const VipPricingCard: React.FC<VipPricingCardProps> = ({ price, currency, onPriceChange, onCurrencyChange }) => (
  <div className="grid grid-cols-2 gap-4 bg-black/20 p-6 rounded-2xl border border-white/5">
    <div className="input-group mb-0">
      <label>Preço do Acesso</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-black text-xs">{currency === 'BRL' ? 'R$' : '$'}</span>
        <input 
          className="input-field pl-12 font-black text-[#00ff82]" 
          value={price} 
          onChange={e => onPriceChange(e.target.value)} 
        />
      </div>
    </div>
    <div className="input-group mb-0">
      <label>Moeda Base</label>
      <select 
        className="input-field font-black uppercase text-xs" 
        value={currency} 
        onChange={e => onCurrencyChange(e.target.value)}
      >
        <option value="BRL">BRL (Real)</option>
        <option value="USD">USD (Dólar)</option>
      </select>
    </div>
  </div>
);