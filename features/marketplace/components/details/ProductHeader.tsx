
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductHeaderProps {
    isSeller: boolean;
    productId: string;
    onDelete: () => void;
    onReport: () => void;
    onMediaClick: (media: { type: 'image' | 'video'; url: string }) => void;
    mediaItems: { type: 'image' | 'video'; url: string }[];
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ isSeller, onDelete, onReport, onMediaClick, mediaItems }) => {
    const navigate = useNavigate();
    const mainMedia = mediaItems[0];

    return (
        <div className="relative w-full h-[40vh] bg-black group cursor-pointer" onClick={() => mainMedia && onMediaClick(mainMedia)}>
            {mainMedia && (
                <img 
                    src={mainMedia.url} 
                    alt="Product Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity" 
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f14] via-transparent to-black/30"></div>
            
            {/* Ícone de expandir no centro */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 scale-90">
                    <i className="fa-solid fa-expand text-white text-2xl"></i>
                </div>
            </div>

            {/* Barra de navegação superior */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <i className="fa-solid fa-arrow-left text-white"></i>
                </button>
                
                {isSeller ? (
                    <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/edit-product/${productId}`); }} className="h-10 px-4 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <i className="fa-solid fa-pen-to-square mr-2"></i> Editar
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-10 h-10 bg-red-500/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                ) : (
                    <button onClick={(e) => { e.stopPropagation(); onReport(); }} className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                )}
            </div>
        </div>
    );
};
