
import React from 'react';

interface LeaderboardListItemProps {
    user: {
        profile?: {
            name: string;
            nickname?: string;
            photoUrl?: string;
        };
    };
    rank: number;
    followerCount: number;
    onClick: (username: string) => void;
}

export const LeaderboardListItem: React.FC<LeaderboardListItemProps> = ({ user, rank, followerCount, onClick }) => {
    const username = user.profile?.name || '';
    const displayName = user.profile?.nickname || user.profile?.name;

    return (
        <div className="rank-item" onClick={() => onClick(username)}>
            <div className="rank-number">#{rank}</div>
            <img 
                src={user.profile?.photoUrl || 'https://via.placeholder.com/150'} 
                className="list-avatar" 
                alt="avatar" 
            />
            <div className="list-info">
                <span className="list-name">{displayName}</span>
                <span className="list-username">@{username}</span>
            </div>
            <div className="list-count">
                {followerCount} seg
            </div>
        </div>
    );
};
