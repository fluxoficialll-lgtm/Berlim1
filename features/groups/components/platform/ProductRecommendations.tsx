
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
    id: string;
    title: string;
    price: number;
    img: string;
}

interface ProductRecommendationsProps {
    products: Product[];
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ products }) => {
    const navigate = useNavigate();

    return (
        <section>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[2px] mb-4">Recomendações para você</h3>
            <div className="product-grid">
                {products.map(p => (
                    <div key={p.id} className="product-item">
                        <img src={p.img} className="product-img" alt={p.title} />
                        <div className="product-info">
                            <h5 className="font-bold text-xs truncate">{p.title}</h5>
                            <div className="text-[#00ff82] font-black text-sm mt-1">R$ {p.price.toFixed(2).replace('.', ',')}</div>
                            <button className="buy-btn" onClick={() => navigate('/marketplace')}>Acessar Oferta</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
