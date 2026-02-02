
import React from 'react';
import { UserAvatar, AvatarSize } from './UserAvatar';
import { UserName } from './UserName';

interface UserBadgeProps {
    avatarUrl?: string;
    nickname?: string;
    handle?: string;
    isVip?: boolean;
    isVerified?: boolean;
    avatarSize?: AvatarSize;
    showHandle?: boolean;
    layout?: 'row' | 'col';
    gap?: string;
    className?: string;
    onAvatarClick?: (e: React.MouseEvent) => void;
    onNameClick?: (e: React.MouseEvent) => void;
}

export const UserBadge: React.FC<UserBadgeProps> = ({
    avatarUrl,
    nickname,
    handle,
    isVip,
    isVerified,
    avatarSize = 'md',
    showHandle = true,
    layout = 'row',
    gap = 'gap-3',
    className = '',
    onAvatarClick,
    onNameClick
}) => {
    return (
        <div className={`flex ${layout === 'row' ? 'flex-row items-center' : 'flex-col items-center text-center'} ${gap} ${className}`}>
            <UserAvatar 
                src={avatarUrl} 
                isVip={isVip} 
                size={avatarSize} 
                onClick={onAvatarClick} 
                alt={nickname}
            />
            <UserName 
                nickname={nickname} 
                handle={handle} 
                isVip={isVip} 
                isVerified={isVerified}
                showHandle={showHandle}
                size={avatarSize === 'lg' || avatarSize === 'xl' ? 'lg' : (avatarSize === 'xs' ? 'sm' : 'md')}
                onClick={onNameClick}
            />
        </div>
    );
};
