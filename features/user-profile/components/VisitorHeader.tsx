
import React, { useState, useRef, useEffect } from 'react';
import { MainHeader } from '../../../components/layout/MainHeader';

interface VisitorHeaderProps {
    onBack: () => void;
    onLogoClick: () => void;
    isMe: boolean;
    isBlocked: boolean;
    onToggleBlock: () => void;
    onReport: () => void;
    username: string;
}

export const VisitorHeader: React.FC<VisitorHeaderProps> = ({
    onBack, onLogoClick, isMe, isBlocked, onToggleBlock, onReport, username
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <style>{`
                .profile-dropdown { 
                    position: absolute; 
                    top: 40px; 
                    right: 0; 
                    background: #1a1e26; 
                    border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 12px; 
                    width: 160px; 
                    display: flex; 
                    flex-direction: column; 
                    overflow: hidden; 
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6); 
                    z-index: 60; 
                    animation: popIn 0.2s ease-out;
                }
                .profile-dropdown button { 
                    padding: 12px 16px; 
                    text-align: left; 
                    font-size: 13px; 
                    color: #fff; 
                    background: none;
                    border: none;
                    border-bottom: 1px solid rgba(255,255,255,0.05); 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    cursor: pointer;
                    transition: 0.2s;
                }
                .profile-dropdown button:hover { background: rgba(255,255,255,0.05); }
                .profile-dropdown button.danger { color: #ff4d4d; }
                
                @keyframes popIn {
                    from { transform: scale(0.9) translateY(-10px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
            
            <MainHeader 
                leftContent={
                    <button onClick={onBack} className="text-[#00c2ff] text-xl">
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                }
                onLogoClick={onLogoClick}
                rightContent={
                    <div className="relative">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="text-[#00c2ff] text-xl p-2"
                        >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        {isMenuOpen && (
                            <div ref={menuRef} className="profile-dropdown">
                                <button onClick={() => { 
                                    navigator.clipboard.writeText(window.location.href); 
                                    setIsMenuOpen(false); 
                                    alert('Link copiado!'); 
                                }}>
                                    <i className="fa-solid fa-link text-[#00c2ff]"></i> Copiar Link
                                </button>
                                {!isMe && (
                                    <>
                                        <button onClick={() => { onReport(); setIsMenuOpen(false); }}>
                                            <i className="fa-solid fa-flag text-gray-400"></i> Denunciar
                                        </button>
                                        <button className="danger" onClick={() => { onToggleBlock(); setIsMenuOpen(false); }}>
                                            <i className="fa-solid fa-ban"></i> {isBlocked ? 'Desbloquear' : 'Bloquear'}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                }
            />
        </>
    );
};
