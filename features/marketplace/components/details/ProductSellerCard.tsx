import React from 'react';

interface ProductSellerCardProps {
    sellerName: string;
    sellerAvatar?: string;
    onClick: () => void;
}

export const ProductSellerCard: React.FC<ProductSellerCardProps> = ({ sellerName, sellerAvatar, onClick }) => {
    return (
        <div className="seller-card" onClick={onClick}>
            <div className="seller-left">
                {sellerAvatar ? (
                    <img src={sellerAvatar} className="seller-avatar" alt="Seller" />
                ) : (
                    <div className="seller-avatar bg-gray-700 flex items-center justify-center text-xs"><i className="fa-solid fa-user"></i></div>
                )}
                <div className="seller-info">
                    <h4>{sellerName}</h4>
                    <p>Ver perfil completo</p>
                </div>
            </div>
            <i className="fa-solid fa-chevron-right store-icon"></i>
        </div>
    );
};