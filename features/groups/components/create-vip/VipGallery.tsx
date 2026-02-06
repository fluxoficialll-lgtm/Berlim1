
import React from 'react';

interface VipGalleryProps {
  vipMediaItems: { url: string; type: 'image' | 'video'; }[];
  onVipMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMoveVipMediaItem: (index: number, direction: 'left' | 'right') => void;
  onRemoveMediaItem: (index: number) => void;
}

export const VipGallery: React.FC<VipGalleryProps> = ({ vipMediaItems, onVipMediaChange, onMoveVipMediaItem, onRemoveMediaItem }) => {
  return (
    <div className="vip-door-section">
      <div className="section-title"><i className="fa-solid fa-door-open"></i> Galeria da Porta VIP</div>
      <div className="flex flex-wrap gap-2.5 mb-4">
        {vipMediaItems.map((item, idx) => (
          <div key={idx} className="media-preview-item animate-fade-in">
            {item.type === 'video' ? <video src={item.url} /> : <img src={item.url} alt={`Preview ${idx}`} />}
            
            <div className="media-controls-overlay">
              <div className="flex gap-1">
                <button 
                  type="button"
                  onClick={() => onMoveVipMediaItem(idx, 'left')}
                  disabled={idx === 0}
                  className="reorder-btn"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button 
                  type="button"
                  onClick={() => onMoveVipMediaItem(idx, 'right')}
                  disabled={idx === vipMediaItems.length - 1}
                  className="reorder-btn"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
              <button type="button" className="remove-media-btn-new" onClick={() => onRemoveMediaItem(idx)}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>

            <div className="absolute bottom-1 left-1 bg-black/60 text-[7px] font-black text-white px-1 py-0.5 rounded border border-white/5">
              #{idx + 1}
            </div>
          </div>
        ))}
        {vipMediaItems.length < 10 && (
          <label htmlFor="vipMediaInput" className="add-media-btn">
            <i className="fa-solid fa-plus"></i>
            <span>Adicionar</span>
          </label>
        )}
        <input type="file" id="vipMediaInput" accept="image/*,video/*" multiple style={{display:'none'}} onChange={onVipMediaChange} />
      </div>
    </div>
  );
};
