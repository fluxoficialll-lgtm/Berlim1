
import React, { useState } from 'react';
import { User, GroupLink } from '../../../../types';
import { groupService } from '../../../../services/groupService';

interface AccessSectionProps {
    groupId: string;
    isAdmin: boolean;
    approveMembers: boolean;
    setApproveMembers: (val: boolean) => void;
    pendingRequests: User[];
    handlePendingAction: (id: string, action: 'accept' | 'deny') => void;
    links: GroupLink[];
    setLinks: (links: GroupLink[]) => void;
}

export const AccessSection: React.FC<AccessSectionProps> = ({
    groupId, isAdmin, approveMembers, setApproveMembers, pendingRequests, handlePendingAction, links, setLinks
}) => {
    const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
    const [newLinkName, setNewLinkName] = useState('');
    const [maxUses, setMaxUses] = useState('');

    const handleCreateLink = () => {
        if (!newLinkName.trim()) return;
        const uses = maxUses ? parseInt(maxUses) : undefined;
        const link = groupService.addGroupLink(groupId, newLinkName, uses);
        if (link) {
            setLinks([link, ...links]);
            setNewLinkName('');
            setMaxUses('');
            setIsLinksModalOpen(false);
        }
    };

    const handleCopyLink = (code: string) => {
        const url = `${window.location.origin}/#/groups?join=${code}`;
        navigator.clipboard.writeText(url);
        alert('Link copiado!');
    };

    return (
        <div className="flex flex-col gap-4">
            {isAdmin && (
                <div className="flex items-center justify-between py-2 border-b border-white/5 mb-2">
                    <div className="flex flex-col">
                        <h4 className="font-bold text-sm text-white">Aprovar Membros</h4>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Moderação de entrada ativa</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={approveMembers} onChange={() => setApproveMembers(!approveMembers)} />
                        <span className="slider"></span>
                    </label>
                </div>
            )}

            {pendingRequests.length > 0 && (
                <div className="bg-[#ffaa00]/10 border border-[#ffaa00]/20 rounded-xl p-4 mb-2">
                    <div className="text-[10px] font-black text-[#ffaa00] uppercase mb-3 tracking-widest">Solicitações Pendentes ({pendingRequests.length})</div>
                    <div className="flex flex-col gap-2">
                        {pendingRequests.slice(0, 3).map(u => (
                            <div key={u.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                                <span className="text-xs font-bold truncate pr-4">{u.profile?.nickname || u.profile?.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handlePendingAction(u.id, 'accept')} className="w-8 h-8 rounded-lg bg-[#00ff82]/10 text-[#00ff82] flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></button>
                                    <button onClick={() => handlePendingAction(u.id, 'deny')} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-xs"><i className="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Links de Convite</label>
                    {isAdmin && <button onClick={() => setIsLinksModalOpen(true)} className="text-[#00c2ff] text-[10px] font-black uppercase tracking-wider"><i className="fa-solid fa-plus-circle mr-1"></i> Gerar Novo</button>}
                </div>
                
                <div className="space-y-2">
                    {links.map(link => (
                        <div key={link.id} className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">{link.name}</div>
                                <div className="text-[10px] font-mono text-gray-500 mt-0.5 uppercase tracking-tighter">REF: {link.code}</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="text-[10px] font-black text-[#00ff82]">{link.joins} <i className="fa-solid fa-user-plus ml-0.5"></i></div>
                                <button onClick={() => handleCopyLink(link.code)} className="text-[#00c2ff] hover:text-white transition-colors p-2"><i className="fa-regular fa-copy"></i></button>
                            </div>
                        </div>
                    ))}
                    {links.length === 0 && <div className="text-center py-4 text-xs text-gray-600 italic">Nenhum link ativo.</div>}
                </div>
            </div>

            {isLinksModalOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-6 backdrop-blur-sm">
                    <div className="bg-[#1a1e26] p-8 rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl animate-pop-in">
                        <h3 className="text-lg font-black mb-6 uppercase tracking-wider text-center">Criar Link</h3>
                        <div className="input-group">
                            <label>Nome do Canal (Origem)</label>
                            <input type="text" className="input-field" placeholder="Ex: Bio Instagram" value={newLinkName} onChange={e => setNewLinkName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Limite de Usos (Opcional)</label>
                            <input type="number" className="input-field" placeholder="Ilimitado" value={maxUses} onChange={e => setMaxUses(e.target.value)} />
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button className="flex-1 py-4 bg-white/5 text-gray-400 font-bold rounded-2xl uppercase text-xs" onClick={() => setIsLinksModalOpen(false)}>Cancelar</button>
                            <button className="flex-1 py-4 bg-[#00c2ff] text-black font-black rounded-2xl uppercase text-xs shadow-lg shadow-[#00c2ff]/20" onClick={handleCreateLink}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
