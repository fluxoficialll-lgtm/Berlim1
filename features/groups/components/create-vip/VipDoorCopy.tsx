
import React from 'react';

interface VipDoorCopyProps {
  vipDoorText: string;
  onVipDoorTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  vipButtonText: string;
  onVipButtonTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VipDoorCopy: React.FC<VipDoorCopyProps> = ({ vipDoorText, onVipDoorTextChange, vipButtonText, onVipButtonTextChange }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="vipCopyright">Texto de Venda</label>
        <textarea id="vipCopyright" value={vipDoorText} onChange={onVipDoorTextChange} placeholder="Copy persuasiva..."></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="vipButtonText">Texto do Botão (Opcional)</label>
        <input type="text" id="vipButtonText" value={vipButtonText} onChange={onVipButtonTextChange} placeholder="Ex: Assinar (Padrão: COMPRAR AGORA)" maxLength={20} />
      </div>
    </>
  );
};
