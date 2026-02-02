
import { useState, useEffect } from 'react';
import { groupService } from '../../../../services/groupService';
import { AuditLog } from '../../../../types';

export const useGroupAuditLogs = (groupId: string | undefined) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const group = groupService.getGroupById(groupId);
            if (group) {
                // Se o grupo não tiver logs reais, injetamos mocks para demonstração conforme o padrão do app
                const auditData = group.auditLogs || [
                    { 
                        id: '1', 
                        adminId: '1', 
                        adminName: 'Sistema Flux', 
                        action: 'Criação do Grupo', 
                        target: 'Estrutura inicial do grupo configurada', 
                        timestamp: Date.now() - 7200000 
                    }
                ];
                setLogs(auditData.sort((a, b) => b.timestamp - a.timestamp));
            }
        } catch (e) {
            console.error("Erro ao carregar logs:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, [groupId]);

    return {
        logs,
        loading,
        refresh: loadLogs
    };
};
