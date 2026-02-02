import React from 'react';
import { GroupLink } from '../../../../types';

interface InviteLinkManagerProps {
  links: GroupLink[];
  onCreate: () => void;
  onDelete: (id: string) => void;
  onCopy: (code: string) => void;
}

export const InviteLinkManager: React.FC<InviteLinkManagerProps> = ({ links, onCreate, onDelete, onCopy }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Links de Convite</h4>
      <button onClick={onCreate} className="text-[#00c2ff] text-[10px] font-black uppercase">+ Criar Link</button>
    </div>
    {links.map(link => (
      <div key={link.id} className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-white">{link.name}</div>
          <div className="text-[10px] text-gray-500 font-mono">REF: {link.code}</div>
        </div>
        <div className="flex gap-4">
          <div className="text-[#00ff82] text-xs font-bold">{link.joins} entradas</div>
          <button onClick={() => onCopy(link.code)} className="text-gray-400 hover:text-white"><i className="fa-solid fa-copy"></i></button>
          <button onClick={() => onDelete(link.id)} className="text-red-500/50 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
        </div>
      </div>
    ))}
  </div>
);