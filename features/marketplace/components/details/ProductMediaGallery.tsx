import React, { useState, useRef } from 'react';

interface ProductMediaGalleryProps {
    mediaItems: { type: 'image' | 'video', url: string }[];
    onMediaClick: (media: { type: 'image' | 'video', url: string }) => void;
}

export const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({ mediaItems, onMediaClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const width = scrollRef.current.offsetWidth;
            const index = Math.round(scrollLeft / width);
            setCurrentIndex(index);
        }
    };

    if (mediaItems.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-800 flex items-center justify-center text-gray-600">
                <i className="fa-solid fa-image text-6xl"></i>
            </div>
        );
    }

    return (
        <div className="relative w-full bg-black aspect-square max-h-[60vh] flex flex-col">
            <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-10 backdrop-blur-md font-bold">
                {currentIndex + 1} / {mediaItems.length}
            </div>

            <div 
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={handleScroll}
            >
                {mediaItems.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center bg-black relative cursor-pointer"
                        onClick={() => onMediaClick(item)}
                    >
                        {item.type === 'video' ? (
                            <video 
                                src={item.url} 
                                controls 
                                className="max-w-full max-h-full object-contain" 
                                style={{width: '100%', height: '100%'}}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <img 
                                src={item.url} 
                                alt={`Product view ${idx + 1}`} 
                                className="max-w-full max-h-full object-contain" 
                            />
                        )}
                        <button className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full pointer-events-none">
                            <i className="fa-solid fa-expand text-xs"></i>
                        </button>
                    </div>
                ))}
            </div>

            {mediaItems.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {mediaItems.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full transition-all shadow-sm ${currentIndex === idx ? 'bg-[#00c2ff] scale-125' : 'bg-white/50'}`}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};