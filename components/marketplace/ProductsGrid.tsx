
import React from 'react';
import { MarketplaceItem } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductsGridProps {
    items: MarketplaceItem[];
    isLoading: boolean;
    onItemClick: (item: MarketplaceItem) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ items, isLoading, onItemClick }) => {
    return (
        <div className="products-grid grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 w-full max-w-[1200px] mx-auto relative z-1 items-start content-start">
            {isLoading ? (
                <div className="col-span-full w-full text-center text-[#555] mt-20 flex flex-col items-center">
                    <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl mb-4"></i>
                    <p className="text-sm font-medium">Carregando ofertas...</p>
                </div>
            ) : items.length > 0 ? (
                items.map((prod) => (
                    <ProductCard 
                        key={prod.id} 
                        product={prod} 
                        onClick={onItemClick} 
                    />
                ))
            ) : (
                <div className="col-span-full w-full text-center text-gray-600 mt-20 flex flex-col items-center gap-2">
                    <i className="fa-solid fa-ghost text-4xl opacity-30"></i>
                    <p className="text-sm">Nenhum resultado encontrado.</p>
                </div>
            )}
        </div>
    );
};
