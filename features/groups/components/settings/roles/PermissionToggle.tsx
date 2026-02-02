import React from 'react';

interface PermissionToggleProps {
    label: string;
    active: boolean;
    onToggle: () => void;
    danger?: boolean;
}

export const PermissionToggle: React.FC<PermissionToggleProps> = ({ 
    label, 
    active, 
    onToggle, 
    danger = false 
}) => (
    <div className="flex items-center justify-between py-2">
        <span className={`text-sm font-bold ${active && danger ? 'text-red-400' : 'text-gray-300'}`}>{label}</span>
        <label className="switch">
            <input type="checkbox" checked={active} onChange={onToggle} />
            <span className="slider-switch"></span>
        </label>
    </div>
);