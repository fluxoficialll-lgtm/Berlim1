
import React from 'react';

interface PodiumItemProps {
    user: {
        profile?: {
            name: string;
            nickname?: string;
            photoUrl?: string;
        };
    };
    position: 1 | 2 | 3;
    followerCount: number;
    onClick: (username: string) => void;
}

export const PodiumItem: React.FC<PodiumItemProps> = ({ user, position, followerCount, onClick }) => {
    const getPlaceClass = () => {
        if (position === 1) return 'first-place';
        if (position === 2) return 'second-place';
        return 'third-place';
    };

    const username = user.profile?.name || '';
    const displayName = user.profile?.nickname || user.profile?.name;

    return (
        <div className={`podium-item ${getPlaceClass()}`} onClick={() => onClick(username)}>
            <div className="podium-avatar-wrapper">
                <i className="fa-solid fa-crown crown-icon"></i>
                <img 
                    src={user.profile?.photoUrl || 'https://via.placeholder.com/150'} 
                    className="podium-avatar" 
                    alt={String(position)} 
                />
                <div className="rank-badge">{position}</div>
            </div>
            <div className="podium-name">{displayName}</div>
            <div className="podium-count">{followerCount} seguidores</div>
        </div>
    );
};
