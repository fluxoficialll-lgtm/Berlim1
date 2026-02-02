
import React from 'react';

interface SupportContactCardProps {
    onOpenSupport: () => void;
}

export const SupportContactCard: React.FC<SupportContactCardProps> = ({ onOpenSupport }) => {
    return (
        <div className="contact-section">
            <div className="contact-title">Ainda precisa de ajuda?</div>
            <div className="contact-desc">Nossa equipe está disponível para te ajudar.</div>
            <button className="contact-btn" onClick={onOpenSupport}>
                <i className="fa-solid fa-headset"></i> Falar com Suporte
            </button>
        </div>
    );
};
