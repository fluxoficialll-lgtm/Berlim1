
import React, { useRef, useState, useEffect } from 'react';
import { VipMediaItem } from '../../types';

interface VideoItemProps {
    url: string;
    isPlaying: boolean;
    onToggle: () => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ url, isPlaying, onToggle }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [localIsPlaying, setLocalIsPlaying] = useState(false);

    useEffect(() => {
        if (!videoRef.current) return;
        
        if (isPlaying) {
            videoRef.current.play().catch(() => {
                setLocalIsPlaying(false);
            });
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        const onPlay = () => setLocalIsPlaying(true);
        const onPause = () => setLocalIsPlaying(false);

        vid.addEventListener('play', onPlay);
        vid.addEventListener('pause', onPause);

        return () => {
            vid.removeEventListener('play', onPlay);
            vid.removeEventListener('pause', onPause);
        };
    }, []);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle();
    };

    return (
        <div className="relative w-full h-full group/vid overflow-hidden">
            <video 
                ref={videoRef}
                src={url} 
                className="w-full h-full object-cover"
                playsInline
                loop
                preload="metadata"
            />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button 
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white pointer-events-auto transition-all active:scale-90 hover:bg-black/70 shadow-2xl"
                >
                    <i className={`fa-solid ${localIsPlaying ? 'fa-pause' : 'fa-play ml-1'} text-2xl`}></i>
                </button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
        </div>
    );
};

interface VipGalleryProps {
    mediaItems: VipMediaItem[];
    currentSlide: number;
    playingIndex: number | null;
    containerRef: React.RefObject<HTMLDivElement>;
    onScroll: () => void;
    onMediaClick: (index: number) => void;
    onToggleVideo: (index: number) => void;
}

export const VipGallery: React.FC<VipGalleryProps> = ({ 
    mediaItems, 
    currentSlide, 
    playingIndex,
    containerRef, 
    onScroll, 
    onMediaClick,
    onToggleVideo
}) => {
    if (!mediaItems || mediaItems.length === 0) return null;

    const ITEM_WIDTH_PERCENT = 85;
    const ITEM_MAX_WIDTH_PX = 400;

    return (
        <div className="carousel-wrapper relative w-screen left-1/2 -translate-x-1/2 overflow-hidden">
            <div 
                className="snap-container flex gap-[15px] overflow-x-auto w-full pb-8 no-scrollbar"
                style={{ 
                    scrollSnapType: 'x mandatory', 
                    scrollbarWidth: 'none',
                    paddingLeft: `calc(50vw - (min(${ITEM_WIDTH_PERCENT}vw, ${ITEM_MAX_WIDTH_PX}px) / 2))`,
                    paddingRight: `calc(50vw - (min(${ITEM_WIDTH_PERCENT}vw, ${ITEM_MAX_WIDTH_PX}px) / 2))`,
                    scrollPaddingLeft: `calc(50vw - (min(${ITEM_WIDTH_PERCENT}vw, ${ITEM_MAX_WIDTH_PX}px) / 2))`,
                    scrollPaddingRight: `calc(50vw - (min(${ITEM_WIDTH_PERCENT}vw, ${ITEM_MAX_WIDTH_PX}px) / 2))`
                }}
                ref={containerRef}
                onScroll={onScroll}
            >
                {mediaItems.map((item, index) => (
                    <div 
                        key={index} 
                        className="snap-item scroll-snap-align-center flex-shrink-0 w-[85vw] max-w-[400px] aspect-[4/5] relative rounded-[28px] overflow-hidden border border-white/5 bg-[#000] cursor-pointer shadow-2xl transition-transform duration-300"
                        style={{ scrollSnapAlign: 'center', scrollSnapStop: 'always' }}
                        onClick={() => onMediaClick(index)}
                    >
                        {item.type === 'video' ? (
                            <VideoItem 
                                url={item.url} 
                                isPlaying={playingIndex === index}
                                onToggle={() => onToggleVideo(index)}
                            />
                        ) : (
                            <img src={item.url} alt={`VIP ${index}`} className="w-full h-full object-cover" />
                        )}
                        
                        <div className="absolute bottom-[20px] right-[20px] bg-black/40 backdrop-blur-md p-[10px] rounded-full text-white/50 text-xs border border-white/10 pointer-events-none">
                            <i className="fa-solid fa-expand"></i>
                        </div>
                    </div>
                ))}
            </div>
            
            {mediaItems.length > 1 && (
                <div className="carousel-dots flex justify-center gap-[8px] mt-[-10px] mb-[20px]">
                    {mediaItems.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`dot h-[6px] rounded-full transition-all duration-300 ${
                                currentSlide === idx 
                                ? 'bg-[#00c2ff] w-[24px]' 
                                : 'bg-white/10 w-[6px]'
                            }`}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};
