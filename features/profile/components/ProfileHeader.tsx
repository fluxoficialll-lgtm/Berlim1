
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainHeader } from '../../../components/layout/MainHeader';

interface ProfileHeaderProps {
    onHomeClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onHomeClick }) => {
    const navigate = useNavigate();
    
    return (
        <MainHeader 
            leftContent={
                <button onClick={() => navigate('/rank')} className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer">
                    <i className="fa-solid fa-trophy"></i>
                </button>
            }
            rightContent={
                <button onClick={() => navigate('/settings')} className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer">
                    <i className="fa-solid fa-gear"></i>
                </button>
            }
            onLogoClick={onHomeClick}
        />
    );
};
