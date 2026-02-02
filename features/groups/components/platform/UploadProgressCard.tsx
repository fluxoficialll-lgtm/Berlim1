
import React from 'react';

interface UploadProgressCardProps {
    progress: number;
    current: number;
    total: number;
    isVisible: boolean;
}

export const UploadProgressCard: React.FC<UploadProgressCardProps> = ({ progress, current, total, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-[55] w-full max-w-[340px] px-4 animate-slide-up">
            <style>{`
                .upload-status-card {
                    background: rgba(26, 30, 38, 0.85);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 194, 255, 0.05);
                }
                .progress-bar-container {
                    width: 100%;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 12px 0 8px 0;
                }
                .progress-fill {
                    height: 100%;
                    background: #00c2ff;
                    box-shadow: 0 0 15px rgba(0, 194, 255, 0.6);
                    transition: width 0.3s ease-out;
                }
                .upload-label {
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: rgba(255, 255, 255, 0.9);
                }
                .upload-counter {
                    font-size: 10px;
                    font-weight: 900;
                    color: rgba(255, 255, 255, 0.4);
                }
                .percent-text {
                    font-size: 14px;
                    font-weight: 900;
                    color: #00c2ff;
                }
            `}</style>

            <div className="upload-status-card">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-cloud-arrow-up text-[#00c2ff] text-xs animate-pulse"></i>
                        <span className="upload-label">Enviando</span>
                    </div>
                    <span className="upload-counter">{current} / {total}</span>
                </div>
                
                <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                
                <div className="flex justify-end">
                    <span className="percent-text">{progress}%</span>
                </div>
            </div>
        </div>
    );
};
