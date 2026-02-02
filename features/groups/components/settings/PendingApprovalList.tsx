import React from 'react';
import { User } from '../../../../types';

interface PendingApprovalListProps {
  users: User[];
  onAction: (userId: string, action: 'accept' | 'deny') => void;
}

export const PendingApprovalList: React.FC<PendingApprovalListProps> = ({ users, onAction }) => (
  <div className="bg-[#ffaa001a] border border-[#ffaa0033] rounded-2xl p-6">
    <h4 className="text-xs font-black text-[#ffaa00] uppercase tracking-widest mb-4">Sala de Espera ({users.length})</h4>
    <div className="space-y-3">
      {users.map(user => (
        <div key={user.id} className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
          <span className="text-sm font-bold truncate pr-4">{user.profile?.nickname || user.profile?.name}</span>
          <div className="flex gap-2">
            <button onClick={() => onAction(user.id, 'accept')} className="w-9 h-9 rounded-lg bg-[#00ff821a] text-[#00ff82]"><i className="fa-solid fa-check"></i></button>
            <button onClick={() => onAction(user.id, 'deny')} className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500"><i className="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      ))}
      {users.length === 0 && <p className="text-center text-[10px] text-gray-500 uppercase font-bold py-4">Nenhuma solicitação pendente</p>}
    </div>
  </div>
);