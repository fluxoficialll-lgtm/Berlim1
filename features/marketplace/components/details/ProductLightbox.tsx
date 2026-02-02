import React from 'react';

interface ProductLightboxProps {
    media: { url: string, type: 'image' | 'video' } | null;
    onClose: () => void;
}

export const ProductLightbox: React.FC<ProductLightboxProps> = ({ media, onClose }) => {
    if (!media) return null;

    return (
        <div 
            className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-2"
            onClick={onClose}
        >
            <button 
                className="absolute top-4 right-4 text-white text-4xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center z-50"
                onClick={onClose}
            >
                &times;
            </button>
            
            {media.type === 'video' ? (
                <video 
                    src={media.url} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-full object-contain shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <img 
                    src={media.url} 
                    alt="Zoom" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                />
            )}
        </div>
    );
};