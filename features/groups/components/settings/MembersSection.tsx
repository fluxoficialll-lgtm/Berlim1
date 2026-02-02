
import React from 'react';
import { MemberSearchBar } from './members/MemberSearchBar';
import { MemberList } from './members/MemberList';
import { MemberItem } from './members/MemberItem';
import { RoleAssignmentModal } from './members/RoleAssignmentModal';
import { useRoleAssignment } from '../../hooks/settings/useRoleAssignment';
import { GroupRole } from '../../../../types';

interface Member {
    id: string;
    name: string;
    role: string;
    isMe: boolean;
    avatar?: string;
    roleId?: string;
}

interface MembersSectionProps {
    groupId: string;
    isAdmin: boolean;
    members: Member[];
    onAction: (id: string, action: 'kick' | 'ban' | 'promote' | 'demote') => void;
    searchQuery: string;
    onSearchChange: (val: string) => void;
    availableRoles: GroupRole[];
}

export const MembersSection: React.FC<MembersSectionProps> = ({ 
    groupId, isAdmin, members, onAction, searchQuery, onSearchChange, availableRoles
}) => {
    const { isModalOpen, setIsModalOpen, selectedMember, openAssignment, handleAssignRole } = useRoleAssignment(groupId);

    return (
        <div className="flex flex-col">
            <MemberSearchBar value={searchQuery} onChange={onSearchChange} />
            
            <MemberList>
                {members.length > 0 ? (
                    members.map(member => (
                        <MemberItem 
                            key={member.id} 
                            member={member} 
                            isAdmin={isAdmin} 
                            onAction={onAction} 
                            onRoleClick={openAssignment}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center gap-3">
                        <i className="fa-solid fa-user-slash text-3xl"></i>
                        <p className="italic text-xs uppercase font-black tracking-widest">Nenhum membro encontrado</p>
                    </div>
                )}
            </MemberList>

            <RoleAssignmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                roles={availableRoles}
                currentRoleId={selectedMember?.currentRole}
                memberName={selectedMember?.name || ''}
                onAssign={handleAssignRole}
            />
        </div>
    );
};
