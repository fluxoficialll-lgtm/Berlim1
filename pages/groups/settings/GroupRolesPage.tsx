import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupSettings } from '../../../features/groups/hooks/useGroupSettings';
import { GroupRole } from '../../../types';
import { useModal } from '../../../components/ModalSystem';
import { RoleListItem } from '../../../features/groups/components/settings/roles/RoleListItem';
import { RoleEditor } from '../../../features/groups/components/settings/roles/RoleEditor';

export const GroupRolesPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { group, loading, handleSave, form } = useGroupSettings();
    const { showConfirm } = useModal();

    const [editingRole, setEditingRole] = useState<GroupRole | null>(null);

    const colors = [
        '#00c2ff', '#00ff82', '#ffaa00', '#ff4d4d', '#ee2a7b', 
        '#6228d7', '#ffffff', '#aaaaaa', '#FFD700', '#4285F4'
    ];

    if (loading || !group) return null;

    const handleAddRole = () => {
        const newRole: GroupRole = {
            id: `role_${Date.now()}`,
            name: 'Novo Cargo',
            color: '#00c2ff',
            priority: form.roles.length + 1,
            permissions: {
                isAdmin: false,
                canEditGroupInfo: false,
                canManageRoles: false,
                canViewAuditLogs: false,
                canViewRevenue: false,
                canSendMessages: true,
                canDeleteMessages: false,
                canPinMessages: false,
                canBypassSlowMode: false,
                canKickMembers: false,
                canBanMembers: false,
                canApproveMembers: false,
                canInviteMembers: false,
                canManageFolders: false,
                canManageFiles: false,
                canPostScheduled: false,
                canManageAds: false
            }
        };
        form.setRoles([...form.roles, newRole]);
        setEditingRole(newRole);
    };

    const handleDeleteRole = async (roleId: string) => {
        if (await showConfirm('Excluir Cargo', 'Tem certeza que deseja apagar este cargo? Membros associados perderão as permissões.')) {
            form.setRoles(form.roles.filter(r => r.id !== roleId));
            if (editingRole?.id === roleId) setEditingRole(null);
        }
    };

    const updateEditingRole = (updates: Partial<GroupRole>) => {
        if (!editingRole) return;
        const updated = { ...editingRole, ...updates };
        setEditingRole(updated);
        form.setRoles(form.roles.map(r => r.id === updated.id ? updated : r));
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
                <button onClick={() => navigate(`/group-settings/${id}`)} className="mr-4 text-white text-xl">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold">Gestão de Cargos</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-5 max-w-[900px] mx-auto w-full pb-32 no-scrollbar">
                <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cargos Existentes</h2>
                            <button onClick={handleAddRole} className="text-[#00c2ff] text-[10px] font-black uppercase"><i className="fa-solid fa-plus-circle"></i> Criar</button>
                        </div>
                        
                        <div className="space-y-2">
                            {form.roles.map(role => (
                                <RoleListItem 
                                    key={role.id}
                                    role={role}
                                    isActive={editingRole?.id === role.id}
                                    onClick={() => setEditingRole(role)}
                                    onDelete={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}
                                />
                            ))}
                            {form.roles.length === 0 && <div className="text-center py-10 opacity-30 italic text-xs">Nenhum cargo criado.</div>}
                        </div>
                    </div>

                    {editingRole ? (
                        <RoleEditor 
                            role={editingRole}
                            onUpdate={updateEditingRole}
                            colors={colors}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center">
                            <i className="fa-solid fa-id-card-clip text-6xl mb-4"></i>
                            <p className="text-sm font-bold uppercase tracking-widest">Selecione um cargo para editar</p>
                        </div>
                    )}
                </div>

                <button className="btn-save-fixed" onClick={handleSave}>Salvar Alterações de Cargos</button>
            </main>
        </div>
    );
};