
import React from 'react';

interface AdFlowFooterProps {
    currentStep: 'campaign' | 'adset' | 'ad';
    isLoading: boolean;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

export const AdFlowFooter: React.FC<AdFlowFooterProps> = ({ 
    currentStep, isLoading, onPrev, onNext, onSubmit 
}) => {
    return (
        <div className="fixed bottom-0 left-0 w-full padding-6 bg-[#0c0f14]/90 backdrop-blur-xl border-t border-white/10 flex justify-between z-[60] p-6">
            <style>{`
                .btn-nav { padding: 14px 28px; border-radius: 12px; font-weight: 900; font-size: 13px; text-transform: uppercase; cursor: pointer; transition: 0.2s; border: none; letter-spacing: 1px; }
                .btn-prev { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
                .btn-next { background: #00c2ff; color: #000; box-shadow: 0 4px 20px rgba(0,194,255,0.3); }
                .btn-next:disabled { background: #333; color: #777; box-shadow: none; cursor: not-allowed; }
            `}</style>
            <button className="btn-nav btn-prev" onClick={onPrev}>
                {currentStep === 'campaign' ? 'Sair' : 'Anterior'}
            </button>
            
            <button 
                className="btn-nav btn-next" 
                onClick={currentStep === 'ad' ? onSubmit : onNext}
                disabled={isLoading}
            >
                {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (currentStep === 'ad' ? 'Publicar Anúncio' : 'Continuar')}
            </button>
        </div>
    );
};
