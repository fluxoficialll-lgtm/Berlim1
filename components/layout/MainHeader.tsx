
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MainHeaderProps {
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    onLogoClick?: () => void;
    hideLogo?: boolean;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ leftContent, rightContent, onLogoClick, hideLogo = false }) => {
    const navigate = useNavigate();
    
    const handleLogoClick = () => {
        if (onLogoClick) {
            onLogoClick();
            return;
        }
        // Correção de UX: O Logotipo principal deve sempre levar à Home Global (/feed)
        navigate('/feed');
    };

    return (
        <header className="flex items-center justify-between p-[16px_32px] bg-[#0c0f14] fixed w-full z-50 border-b border-white/10 h-[80px] top-0 left-0">
            <div className="z-30 flex items-center min-w-[40px]">
                {leftContent}
            </div>

            {!hideLogo && (
                <div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-white/5 rounded-2xl flex justify-center items-center z-20 cursor-pointer shadow-[0_0_20px_rgba(0,194,255,0.3),inset_0_0_20px_rgba(0,194,255,0.08)]" 
                    onClick={handleLogoClick}
                >
                     <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] rotate-[25deg]"></div>
                     <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] -rotate-[25deg]"></div>
                </div>
            )}

            <div className="z-30 flex items-center justify-end min-w-[40px]">
                {rightContent}
            </div>
        </header>
    );
};
