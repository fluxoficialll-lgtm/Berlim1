
import React from 'react';

interface MemberListProps {
    children: React.ReactNode;
}

export const MemberList: React.FC<MemberListProps> = ({ children }) => {
    return (
        <div className="space-y-1 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
            {children}
        </div>
    );
};
