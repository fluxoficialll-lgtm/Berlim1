import React from 'react';

interface CreateGroupFABProps {
    visible: boolean;
    onClick: () => void;
}

export const CreateGroupFAB: React.FC<CreateGroupFABProps> = ({ visible, onClick }) => {
    return (
        <button 
            onClick={onClick} 
            className={`fixed bottom-[105px] right-[20px] w-[60px] h-[60px] bg-[#00c2ff] border-none rounded-full text-white cursor-pointer shadow-[0_4px_12px_rgba(0,194,255,0.3)] z-20 flex items-center justify-center transition-transform duration-300 ${visible ? 'scale-100' : 'scale-0'}`}
        >
            <i className="fa-solid fa-plus text-2xl"></i>
        </button>
    );
};