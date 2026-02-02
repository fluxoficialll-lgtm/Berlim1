
import React from 'react';

interface AddFileSophisticatedButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

export const AddFileSophisticatedButton: React.FC<AddFileSophisticatedButtonProps> = ({ onClick, isLoading }) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[340px] px-4 animate-slide-up">
            <style>{`
                .btn-premium-upload {
                    width: 100%;
                    height: 58px;
                    background: rgba(12, 15, 20, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 194, 255, 0.3);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 194, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                }
                
                .btn-premium-upload:hover {
                    border-color: #00c2ff;
                    background: rgba(12, 15, 20, 0.95);
                    transform: translateY(-2px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 194, 255, 0.2);
                }

                .btn-premium-upload:active {
                    transform: translateY(0) scale(0.98);
                }

                .btn-premium-upload:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    border-color: rgba(255,255,255,0.1);
                }

                .btn-label-sophisticated {
                    font-size: 11px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    color: rgba(255, 255, 255, 0.9);
                }

                .icon-circle-bg {
                    width: 28px;
                    height: 28px;
                    background: rgba(0, 194, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00c2ff;
                }

                .glow-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(0, 194, 255, 0.4), transparent);
                }
            `}</style>

            <button 
                className="btn-premium-upload" 
                onClick={onClick}
                disabled={isLoading}
            >
                <div className="glow-line"></div>
                
                {isLoading ? (
                    <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00c2ff]"></i>
                ) : (
                    <>
                        <div className="icon-circle-bg">
                            <i className="fa-solid fa-plus text-xs"></i>
                        </div>
                        <span className="btn-label-sophisticated">Adicionar Arquivo</span>
                    </>
                )}
            </button>
        </div>
    );
};
