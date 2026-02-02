
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MessagesFooterProps {
  uiVisible: boolean;
  unreadMsgs: number;
  unreadNotifs: number;
}

export const MessagesFooter: React.FC<MessagesFooterProps> = ({
  uiVisible,
  unreadMsgs,
  unreadNotifs,
}) => {
  const navigate = useNavigate();

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full bg-[#0c0f14] flex justify-around py-3.5 rounded-t-2xl z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
        uiVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <button onClick={() => navigate('/feed')} className="text-[#00c2ff] text-[22px] p-2">
        <i className="fa-solid fa-newspaper"></i>
      </button>
      <button className="text-white text-[22px] p-2 relative">
        <i className="fa-solid fa-comments"></i>
        {unreadMsgs > 0 && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#ff4d4d] rounded-full"></div>
        )}
      </button>
      <button
        onClick={() => navigate('/notifications')}
        className="text-[#00c2ff] text-[22px] p-2 relative"
      >
        <i className="fa-solid fa-bell"></i>
        {unreadNotifs > 0 && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#ff4d4d] rounded-full"></div>
        )}
      </button>
      <button onClick={() => navigate('/profile')} className="text-[#00c2ff] text-[22px] p-2">
        <i className="fa-solid fa-user"></i>
      </button>
    </footer>
  );
};
