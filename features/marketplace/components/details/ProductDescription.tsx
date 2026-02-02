import React from 'react';

interface ProductDescriptionProps {
    description: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
    return (
        <div className="desc-section">
            <h3 className="section-header"><i className="fa-solid fa-align-left text-[#00c2ff]"></i> Detalhes</h3>
            <p className="desc-text">{description || "Sem descrição fornecida pelo vendedor."}</p>
        </div>
    );
};