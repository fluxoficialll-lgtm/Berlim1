
import React from 'react';

interface OptionToggleProps {
    label: string;
    sublabel?: string;
    icon: string;
    checked: boolean;
    onChange: () => void;
    danger?: boolean;
}

export const OptionToggle: React.FC<OptionToggleProps> = ({ label, sublabel, icon, checked, onChange, danger }) => (
    <div className={`flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 transition-colors ${checked && danger ? 'border-red-500/30 bg-red-500/5' : ''}`}>
        <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${checked ? 'bg-[#00c2ff1a] text-[#00c2ff]' : 'bg-black/20 text-gray-500'}`}>
                <i className={`fa-solid ${icon} text-xs`}></i>
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-200 truncate">{label}</span>
                {sublabel && <span className="text-[9px] text-gray-600 uppercase font-black tracking-wider truncate">{sublabel}</span>}
            </div>
        </div>
        <label className="switch">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="slider-switch"></span>
        </label>
    </div>
);
