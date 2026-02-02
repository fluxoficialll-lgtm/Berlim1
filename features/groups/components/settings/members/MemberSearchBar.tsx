
import React from 'react';

interface MemberSearchBarProps {
    value: string;
    onChange: (val: string) => void;
}

export const MemberSearchBar: React.FC<MemberSearchBarProps> = ({ value, onChange }) => {
    return (
        <div className="relative mb-4">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs"></i>
            <input 
                type="text" 
                className="input-field pl-10 border-white/5" 
                placeholder="Pesquisar @membro..." 
                value={value} 
                onChange={e => onChange(e.target.value)} 
            />
        </div>
    );
};
