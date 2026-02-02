import React from 'react';
import { GroupRole } from '../../../../types';

interface RoleListItemProps {
    role: GroupRole;
    isActive: boolean;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

export const RoleListItem: React.FC<RoleListItemProps> = ({ 
    role, 
    isActive, 
    onClick, 
    onDelete 
}) => {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                isActive 
                ? 'bg-[#00c2ff1a] border-[#00c2ff]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
                <span className="font-bold text-sm">{role.name}</span>
            </div>
            <button 
                onClick={onDelete}
                className="text-gray-700 hover:text-red-500"
            >
                <i className="fa-solid fa-trash-can"></i>
            </button>
        </div>
    );
};