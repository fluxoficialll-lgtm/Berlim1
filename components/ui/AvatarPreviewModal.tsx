
import React, { useState } from 'react';

interface AvatarPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    username: string;
}

export const AvatarPreviewModal: React.FC<AvatarPreviewModalProps> = ({ isOpen, onClose, imageSrc, username }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!isOpen) return null;

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <style>{`
                .avatar-modal-container {
                    width: 300px;
                    height: 300px;
                    background: #1a1e26;
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.1);
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .avatar-modal-fullscreen {
                    width: 100vw;
                    height: 100vh;
                    border-radius: 0;
                    border: none;
                    background: black;
                }
                .avatar-modal-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    cursor: pointer;
                    transition: object-fit 0.3s;
                }
                .avatar-modal-fullscreen .avatar-modal-img {
                    object-fit: contain;
                }
                .close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    z-index: 110;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    items-center;
                    justify-content: center;
                    border: none;
                    cursor: pointer;
                }
                .modal-label {
                    position: absolute;
                    bottom: 15px;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    font-weight: bold;
                    color: rgba(255,255,255,0.5);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    pointer-events: none;
                }
            `}</style>

            <button className="close-btn" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>

            <div 
                className={`avatar-modal-container ${isFullscreen ? 'avatar-modal-fullscreen' : ''} animate-pop-in`}
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={imageSrc} 
                    alt={username} 
                    className="avatar-modal-img" 
                    onClick={handleImageClick}
                />
                {!isFullscreen && <div className="modal-label">Toque para ampliar</div>}
            </div>
        </div>
    );
};
