
import React from 'react';

interface AdFlowHeaderProps {
    currentStep: 'campaign' | 'adset' | 'ad';
    onBack: () => void;
}

export const AdFlowHeader: React.FC<AdFlowHeaderProps> = ({ currentStep, onBack }) => {
    return (
        <header className="flex items-center px-6 bg-[#0c0f14] fixed w-full top-0 z-50 border-b border-white/10 h-[70px]">
            <style>{`
                .back-btn-flow { background:none; border:none; color:#fff; font-size:20px; cursor:pointer; }
                .stepper-container { display: flex; align-items: center; gap: 10px; margin-left: 20px; flex: 1; }
                .step-pill { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #555; transition: 0.3s; cursor: default; }
                .step-pill.active { color: #00c2ff; }
                .step-pill.completed { color: #fff; }
                .step-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
                .step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); max-width: 40px; }
            `}</style>
            <button onClick={onBack} className="back-btn-flow"><i className="fa-solid fa-xmark"></i></button>
            <div className="stepper-container">
                <div className={`step-pill ${currentStep === 'campaign' ? 'active' : 'completed'}`}>
                    <div className="step-dot"></div> CAMPANHA
                </div>
                <div className="step-line"></div>
                <div className={`step-pill ${currentStep === 'adset' ? 'active' : (currentStep === 'ad' ? 'completed' : '')}`}>
                    <div className="step-dot"></div> CONJUNTO
                </div>
                <div className="step-line"></div>
                <div className={`step-pill ${currentStep === 'ad' ? 'active' : ''}`}>
                    <div className="step-dot"></div> ANÚNCIO
                </div>
            </div>
        </header>
    );
};
