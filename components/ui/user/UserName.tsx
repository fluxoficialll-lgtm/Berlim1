
import React from 'react';

interface UserNameProps {
    nickname?: string;
    handle?: string;
    isVip?: boolean;
    isVerified?: boolean;
    showHandle?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const UserName: React.FC<UserNameProps> = ({
    nickname,
    handle,
    isVip = false,
    isVerified = false,
    showHandle = true,
    size = 'md',
    className = '',
    onClick
}) => {
    const displayName = nickname || handle?.replace('@', '') || 'Usuário';
    const displayHandle = handle?.startsWith('@') ? handle : `@${handle || 'user'}`;

    const sizeClasses = {
        sm: { name: 'text-[13px]', handle: 'text-[10px]' },
        md: { name: 'text-base', handle: 'text-xs' },
        lg: { name: 'text-xl', handle: 'text-sm' }
    };

    return (
        <div className={`flex flex-col min-w-0 ${className} cursor-pointer`} onClick={onClick}>
            <div className="flex items-center gap-1.5 min-w-0">
                <span className={`font-bold truncate ${sizeClasses[size].name} ${isVip ? 'text-[#FFD700]' : 'text-white'}`}>
                    {displayName}
                </span>
                {isVerified && <i className="fa-solid fa-circle-check text-[#00c2ff] text-[10px]"></i>}
                {isVip && <span className="bg-[#FFD700] text-black text-[8px] font-black px-1 rounded-sm leading-tight">VIP</span>}
            </div>
            {showHandle && (
                <span className={`font-medium opacity-50 truncate ${sizeClasses[size].handle} ${isVip ? 'text-[#FFD700]' : 'text-gray-400'}`}>
                    {displayHandle}
                </span>
            )}
        </div>
    );
};
