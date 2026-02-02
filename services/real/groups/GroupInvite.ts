
import { db } from '@/database';
import { GroupLink } from '../../../types';
import { GroupCore } from './GroupCore';
import { GroupModeration } from './GroupModeration';

export const GroupInvite = {
    addGroupLink(groupId: string, name: string, maxUses?: number, expiresAt?: string): GroupLink | null {
        const group = db.groups.findById(groupId);
        if (!group) return null;
        const link: GroupLink = { 
            id: Date.now().toString(), 
            name, 
            code: Math.random().toString(36).substr(2, 6).toUpperCase(), 
            joins: 0, 
            createdAt: Date.now(),
            maxUses,
            expiresAt
        };
        group.links = [link, ...(group.links || [])];
        GroupCore.updateGroup(group);
        return link;
    },

    removeGroupLink(groupId: string, linkId: string) {
        const group = db.groups.findById(groupId);
        if (group && group.links) {
            group.links = group.links.filter(l => l.id !== linkId);
            GroupCore.updateGroup(group);
        }
    },

    joinGroupByLinkCode(code: string): { success: boolean; message: string; groupId?: string } {
        const allGroups = db.groups.getAll();
        for (const g of allGroups) {
            const link = g.links?.find(l => l.code === code);
            if (link) {
                if (link.maxUses && link.joins >= link.maxUses) return { success: false, message: "Link esgotado." };
                const res = GroupModeration.joinGroup(g.id);
                if (res === 'joined') {
                    link.joins++;
                    GroupCore.updateGroup(g);
                    return { success: true, message: "Bem-vindo!", groupId: g.id };
                }
                return { success: false, message: "Erro ao entrar." };
            }
        }
        return { success: false, message: "Código inválido." };
    }
};
