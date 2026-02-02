import React from 'react';

interface ProductBottomBarProps {
    isSeller: boolean;
    onDelete: () => void;
    onChat: (e: React.MouseEvent) => void;
}

export const ProductBottomBar: React.FC<ProductBottomBarProps> = ({ isSeller, onDelete, onChat }) => {
    return (
        <div className="bottom-bar">
            {isSeller ? (
                <button className="action-btn btn-danger" onClick={onDelete}>
                    <i className="fa-solid fa-trash"></i> Excluir Anúncio
                </button>
            ) : (
                <>
                    <button className="action-btn btn-secondary" onClick={() => { alert('Adicionado aos favoritos!'); }}>
                        <i className="fa-regular fa-heart"></i>
                    </button>
                    <button className="action-btn btn-primary" onClick={onChat}>
                        <i className="fa-brands fa-whatsapp"></i> Conversar / Negociar
                    </button>
                </>
            )}
        </div>
    );
};