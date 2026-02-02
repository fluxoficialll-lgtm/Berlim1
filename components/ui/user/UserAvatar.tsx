
import React, { useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface UserAvatarProps {
    src?: string;
    alt?: string;
    size?: AvatarSize;
    isVip?: boolean;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

const sizeMap: Record<AvatarSize, string> = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-[100px] h-[100px] text-3xl'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
    src, 
    alt = 'User', 
    size = 'md', 
    isVip = false,
    className = '',
    onClick 
}) => {
    const [hasError, setHasError] = useState(false);

    const baseClasses = `rounded-full flex-shrink-0 flex items-center justify-center border overflow-hidden transition-all ${sizeMap[size]} ${className}`;
    const borderClass = isVip ? 'border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.2)]' : 'border-white/10';
    const bgClass = 'bg-[#1e2531]';

    if (src && !hasError) {
        return (
            <div className={`${baseClasses} ${borderClass} ${bgClass} cursor-pointer`} onClick={onClick}>
                <img 
                    src={src} 
                    alt={alt} 
                    onError={() => setHasError(true)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div className={`${baseClasses} ${borderClass} ${bgClass} text-[#00c2ff] cursor-pointer`} onClick={onClick}>
            <i className={`fa-solid ${isVip ? 'fa-crown' : 'fa-user'}`}></i>
        </div>
    );
};
