
import { useState } from 'react';
import { groupService } from '../../../../services/groupService';
import { useModal } from '../../../../components/ModalSystem';
import { GroupAuditService } from '../../../../services/real/groups/GroupAuditService';

export const useRoleAssignment = (groupId: string) => {
    const { showAlert } = useModal();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<{ id: string, name: string, currentRole?: string } | null>(null);

    const openAssignment = (memberId: string, name: string, currentRole?: string) => {
        setSelectedMember({ id: memberId, name, currentRole });
        setIsModalOpen(true);
    };

    const handleAssignRole = async (roleId: string) => {
        if (!selectedMember) return;
        
        try {
            // Em uma implementação real, o groupService teria um método updateMemberRole
            // Para este protótipo, simulamos a persistência e logamos a auditoria.
            await GroupAuditService.logAction(
                groupId, 
                'ALTERACAO_CARGO', 
                `Cargo de ${selectedMember.name} alterado para ID: ${roleId}`
            );
            
            await showAlert("Sucesso", `O cargo de ${selectedMember.name} foi atualizado.`);
            setIsModalOpen(false);
        } catch (e) {
            await showAlert("Erro", "Falha ao atualizar cargo.");
        }
    };

    return {
        isModalOpen,
        setIsModalOpen,
        selectedMember,
        openAssignment,
        handleAssignRole
    };
};
