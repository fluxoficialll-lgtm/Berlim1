
import React from 'react';

export const MessagesEmptyState: React.FC = () => {
  return (
    <div className="text-center py-20 opacity-20">
      <i className="fa-regular fa-comment-dots text-5xl mb-4"></i>
      <p className="font-bold uppercase tracking-widest text-sm">Sem conversas privadas</p>
    </div>
  );
};
