
import React from 'react';

interface CheckoutMethodItemProps {
    id: string;
    label: string;
    icon: string;
    color: string;
    badge?: string;
    isActive: boolean;
    onToggle: (id: string) => void;
}

export const CheckoutMethodItem: React.FC<CheckoutMethodItemProps> = ({
    id, label, icon, color, badge, isActive, onToggle
}) => {
    // Usamos stopPropagation no checkbox e tratamos o clique no container principal de forma isolada
    const handleContainerClick = () => {
        onToggle(id);
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // O evento de change não precisa de stopPropagation pois não borbulha igual ao click
        onToggle(id);
    };

    return (
        <div 
            className={`flex items-center justify-between p-4 bg-black/20 rounded-2xl border transition-all cursor-pointer ${
                isActive ? 'border-[#00c2ff] bg-[#00c2ff08]' : 'border-white/5'
            }`}
            onClick={handleContainerClick}
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40" style={{ color }}>
                    <i className={`fa-solid ${icon} text-lg`}></i>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-200">{label}</span>
                    {badge && (
                        <span className="text-[8px] font-black uppercase text-[#00ff82] tracking-tighter">
                            {badge}
                        </span>
                    )}
                </div>
            </div>
            <label className="switch" onClick={e => e.stopPropagation()}>
                <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={handleSwitchChange} 
                />
                <span className="slider-switch"></span>
            </label>
        </div>
    );
};
