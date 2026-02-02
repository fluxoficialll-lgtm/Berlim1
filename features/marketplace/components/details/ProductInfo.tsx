import React from 'react';

interface ProductInfoProps {
    title: string;
    price: number;
    location: string;
    category: string;
    timestamp: number;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ title, price, location, category, timestamp }) => {
    const getPriceDisplay = () => {
        if (category === 'Vagas de Emprego') return 'A combinar';
        return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    };

    return (
        <>
            <h1 className="product-title">{title}</h1>
            <div className="product-price">{getPriceDisplay()}</div>
            
            <div className="badges-row">
                <div className="badge-item"><i className="fa-solid fa-location-dot"></i> {location}</div>
                <div className="badge-item"><i className="fa-solid fa-tag"></i> {category}</div>
                <div className="badge-item"><i className="fa-solid fa-clock"></i> {new Date(timestamp).toLocaleDateString()}</div>
            </div>
        </>
    );
};