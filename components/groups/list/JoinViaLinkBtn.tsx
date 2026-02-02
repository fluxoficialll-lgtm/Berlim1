import React from 'react';

interface JoinViaLinkBtnProps {
    onClick: () => void;
}

export const JoinViaLinkBtn: React.FC<JoinViaLinkBtnProps> = ({ onClick }) => {
    return (
        <button 
            className="join-via-link-btn w-full padding-4 mb-5 bg-[#00c2ff0d] border border-dashed border-[#00c2ff] rounded-[12px] text-[#00c2ff] font-semibold cursor-pointer flex items-center justify-center gap-2.5 transition-all h-[54px]"
            onClick={onClick}
        >
            <i className="fa-solid fa-link"></i> Entrar no Grupo via Link
        </button>
    );
};