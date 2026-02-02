import React from 'react';
import { GroupRole } from '../../../../types';
import { PermissionToggle } from './PermissionToggle';

interface RoleEditorProps {
    role: GroupRole;
    onUpdate: (updates: Partial<GroupRole>) => void;
    colors: string[];
}

export const RoleEditor: React.FC<RoleEditorProps> = ({ role, onUpdate, colors }) => {
    const updatePermission = (key: keyof GroupRole['permissions']) => {
        const newPerms = { ...role.permissions, [key]: !role.permissions[key] };
        onUpdate({ permissions: newPerms });
    };

    const SectionHeader = ({ title, icon }: { title: string, icon: string }) => (
        <div className="flex items-center gap-2 mt-8 mb-4 border-b border-white/5 pb-2">
            <i className={`fa-solid ${icon} text-[#00c2ff] text-[10px]`}></i>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</h4>
        </div>
    );

    return (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-[#00c2ff]">Propriedades do Cargo</h3>
                <div className="px-3 py-1 rounded-full bg-[#00c2ff1a] border border-[#00c2ff33] text-[#00c2ff] text-[10px] font-black uppercase">
                    Prioridade {role.priority}
                </div>
            </div>
            
            <div className="space-y-8">
                <div className="input-group">
                    <label>Nome do Cargo</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        value={role.name} 
                        onChange={e => onUpdate({ name: e.target.value })}
                        placeholder="Ex: Moderador Pleno"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Cor do Cargo</label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map(c => (
                            <button 
                                key={c}
                                onClick={() => onUpdate({ color: c })}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${role.color === c ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    <SectionHeader title="Administração Geral" icon="fa-shield-halved" />
                    <PermissionToggle label="Administrador Total (Perigoso)" active={role.permissions.isAdmin} onToggle={() => updatePermission('isAdmin')} danger />
                    <PermissionToggle label="Editar Info. do Grupo" active={role.permissions.canEditGroupInfo} onToggle={() => updatePermission('canEditGroupInfo')} />
                    <PermissionToggle label="Gerenciar Cargos" active={role.permissions.canManageRoles} onToggle={() => updatePermission('canManageRoles')} />
                    <PermissionToggle label="Ver Logs de Auditoria" active={role.permissions.canViewAuditLogs} onToggle={() => updatePermission('canViewAuditLogs')} />
                    <PermissionToggle label="Ver Faturamento (VIP)" active={role.permissions.canViewRevenue} onToggle={() => updatePermission('canViewRevenue')} />

                    <SectionHeader title="Moderação de Chat" icon="fa-comments" />
                    <PermissionToggle label="Enviar Mensagens" active={role.permissions.canSendMessages} onToggle={() => updatePermission('canSendMessages')} />
                    <PermissionToggle label="Apagar Mensagens (Outros)" active={role.permissions.canDeleteMessages} onToggle={() => updatePermission('canDeleteMessages')} />
                    <PermissionToggle label="Fixar Mensagens" active={role.permissions.canPinMessages} onToggle={() => updatePermission('canPinMessages')} />
                    <PermissionToggle label="Ignorar Modo Lento" active={role.permissions.canBypassSlowMode} onToggle={() => updatePermission('canBypassSlowMode')} />

                    <SectionHeader title="Controle de Membros" icon="fa-users" />
                    <PermissionToggle label="Expulsar Membros" active={role.permissions.canKickMembers} onToggle={() => updatePermission('canKickMembers')} />
                    <PermissionToggle label="Banir Permanentemente" active={role.permissions.canBanMembers} onToggle={() => updatePermission('canBanMembers')} />
                    <PermissionToggle label="Aprovar Solicitações" active={role.permissions.canApproveMembers} onToggle={() => updatePermission('canApproveMembers')} />
                    <PermissionToggle label="Criar Links de Convite" active={role.permissions.canInviteMembers} onToggle={() => updatePermission('canInviteMembers')} />

                    <SectionHeader title="Catálogo e Escala" icon="fa-shop" />
                    <PermissionToggle label="Gerenciar Pastas" active={role.permissions.canManageFolders} onToggle={() => updatePermission('canManageFolders')} />
                    <PermissionToggle label="Gerenciar Arquivos" active={role.permissions.canManageFiles} onToggle={() => updatePermission('canManageFiles')} />
                    <PermissionToggle label="Postagens Agendadas" active={role.permissions.canPostScheduled} onToggle={() => updatePermission('canPostScheduled')} />
                    <PermissionToggle label="Gerenciar Anúncios" active={role.permissions.canManageAds} onToggle={() => updatePermission('canManageAds')} />
                </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/5 opacity-30 text-center">
                <p className="text-[8px] font-black uppercase tracking-[3px]">Segurança Flux v4.4</p>
            </div>
        </div>
    );
};