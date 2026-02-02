
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProductHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/marketplace');
        }
    };

    return (
        <div className="header-overlay">
            <div className="back-btn" onClick={handleBack}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
        </div>
    );
};
