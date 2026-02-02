
import React from 'react';
import { MarketplaceItem } from '../../../../types';
import { ProductCard } from '../../../../components/marketplace/ProductCard';

interface ProfileProductsGridProps {
    products: MarketplaceItem[];
    onProductClick: (id: string) => void;
}

export const ProfileProductsGrid: React.FC<ProfileProductsGridProps> = ({ products, onProductClick }) => {
    if (products.length === 0) return <div className="no-content">Sem produtos.</div>;

    return (
        <div className="profile-products-container px-2 pb-10">
            <style>{`
                .profile-products-grid { 
                    display: grid; 
                    grid-template-columns: repeat(2, 1fr); 
                    gap: 12px; 
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                @media (min-width: 640px) {
                    .profile-products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    }
                }
            `}</style>
            <div className="profile-products-grid animate-fade-in">
                {products.map(p => (
                    <ProductCard 
                        key={p.id} 
                        product={p} 
                        onClick={(item) => onProductClick(item.id)} 
                    />
                ))}
            </div>
        </div>
    );
};
