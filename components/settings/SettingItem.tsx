
import React from 'react';

interface SettingItemProps {
    icon: string;
    label: string;
    onClick: () => void;
    rightElement?: React.ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = ({ icon, label, onClick, rightElement }) => {
    return (
        <div onClick={onClick} className="setting-item">
            <div className="setting-info">
                <i className={`fas ${icon}`}></i>
                <p>{label}</p>
            </div>
            {rightElement || <i className="fas fa-chevron-right text-gray-600 text-xs"></i>}
        </div>
    );
};
