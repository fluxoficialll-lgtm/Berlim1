
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceItem } from '../../types';

interface ProductStoreListProps {
    products: MarketplaceItem[];
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export const ProductStoreList: React.FC<ProductStoreListProps> = ({ products, onDelete }) => {
    const navigate = useNavigate();

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="products-list animate-fade-in">
            <style>{`
                .item-badge-ad {
                    font-size: 8px;
                    font-weight: 900;
                    text-transform: uppercase;
                    background: #FFD700;
                    color: #000;
                    padding: 1px 4px;
                    border-radius: 3px;
                    margin-left: 6px;
                }
            `}</style>
            
            {products.length > 0 ? products.map(prod => (
                <div key={prod.id} className="store-item" onClick={() => navigate(`/marketplace/product/${prod.id}`)}>
                    <img src={prod.image || 'https://via.placeholder.com/100'} className="item-thumb" alt={prod.title} />
                    <div className="item-info">
                        <div className="item-title flex items-center">
                            {prod.title}
                            {prod.isAd && <span className="item-badge-ad">AD</span>}
                        </div>
                        <div className="item-meta">
                            {prod.category}
                            <span className="item-sales"><i className="fa-solid fa-bag-shopping"></i> {prod.soldCount || 0}</span>
                        </div>
                        <div className="item-price">{formatCurrency(prod.price)}</div>
                    </div>
                    <div className="item-actions">
                        <div className="action-icon delete" onClick={(e) => onDelete(prod.id, e)} title="Excluir Produto">
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="empty-state">
                    <i className="fa-solid fa-box-open"></i>
                    <p>Você ainda não publicou produtos.</p>
                </div>
            )}
            
            <button className="add-btn" onClick={() => navigate('/create-marketplace-item')}>
                <i className="fa-solid fa-plus-circle"></i> Criar Novo Anúncio
            </button>
        </div>
    );
};
