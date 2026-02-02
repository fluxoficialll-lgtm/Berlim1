import React from 'react';
import { VipMediaItem } from '../../types';

interface VipSalesCarouselProps {
    mediaItems: VipMediaItem[];
    currentSlide: number;
    containerRef: React.RefObject<HTMLDivElement>;
    onScroll: () => void;
    onMediaClick: (item: VipMediaItem) => void;
}

export const VipSalesCarousel: React.FC<VipSalesCarouselProps> = ({ 
    mediaItems, 
    currentSlide, 
    containerRef, 
    onScroll, 
    onMediaClick 
}) => {
    return (
        <div className="carousel-wrapper relative w-full">
            <div 
                className="snap-container scroll-snap-type-x-mandatory flex gap-[10px] overflow-x-auto w-full pb-5 no-scrollbar"
                style={{ 
                    scrollSnapType: 'x mandatory', 
                    scrollbarWidth: 'none',
                    paddingLeft: '7.5vw',
                    paddingRight: '7.5vw'
                }}
                ref={containerRef}
                onScroll={onScroll}
            >
                {mediaItems.map((item, index) => (
                    <div 
                        key={index} 
                        className="snap-item scroll-snap-align-center flex-shrink-0 w-[85vw] max-w-[400px] aspect-[4/5] relative rounded-[16px] overflow-hidden border border-[#00c2ff4d] bg-[#000] cursor-pointer"
                        style={{ scrollSnapAlign: 'center' }}
                        onClick={() => onMediaClick(item)}
                    >
                        {item.type === 'video' ? (
                            <video src={item.url} controls={false} className="w-full h-full object-cover" />
                        ) : (
                            <img src={item.url} alt={`VIP ${index}`} className="w-full h-full object-cover" />
                        )}
                        <div className="zoom-hint absolute bottom-[10px] right-[10px] bg-black/50 p-[5px] rounded-full color-white text-sm pointer-events-none">
                            <i className="fa-solid fa-expand"></i>
                        </div>
                    </div>
                ))}
            </div>
            {mediaItems.length > 1 && (
                <div className="carousel-dots flex justify-center gap-[6px] mt-[-15px] mb-[15px]">
                    {mediaItems.map((_, idx) => (
                        <div key={idx} className={`dot w-[6px] h-[6px] rounded-full bg-white/30 transition-all duration-300 ${currentSlide === idx ? 'active bg-[#00c2ff] w-[18px] rounded-[4px]' : ''}`}></div>
                    ))}
                </div>
            )}
        </div>
    );
};