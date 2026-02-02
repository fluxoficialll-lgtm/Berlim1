
import React from 'react';
import { UserAvatar } from '../../../components/ui/user/UserAvatar';
import { UserName } from '../../../components/ui/user/UserName';

interface ProfileInfoCardProps {
    avatar?: string;
    nickname: string;
    username: string;
    bio: string;
    website?: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
    onAvatarClick: () => void;
    onFollowersClick: () => void;
    onFollowingClick: () => void;
    onEditClick: () => void;
    onShareClick: () => void;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
    avatar, nickname, username, bio, website, stats,
    onAvatarClick, onFollowersClick, onFollowingClick, onEditClick, onShareClick
}) => {
    return (
        <div className="profile-card-box">
            <UserAvatar 
                src={avatar} 
                size="xl" 
                isVip={false} // Pode ser estendido se o usuário tiver tag VIP global
                onClick={onAvatarClick} 
                alt={nickname}
                className="mb-4"
            />
            
            <UserName 
                nickname={nickname}
                handle={username}
                size="lg"
                className="items-center"
                onClick={onEditClick}
            />
            
            <div className="profile-stats-container">
                <div className="stat-box">
                    <span className="stat-value">{stats.posts}</span> 
                    <span className="stat-label">Posts</span>
                </div>
                <div className="stat-box" onClick={onFollowersClick}>
                    <span className="stat-value">{stats.followers}</span> 
                    <span className="stat-label">Seguidores</span>
                </div>
                <div className="stat-box" onClick={onFollowingClick}>
                    <span className="stat-value">{stats.following}</span> 
                    <span className="stat-label">Seguindo</span>
                </div>
            </div>

            <p className="profile-bio">{bio}</p>
            
            {website && (
                <a href={website} target="_blank" rel="noopener noreferrer" className="profile-link">
                    <i className="fa-solid fa-link"></i> 
                    {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
            )}

            <div className="profile-actions">
                <button onClick={onEditClick}><i className="fa-solid fa-pen"></i> Editar Perfil</button>
                <button onClick={onShareClick}><i className="fa-solid fa-share-nodes"></i> Compartilhar</button>
            </div>
        </div>
    );
};
